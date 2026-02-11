import { env } from '../config/env.js';

// Auth middleware for write operations (PUT, POST, DELETE)
// GET requests are public (frontend needs to read content)
// Write requests require Authorization header with Bearer token
export function apiAuth(req, res, next) {
  // Allow GET requests without auth (public content reading)
  if (req.method === 'GET') {
    return next();
  }
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Geen autorisatie token meegegeven' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (token !== env.cmsApiToken) {
    return res.status(403).json({ error: 'Ongeldig token' });
  }
  
  next();
}
