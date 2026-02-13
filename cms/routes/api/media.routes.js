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
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
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

// Upload PDF to GitHub repo
async function uploadPdfToGitHub(fileBuffer, filename) {
  const { token, repo, branch, pdfPath } = env.github;
  if (!token) throw new Error('GITHUB_TOKEN niet geconfigureerd in Railway.');
  
  // Sanitize filename: lowercase, replace spaces with hyphens, keep only safe chars
  const safeName = filename.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9._-]/g, '');
  const filePath = `${pdfPath}/${safeName}`;
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  
  // Check if file already exists (we need the sha to overwrite)
  let existingSha = null;
  try {
    const checkRes = await fetch(apiUrl, {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (checkRes.ok) {
      const existing = await checkRes.json();
      existingSha = existing.sha;
    }
  } catch (e) { /* file doesn't exist, that's fine */ }
  
  // Upload via GitHub API
  const body = {
    message: `Upload PDF: ${safeName}`,
    content: fileBuffer.toString('base64'),
    branch: branch
  };
  if (existingSha) body.sha = existingSha;
  
  const uploadRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!uploadRes.ok) {
    const err = await uploadRes.json();
    throw new Error(`GitHub API error: ${err.message || uploadRes.statusText}`);
  }
  
  const result = await uploadRes.json();
  // Return the GitHub Pages URL
  const pagesUrl = `https://leelars.github.io/VBS-De-Freres/${filePath}`;
  return { url: pagesUrl, path: filePath, sha: result.content.sha, safeName };
}

// Upload new media
router.post('/upload', upload.single('file'), async (req, res) => {
  console.log('[UPLOAD] Request received');
  
  if (!req.file) {
    console.log('[UPLOAD] No file in request');
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  console.log(`[UPLOAD] File: ${req.file.originalname}, size: ${req.file.size}, type: ${req.file.mimetype}`);

  const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf');

  try {
    let finalUrl, publicId, width, height, format, sizeBytes;

    if (isPdf) {
      // Upload PDF to GitHub
      console.log('[UPLOAD] Uploading PDF to GitHub...');
      if (!env.github.token) {
        return res.status(500).json({ success: false, error: 'GITHUB_TOKEN niet geconfigureerd. Voeg GITHUB_TOKEN toe in Railway.' });
      }
      const ghResult = await uploadPdfToGitHub(req.file.buffer, req.file.originalname);
      finalUrl = ghResult.url;
      publicId = `github:${ghResult.path}`;
      width = 0;
      height = 0;
      format = 'pdf';
      sizeBytes = req.file.size;
      console.log('[UPLOAD] GitHub upload success:', finalUrl);
    } else {
      // Upload image to Cloudinary
      if (!env.cloudinary.cloudName) {
        return res.status(500).json({ success: false, error: 'Cloudinary niet geconfigureerd. Voeg CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY en CLOUDINARY_API_SECRET toe in Railway.' });
      }
      console.log('[UPLOAD] Uploading image to Cloudinary...');
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'vbs-de-freres', resource_type: 'auto' },
          (error, result) => {
            if (error) { console.error('[UPLOAD] Cloudinary error:', error); reject(error); }
            else { console.log('[UPLOAD] Cloudinary success:', result.secure_url); resolve(result); }
          }
        );
        uploadStream.end(req.file.buffer);
      });
      finalUrl = result.secure_url;
      publicId = result.public_id;
      width = result.width;
      height = result.height;
      format = result.format;
      sizeBytes = result.bytes;
    }

    // Save to database
    console.log('[UPLOAD] Saving to database...');
    const dbResult = await pool.query(
      `INSERT INTO media (filename, url, public_id, width, height, format, size_bytes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.file.originalname, finalUrl, publicId, width, height, format, sizeBytes]
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

    // Delete from storage
    if (media.public_id && media.public_id.startsWith('github:')) {
      // Delete from GitHub
      const ghPath = media.public_id.replace('github:', '');
      const apiUrl = `https://api.github.com/repos/${env.github.repo}/contents/${ghPath}`;
      if (env.github.token) {
        try {
          const getRes = await fetch(apiUrl, {
            headers: { 'Authorization': `token ${env.github.token}`, 'Accept': 'application/vnd.github.v3+json' }
          });
          if (getRes.ok) {
            const fileData = await getRes.json();
            await fetch(apiUrl, {
              method: 'DELETE',
              headers: {
                'Authorization': `token ${env.github.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: `Delete PDF: ${ghPath.split('/').pop()}`,
                sha: fileData.sha,
                branch: env.github.branch
              })
            });
          }
        } catch (e) { console.error('GitHub delete error:', e.message); }
      }
    } else if (media.public_id && env.cloudinary.cloudName) {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(media.public_id, { resource_type: 'image' });
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
