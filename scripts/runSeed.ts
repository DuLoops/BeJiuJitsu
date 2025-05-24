import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Ensure .env is in the project root, adjust path if needed

import { seedPredefinedData } from '../src/lib/seedPredefinedData';

async function main() {
  try {
    console.log('Starting seeding process...');
    await seedPredefinedData();
    console.log('Seeding process completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed:', error);
    process.exit(1);
  }
}

main(); 