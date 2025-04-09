import {verifyToken} from './jwt.js';

/**
 * Checks if the provided JWT token is valid.
 * @param {string | undefined} token - The JWT token to verify.
 * @returns {boolean} - Returns true if the token is valid, false otherwise.
 */
export function authenticateToken(token?: string): boolean | object {
    if (!token) return false;

    try {
        const decoded = verifyToken(token);
        if(decoded == null || !decoded) return false;

        return decoded as DecodedToken;
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
}

export interface DecodedToken {
    id: string;
    email: string;
}