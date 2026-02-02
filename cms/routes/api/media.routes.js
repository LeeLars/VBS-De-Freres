import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { env } from '../../config/env.js';
import pool from '../../config/database.js';

const router = express.Router();

// Configure Cloudinary
if (env.cloudinary.cloudName) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret
  });
  console.log('Cloudinary configured');
} else {
  console.log('Cloudinary not configured - CLOUDINARY_CLOUD_NAME missing');
}

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all media items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM media ORDER BY created_at DESC'
    );
    res.json({ success: true, media: result.rows });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// Upload new media
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!env.cloudinary.cloudName) {
    return res.status(500).json({ error: 'Cloudinary not configured' });
  }

  try {
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'vbs-de-freres',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Save to database
    const dbResult = await pool.query(
      `INSERT INTO media (filename, url, public_id, width, height, format, size_bytes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.file.originalname,
        result.secure_url,
        result.public_id,
        result.width,
        result.height,
        result.format,
        result.bytes
      ]
    );

    res.json({ 
      success: true, 
      media: dbResult.rows[0],
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Delete media
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Get media item
    const mediaResult = await pool.query(
      'SELECT * FROM media WHERE id = $1',
      [id]
    );

    if (mediaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const media = mediaResult.rows[0];

    // Delete from Cloudinary
    if (media.public_id && env.cloudinary.cloudName) {
      await cloudinary.uploader.destroy(media.public_id);
    }

    // Delete from database
    await pool.query('DELETE FROM media WHERE id = $1', [id]);

    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

export default router;
