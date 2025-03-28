import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '@shared/schema';

const { Pool } = pg;

// Connect to the PostgreSQL database
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

// Log a message when the pool connects to the database
pool.on('connect', () => {
    console.log(`Connected to the database at ${process.env.DATABASE_URL}`);
});

// Create Drizzle instance with our schema
export const db = drizzle(pool, { schema });