import nodemailer from 'nodemailer';
import { env } from './env.js';

export const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpSecure,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPassword
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 5
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

const escapeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const sendContactEmail = async ({ name, email, phone, message }) => {
  const mailOptions = {
    from: {
      name: 'VBS De Frères Website',
      address: env.smtpUser
    },
    to: env.contactEmail,
    replyTo: {
      name: name,
      address: email
    },
    subject: `Nieuw contactbericht van ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #3b82f6; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #374151; margin-bottom: 5px; }
          .value { color: #111827; }
          .message-box { background-color: white; padding: 15px; border-left: 4px solid #3b82f6; margin-top: 10px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">📧 Nieuw Contactbericht</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Naam:</div>
              <div class="value">${escapeHtml(name)}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
            </div>
            <div class="field">
              <div class="label">Telefoon:</div>
              <div class="value">${phone ? escapeHtml(phone) : '<em>Niet opgegeven</em>'}</div>
            </div>
            <div class="field">
              <div class="label">Bericht:</div>
              <div class="message-box">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Dit bericht is verzonden via het contactformulier op de VBS De Frères website</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
NIEUW CONTACTBERICHT
====================

Naam: ${name}
Email: ${email}
Telefoon: ${phone || 'Niet opgegeven'}

Bericht:
${message}

---
Dit bericht is verzonden via het contactformulier op de VBS De Frères website
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
