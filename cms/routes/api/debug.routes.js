import express from 'express';
import { env } from '../../config/env.js';

const router = express.Router();

router.get('/config', (req, res) => {
  console.log('🔍 Debug config endpoint called');
  
  const config = {
    smtp: {
      host: env.smtpHost || '❌ NOT SET',
      port: env.smtpPort || '❌ NOT SET',
      secure: env.smtpSecure,
      user: env.smtpUser ? '✅ SET' : '❌ NOT SET',
      password: env.smtpPassword ? '✅ SET' : '❌ NOT SET',
      contactEmail: env.contactEmail || '❌ NOT SET'
    },
    database: {
      url: env.databaseUrl ? '✅ SET' : '❌ NOT SET'
    },
    cloudinary: {
      cloudName: env.cloudinary.cloudName ? '✅ SET' : '❌ NOT SET',
      apiKey: env.cloudinary.apiKey ? '✅ SET' : '❌ NOT SET',
      apiSecret: env.cloudinary.apiSecret ? '✅ SET' : '❌ NOT SET'
    }
  };
  
  console.log('Config check:', JSON.stringify(config, null, 2));
  
  res.json({
    message: 'Configuration check',
    config,
    note: 'Sensitive values are hidden for security'
  });
});

export default router;
