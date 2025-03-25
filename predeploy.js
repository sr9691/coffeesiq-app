// pre-deploy.js - Run database migrations before deployment
import { exec } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

console.log('Starting database migration...');

// Run Drizzle migration
exec('npm run db:push', (error, stdout, stderr) => {
  if (error) {
    console.error(`Migration error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Migration stderr: ${stderr}`);
  }
  console.log(`Migration successful: ${stdout}`);
  process.exit(0);
});