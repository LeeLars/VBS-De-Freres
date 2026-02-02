import express from 'express';
import { sendContactEmail } from '../../config/email.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Naam, email en bericht zijn verplicht' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Ongeldig email adres' 
      });
    }

    await sendContactEmail({ name, email, phone, message });

    res.json({ 
      success: true, 
      message: 'Bericht succesvol verzonden' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het verzenden van het bericht' 
    });
  }
});

export default router;
