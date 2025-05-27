import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import postgres, {Sql} from 'postgres';



const requiredEnv = [
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_DB'
];


for (const envVar of requiredEnv) {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is not set`);
  }
}

const isTest = process.env.NODE_ENV === 'test';

const port = process.env.POSTGRES_PORT;

const dbUrl = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${port}/${process.env.POSTGRES_DB}`;
const database: Sql = postgres(dbUrl, {
  // database only accessible inside the docker network
  ssl: false,
  keep_alive: 1000,
});

export default database;