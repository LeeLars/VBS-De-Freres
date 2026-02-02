import pkg from 'pg';
import { env } from './env.js';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl?.includes('localhost') ? false : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('Unexpected PG pool error', err);
});

export { pool };
export default pool;
