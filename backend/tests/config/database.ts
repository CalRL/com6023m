import dotenv from 'dotenv';
import { resolve } from 'path';
import postgres from 'postgres';


// Load environment variables
const envPath: typeof import('path') = resolve(__dirname, '../../../.env')
console.log("Path: " + envPath);

dotenv.config({ path: envPath });

const requiredEnv = [
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'TEST_POSTGRES_DB'
];

for (const envVar of requiredEnv) {
    if (!process.env[envVar]) {
        throw new Error(`Environment variable ${envVar} is not set`);
    }
}

const dbUrl = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.TEST_POSTGRES_DB}`;

const database = postgres(dbUrl, {
    ssl: process.env.POSTGRES_SSL === 'true',
    keep_alive: 1000,
});

export default database;
