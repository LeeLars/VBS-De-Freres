import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiAuth } from './middleware/auth.js';
import apiRoutes from './routes/api/index.js';
import pool from './config/database.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize database on startup
async function initDatabase() {
  if (!env.databaseUrl) {
    console.log('DATABASE_URL not set, skipping database initialization');
    return;
  }
  
  try {
    console.log('Initializing database...');
    const sqlPath = path.join(__dirname, 'database', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await pool.query(sql);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error.message);
  }
}

initDatabase();

// CORS configuratie - sta alle origins toe voor development
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(requestLogger);

// Login endpoint (no auth required)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Simple credential check - in production use hashed passwords
  if (username === 'admin' && password === 'test123') {
    res.json({ success: true, token: env.cmsApiToken });
  } else {
    res.status(401).json({ success: false, error: 'Ongeldige inloggegevens' });
  }
});

// API routes (auth middleware protects PUT/POST/DELETE, GET is public)
app.use('/api', apiAuth, apiRoutes);

// Admin static files
app.use('/cms', express.static(path.join(__dirname, 'public')));

// Root test route
app.get('/', (req, res) => {
  res.json({ message: 'Grafix CMS starter draait' });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`CMS draait op poort ${env.port}`);
});
