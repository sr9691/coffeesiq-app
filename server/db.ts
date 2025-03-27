import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '@shared/schema';
import dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config();

// Log to verify the script is running
console.log('Starting the database connection script...');


const { Pool } = pg;

// Log the DATABASE_URL to verify it's set correctly
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);


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


// Handle connection errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});


// Create Drizzle instance with our schema
export const db = drizzle(pool, { schema });

// Test the connection by running a simple query
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error executing test query', err.stack);
    } else {
        console.log('Test query result:', res.rows);
    }
});