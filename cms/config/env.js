import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  cmsApiToken: process.env.CMS_API_TOKEN || 'dev-token-change-me',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET
  },
  github: {
    token: process.env.GITHUB_TOKEN,
    repo: process.env.GITHUB_REPO || 'LeeLars/VBS-De-Freres',
    branch: process.env.GITHUB_BRANCH || 'main',
    pdfPath: process.env.GITHUB_PDF_PATH || 'web/assets/pdfs'
  },
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT || '587'),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  contactEmail: process.env.CONTACT_EMAIL,
  resendApiKey: process.env.RESEND_API_KEY
};
