import jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

const { sign, verify, decode } = jwt;
import {DecodedToken} from './authenticate.js';
import crypto from 'crypto';
import blacklistService from '../services/BlacklistService.js';
import {debugMode} from './DebugMode.js';

const secret = process.env.JWT_SECRET!;
const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generates an access token.
 * @param {object} payload - Data to include in the token.
 * @returns {string} - The signed JWT access token.
 */
export function generateAccessToken(payload: object): string {
    const options: SignOptions = { expiresIn: accessExpiresIn as unknown as SignOptions['expiresIn']  };
    return sign(
        { ...payload, jti: crypto.randomUUID() },
        secret as string,
        options
    );
}

/**
 * Generates a refresh token.
 * @param {object} payload - Data to include in the token.
 * @returns {string} - The signed JWT refresh token.
 */
export function generateRefreshToken(payload: object): string {
    const options: SignOptions = { expiresIn: refreshExpiresIn as unknown as SignOptions['expiresIn'] };
    return sign(
        { ...payload, jti: crypto.randomUUID() },
        secret as string,
        options
    );
}

/**
 * Verifies a JWT token.
 * @param {string} token - The token to verify.
 * @returns {object | null} - The decoded payload or null if invalid.
 */
export function verifyToken(token: string): object | null {
    try {
        const decoded = verify(token, secret) as DecodedToken;

        const isBlacklisted = blacklistService.isTokenBlacklisted(decoded.jti!);
        if (isBlacklisted) {
            debugMode.log('Token is blacklisted');
            return null;
        }

        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Decodes a JWT without verifying the signature.
 * @param {string} token - The token to decode.
 * @returns {object | null} - The decoded payload or null if invalid.
 */
export function decodeToken(token: string){
    try {
        return decode(token);
    } catch (error) {
        return null;
    }
}
