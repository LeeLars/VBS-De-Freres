import nodemailer from 'nodemailer';
import { env } from './env.js';

export const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpSecure,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPassword
  }
});

export const sendContactEmail = async ({ name, email, phone, message }) => {
  const mailOptions = {
    from: env.smtpUser,
    to: env.contactEmail,
    replyTo: email,
    subject: `Nieuw contactbericht van ${name}`,
    html: `
      <h2>Nieuw contactbericht</h2>
      <p><strong>Naam:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefoon:</strong> ${phone || 'Niet opgegeven'}</p>
      <p><strong>Bericht:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    text: `
Nieuw contactbericht

Naam: ${name}
Email: ${email}
Telefoon: ${phone || 'Niet opgegeven'}

Bericht:
${message}
    `
  };

  return await transporter.sendMail(mailOptions);
};
