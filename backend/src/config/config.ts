import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from the root directory
dotenv.config({ path: resolve(process.cwd(), '.env') });

console.log('Environment variables loaded');