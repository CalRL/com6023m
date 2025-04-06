import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generates an access token.
 * @param {object} payload - Data to include in the token.
 * @returns {string} - The signed JWT access token.
 */
export function generateAccessToken(payload: object): string {
    return jwt.sign(payload, secret, { expiresIn: accessExpiresIn });
}

/**
 * Generates a refresh token.
 * @param {object} payload - Data to include in the token.
 * @returns {string} - The signed JWT refresh token.
 */
export function generateRefreshToken(payload: object): string {
    return jwt.sign(payload, secret, { expiresIn: refreshExpiresIn });
}

/**
 * Verifies a JWT token.
 * @param {string} token - The token to verify.
 * @returns {object | null} - The decoded payload or null if invalid.
 */
export function verifyToken(token: string): object | null {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

/**
 * Decodes a JWT without verifying the signature.
 * @param {string} token - The token to decode.
 * @returns {object | null} - The decoded payload or null if invalid.
 */
export function decodeToken(token: string): object | null {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
}
