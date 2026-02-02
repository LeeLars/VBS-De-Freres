import express from 'express';
import { sendContactEmail } from '../../config/email.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Contact form submission received');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ 
        error: 'Naam, email en bericht zijn verplicht' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      return res.status(400).json({ 
        error: 'Ongeldig email adres' 
      });
    }

    console.log('Validation passed, attempting to send email...');
    const result = await sendContactEmail({ name, email, phone, message });
    console.log('Email sent successfully:', result.messageId);

    res.json({ 
      success: true, 
      message: 'Bericht succesvol verzonden' 
    });
  } catch (error) {
    console.error('Contact form error:', error.message);
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het verzenden van het bericht',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
