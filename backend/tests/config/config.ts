import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

export async function loadConfig() {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const envPath = resolve(__dirname, '../../.env');
    console.log('Resolved .env path:', envPath);

    const config = dotenv.config({ path: envPath });

    if (config.error) {
        console.error('Error loading .env file:', config.error);
    } else {
        console.log('Environment variables loaded');
    }

}
