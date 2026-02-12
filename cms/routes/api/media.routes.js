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

// Diagnostic check
router.get('/check', async (req, res) => {
  const checks = {
    cloudinaryConfigured: !!env.cloudinary.cloudName,
    cloudinaryCloudName: env.cloudinary.cloudName ? env.cloudinary.cloudName.substring(0, 3) + '...' : 'NOT SET',
    cloudinaryApiKey: env.cloudinary.apiKey ? 'SET' : 'NOT SET',
    cloudinaryApiSecret: env.cloudinary.apiSecret ? 'SET' : 'NOT SET',
    mediaTableExists: false
  };
  try {
    await pool.query('SELECT COUNT(*) FROM media');
    checks.mediaTableExists = true;
  } catch (e) {
    checks.mediaTableError = e.message;
  }
  res.json(checks);
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
  console.log('[UPLOAD] Request received');
  
  if (!req.file) {
    console.log('[UPLOAD] No file in request');
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  console.log(`[UPLOAD] File: ${req.file.originalname}, size: ${req.file.size}, type: ${req.file.mimetype}`);

  if (!env.cloudinary.cloudName) {
    console.log('[UPLOAD] Cloudinary not configured');
    return res.status(500).json({ success: false, error: 'Cloudinary niet geconfigureerd. Voeg CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY en CLOUDINARY_API_SECRET toe in Railway.' });
  }

  try {
    console.log('[UPLOAD] Uploading to Cloudinary...');
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'vbs-de-freres',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('[UPLOAD] Cloudinary error:', error);
            reject(error);
          } else {
            console.log('[UPLOAD] Cloudinary success:', result.secure_url);
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Save to database
    console.log('[UPLOAD] Saving to database...');
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

    console.log('[UPLOAD] Complete, id:', dbResult.rows[0].id);
    res.json({ 
      success: true, 
      media: dbResult.rows[0],
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('[UPLOAD] Error:', error.message || error);
    res.status(500).json({ success: false, error: error.message || 'Failed to upload file' });
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
