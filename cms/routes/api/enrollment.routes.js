import express from 'express';
import { Resend } from 'resend';
import { env } from '../../config/env.js';

const router = express.Router();
const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

router.post('/', async (req, res) => {
  console.log('Enrollment form submission received');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { 
      parentFirstName, 
      parentLastName, 
      email, 
      phone, 
      childFirstName, 
      childLastName, 
      childBirthdate, 
      startYear, 
      message 
    } = req.body;

    // Validation - Simplified for lead capture
    if (!parentFirstName || !email || !phone) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ 
        error: 'Naam, e-mail en telefoon zijn verplicht' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      return res.status(400).json({ 
        error: 'Ongeldig e-mailadres' 
      });
    }

    console.log('Validation passed, sending enrollment notification...');

    // Send email notification
    if (resend) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #a8cf8c; color: #000; padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0;">Nieuwe Aanmelding / Contact</h2>
            </div>
            <div style="background-color: #fffffb; padding: 30px; border: 1px solid #e0e0e0;">
              <h3 style="color: #a8cf8c; margin-top: 0;">Gegevens Ouder/Voogd</h3>
              <p><strong>Naam:</strong> ${parentFirstName} ${parentLastName || ''}</p>
              <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Telefoon:</strong> ${phone}</p>
              
              ${childFirstName ? `
              <h3 style="color: #a8cf8c;">Gegevens Kind (indien ingevuld)</h3>
              <p><strong>Naam:</strong> ${childFirstName} ${childLastName || ''}</p>
              <p><strong>Geboortedatum:</strong> ${childBirthdate || 'Niet opgegeven'}</p>
              <p><strong>Gewenst startjaar:</strong> ${startYear || 'Niet opgegeven'}</p>
              ` : ''}
              
              ${message ? `
              <h3 style="color: #a8cf8c;">Bericht / Bijkomende informatie</h3>
              <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</p>
              ` : ''}
            </div>
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>Dit bericht is verzonden via het formulier op de VBS De Freres website</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const { data, error } = await resend.emails.send({
        from: 'VBS De Freres <noreply@grafixstudio.io>',
        to: [env.contactEmail],
        replyTo: email,
        subject: `Nieuwe aanmelding/contact: ${parentFirstName} ${parentLastName || ''}`,
        html: htmlContent
      });

      if (error) {
        console.error('Resend error:', error);
        throw new Error(error.message);
      }

      console.log('Enrollment notification sent:', data.id);
    } else {
      console.log('Email service not configured, skipping notification');
    }

    res.json({ 
      success: true, 
      message: 'Aanmelding succesvol ontvangen' 
    });
  } catch (error) {
    console.error('Enrollment form error:', error.message);
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het verzenden van de aanmelding',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
