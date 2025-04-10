console.log("🔍 app.ts starting up");

import './config/config';

import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/UserRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import profileRoutes from './routes/ProfileRoutes.js';
// @ts-ignore
import cookieParser from 'cookie-parser';
// @ts-ignore
import cors from 'cors';
import {debugMode} from "./utils/DebugMode.js";

// THis will run only if DEBUG_MODE is set to true in ENV
debugMode.log("Running in debug mode!");

dotenv.config({ path: "../.env" });

const app: Application = express();
const PORT = process.env.EXPRESS_PORT;

if(PORT == "" || PORT == null) {
    throw new Error("Cannot start server, port is null");
}


/**
 * CORS Configuration
 */
app.use(cors({
    origin: [
        'http://localhost:4000',
        'http://cal.ceo:4000',
        'https://callumburnsoregan.com'
    ],
    credentials: true,  // Allow cookies and headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * Middleware
 */

app.use(function(req, res, next) {
    console.log(`[${new Date().toISOString()}] Request received: ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Express with postgres');
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.listen(parseInt(PORT), '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
