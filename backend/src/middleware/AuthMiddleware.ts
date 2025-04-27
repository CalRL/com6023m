import { Request, Response, NextFunction } from 'express';
import {authenticateToken, DecodedToken} from '../utils/authenticate.js';
import {User, UserDTO} from "../models/UserModel.js";
import { AuthenticatedRequest } from "../utils/interface/AuthenticatedRequest.js";
import {debugMode} from "../utils/DebugMode.js";
import {ErrorMessages} from "../utils/errors.js";

type WithUser = Request & AuthenticatedRequest;
export function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.cookies?.refreshToken;

        if (!token) {
            console.error('No token provided');
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = authenticateToken(token);

        if (!isDecodedToken(decoded)) {
            console.error('Invalid or expired token structure');
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
        }

        // decoded is now known to be DecodedToken
        (req as WithUser).user = {
            id: parseInt(decoded.id),
            email: decoded.email,
        };

        console.log('tokenMiddleware: User attached to request:', decoded.email);
        next();
    } catch (error) {
        console.error('Token middleware error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Gets the user from the associated token
 * @param req
 */
export async function fromToken(req: Request): Promise<UserDTO | null> {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.refreshToken;
    if(!token) {
        console.error('No token provided');
        return null;
    }

    const decoded = authenticateToken(token);

    if (!isDecodedToken(decoded)) {
        console.error('Invalid or expired token structure');
        return null;
    }

    const user: UserDTO = (req as WithUser).user = {
        id: parseInt(decoded.id)
    }

    console.log('From token: ', JSON.stringify(user));

    return user;
}

function isDecodedToken(decoded: any): decoded is DecodedToken {
    return (
        typeof decoded === 'object' &&
        decoded !== null &&
        typeof decoded.id === 'number' &&
        typeof decoded.email === 'string'
    );
}

class AuthMiddleware {

    async fromRequest(req: Request, res: Response): Promise<UserDTO> {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.refreshToken;

        if(!token) {
            console.error('No token provided');
            throw new Error(`Forbidden: ${ErrorMessages.NO_TOKEN}`)
        }

        const decoded = authenticateToken(token);

        if (!isDecodedToken(decoded)) {
            console.error('Invalid or expired token structure');
            throw new Error(`Forbidden: ${ErrorMessages.INVALID_TOKEN}`);
        }

        const user: UserDTO = (req as WithUser).user = {
            id: parseInt(decoded.id)
        }

        console.log('From token: ', JSON.stringify(user));

        return user;
    }
}

const authMiddleware: AuthMiddleware = new AuthMiddleware();

export default authMiddleware;

