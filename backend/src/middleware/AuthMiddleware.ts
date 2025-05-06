import { Request, Response, NextFunction } from 'express';
import {authenticateToken, DecodedToken} from '../utils/authenticate.js';
import {User, UserDTO} from "../models/UserModel.js";
import { AuthenticatedRequest } from "../utils/interface/AuthenticatedRequest.js";
import {debugMode} from "../utils/DebugMode.js";
import {ErrorMessages} from "../utils/errors.js";
import permissionsService from "../services/PermissionsService.js";
import {Permissions} from "../User/Permissions.js";
import {userService} from "../services/UserService.js";

export type WithUser = Request & AuthenticatedRequest;

export function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.cookies?.refreshToken;

        if (!token) {
            console.error('Auth: No token provided');
            res.status(401).json({ message: 'Unauthorized: No token provided' });
            return;
        }

        const decoded = authenticateToken(token);

        if (!isDecodedToken(decoded)) {
            console.error('Auth: Invalid or expired token structure');
            res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
            return;
        }

        // decoded is now known to be DecodedToken
        (req as WithUser).user = {
            id: parseInt(decoded.id),
            email: decoded.email,
        };

        console.log('Auth: User attached to request:', decoded.email);
        next();
    } catch (error) {
        console.error('Auth: Token middleware error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
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

export function isDecodedToken(decoded: any): decoded is DecodedToken {
    return (
        typeof decoded === 'object' &&
        decoded !== null &&
        typeof decoded.id === 'number' &&
        typeof decoded.email === 'string'
    );
}

class AuthMiddleware {

    async adminMiddleware(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.cookies?.refreshToken;

        if (!token) {
            console.error('Auth: No token provided');
            res.status(401).json({ message: 'Unauthorized: No token provided' });
            return;
        }

        const decoded = authenticateToken(token);

        if (!isDecodedToken(decoded)) {
            console.error('Auth: Invalid or expired token structure');
            res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
            return;
        }

        // decoded is now known to be DecodedToken
        (req as WithUser).user = {
            id: parseInt(decoded.id),
            email: decoded.email,
        };

        const hasPermission = await permissionsService.hasPermission(parseInt(decoded.id), "ADMIN");
        if(!hasPermission) {
            console.error(`Auth: User ${decoded.id} does not have ADMIN permission`);
            res.status(403).json({ message: 'Permission denied' });
            return;
        }

        console.log('Auth: Admin attached to request:', decoded.email);
        next();
    }

    async tokenMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.startsWith('Bearer ')
                ? authHeader.split(' ')[1]
                : req.cookies?.refreshToken;

            if (!token) {
                console.error('Auth: No token provided');
                res.status(401).json({ message: 'Unauthorized: No token provided' });
                return;
            }

            const decoded = authenticateToken(token);

            if (!isDecodedToken(decoded)) {
                console.error('Auth: Invalid or expired token structure');
                res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
                return;
            }

            // decoded is now known to be DecodedToken
            (req as WithUser).user = {
                id: parseInt(decoded.id),
                email: decoded.email,
            };

            console.log('Auth: User attached to request:', decoded.email);
            next();
        } catch (error) {
            console.error('Auth: Token middleware error:', error);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    }
}

const authMiddleware: AuthMiddleware = new AuthMiddleware();

export default authMiddleware;

