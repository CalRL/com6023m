import { Request, Response, NextFunction } from 'express';
import {authenticateToken, DecodedToken} from '../utils/authenticate.js';
import {UserDTO} from "../models/UserModel.js";
import { AuthenticatedRequest } from "../utils/interface/AuthenticatedRequest.js";

/**
 * Express middleware to authenticate a token from the request.
 */
// export function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
//     try {
//         // console.log('Token middleware triggered');  // Check if middleware is triggered
//
//         // Extract token from Authorization header or cookies
//         const authHeader: string | undefined = req.headers.authorization;
//         // console.log('Authorization Header:', authHeader);  // Log the auth header
//         const token: string | undefined = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.refreshToken;
//         // console.log('Extracted Token:', token);  // Log the extracted token
//         if (!token) {
//             console.error('No token provided');
//             return res.status(401).json({ message: 'Unauthorized: No token provided' });
//         }
//
//         // Verify and decode the token using the utility function
//         const decoded: object | boolean = authenticateToken(token);
//         // console.log('Decoded Token:', decoded);  // Log the decoded token
//         if (!decoded || decoded === false) {
//             console.error('Invalid or expired token');
//             return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
//         }
//
//         req.user = {
//             id: decoded.id,
//             email: decoded.email,
//         };
//
//         console.log('tokenMiddleware: User attached to request:', req.user.email);  // Confirm user attachment
//         next();
//     } catch (error) {
//         console.error('Token middleware error:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// }
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


