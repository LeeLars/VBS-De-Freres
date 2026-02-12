import express from 'express';
import pool from '../../config/database.js';

const router = express.Router();

// Get all content for a page
router.get('/:pageSlug', async (req, res) => {
  const { pageSlug } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT content_key, content_value, content_type FROM page_content WHERE page_slug = $1',
      [pageSlug]
    );
    
    // Convert to object format
    const content = {};
    result.rows.forEach(row => {
      content[row.content_key] = {
        value: row.content_value,
        type: row.content_type
      };
    });
    
    res.json({ success: true, content });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Update content for a page
router.put('/:pageSlug', async (req, res) => {
  const { pageSlug } = req.params;
  const { content } = req.body;
  
  if (!content || typeof content !== 'object') {
    return res.status(400).json({ error: 'Content object is required' });
  }
  
  try {
    // Update each content item
    for (const [key, value] of Object.entries(content)) {
      await pool.query(
        `INSERT INTO page_content (page_slug, content_key, content_value, content_type, updated_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         ON CONFLICT (page_slug, content_key) 
         DO UPDATE SET content_value = $3, updated_at = CURRENT_TIMESTAMP`,
        [pageSlug, key, value && typeof value === 'object' && value.value !== undefined ? value.value : (value || ''), value && typeof value === 'object' && value.type ? value.type : 'text']
      );
    }
    
    res.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Get all pages with content
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT page_slug FROM page_content ORDER BY page_slug'
    );
    
    res.json({ success: true, pages: result.rows.map(r => r.page_slug) });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

export default router;
