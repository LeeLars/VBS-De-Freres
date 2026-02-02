import { Resend } from 'resend';
import { env } from './env.js';

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

if (resend) {
  console.log('✅ Resend email service initialized');
} else {
  console.warn('⚠️ RESEND_API_KEY not set - email sending disabled');
}

const escapeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const sendContactEmail = async ({ name, email, phone, message }) => {
  if (!resend) {
    throw new Error('Email service not configured - RESEND_API_KEY missing');
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #3b82f6; color: white; padding: 20px; border-radius: 5px 5px 0 0;">
          <h2 style="margin: 0;">📧 Nieuw Contactbericht</h2>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">Naam:</div>
            <div style="color: #111827;">${escapeHtml(name)}</div>
          </div>
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">Email:</div>
            <div style="color: #111827;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
          </div>
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">Telefoon:</div>
            <div style="color: #111827;">${phone ? escapeHtml(phone) : '<em>Niet opgegeven</em>'}</div>
          </div>
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">Bericht:</div>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #3b82f6; margin-top: 10px;">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p>Dit bericht is verzonden via het contactformulier op de VBS De Frères website</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'VBS De Frères <onboarding@resend.dev>',
      to: [env.contactEmail],
      replyTo: email,
      subject: `Nieuw contactbericht van ${name}`,
      html: htmlContent
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Email sent successfully:', data.id);
    return { messageId: data.id };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};
