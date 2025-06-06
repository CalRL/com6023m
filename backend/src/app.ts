import dotenv from 'dotenv';

import './config/config.js';
dotenv.config({ path: '../.env' });

import express, { Application, Request, Response } from 'express';

import userRoutes from './routes/UserRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import profileRoutes from './routes/ProfileRoutes.js';
import postRoutes from './routes/PostRoutes.js';

// @ts-expect-error - no @types package
import cookieParser from 'cookie-parser';
// @ts-expect-error - no @types package
import cors from 'cors';
import {debugMode} from './utils/DebugMode.js';
import bookmarkRoutes from './routes/BookmarkRoutes.js';
import likeRoutes from './routes/LikeRoutes.js';
import adminRoutes from './routes/AdminRoutes.js';

// THis will run only if DEBUG_MODE is set to true in ENV
debugMode.log('Running in debug mode!');

console.log('🔍 app.ts starting up');


const app: Application = express();
const PORT = process.env.EXPRESS_PORT;

if(PORT == '' || PORT == null) {
    throw new Error('Cannot start server, port is null');
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
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
app.use('/api/posts', postRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/admin', adminRoutes);

app.listen(parseInt(PORT), '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
