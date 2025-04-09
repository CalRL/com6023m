import { verifyToken } from './jwt';

/**
 * Checks if the provided JWT token is valid.
 * @param {string | undefined} token - The JWT token to verify.
 * @returns {boolean} - Returns true if the token is valid, false otherwise.
 */
export function authenticateToken(token?: string): boolean {
    if (!token) return false;

    try {
        const decoded = verifyToken(token);
        return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
}