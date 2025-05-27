import { describe, it, expect, vi, afterEach } from 'vitest';
import { Request, Response } from 'express';
import * as jwtUtils from '../../src/utils/jwt.js';
import blacklistService from '../../src/services/BlacklistService.js';

vi.mock('jsonwebtoken', async (importOriginal) => {
    const actual = await importOriginal();
    const mockSign = vi.fn(() => 'mocked-token');
    const mockVerify = vi.fn(() => ({ id: 1, jti: 'uuid' }));
    const mockDecode = vi.fn(() => ({ id: 1 }));


    return {
        __esModule: true,
        sign: mockSign,
        verify: mockVerify,
        decode: mockDecode,
        default: {
            sign: mockSign,
            verify: mockVerify,
            decode: mockDecode
        }
    };
});

vi.mock('../../src/services/BlacklistService', () => ({
    default: {
        isTokenBlacklisted: vi.fn().mockReturnValue(false)
    }
}));

import * as jwt from 'jsonwebtoken';

describe('JWT Utils', () => {
    afterEach(() => vi.restoreAllMocks());

    it('generateAccessToken should call jwt.sign with correct params', () => {
        const payload = { id: 1 };
        const token = jwtUtils.generateAccessToken(payload);
        expect(token).toBe('mocked-token');
        expect(jwt.sign).toHaveBeenCalled();
    });

    it('generateRefreshToken should call jwt.sign with correct params', () => {
        const payload = { id: 1 };
        const token = jwtUtils.generateRefreshToken(payload);
        expect(token).toBe('mocked-token');
        expect(jwt.sign).toHaveBeenCalled();
    });

    it('verifyToken should return decoded token if valid and not blacklisted', () => {
        (blacklistService.isTokenBlacklisted as any).mockReturnValue(false);
        const result = jwtUtils.verifyToken('token');
        expect(result).toEqual({ id: 1, jti: 'uuid' });
    });

    it('verifyToken should return null if token is blacklisted', () => {
        (blacklistService.isTokenBlacklisted as any).mockReturnValue(true);
        const result = jwtUtils.verifyToken('token');
        expect(result).toBeNull();
    });

    it('verifyToken should return null if jwt.verify throws', () => {
        (jwt.verify as any).mockImplementation(() => { throw new Error('invalid'); });
        const result = jwtUtils.verifyToken('invalid');
        expect(result).toBeNull();
    });

    it('decodeToken should return decoded payload', () => {
        (jwt.decode as any).mockReturnValue({ id: 1 });
        const result = jwtUtils.decodeToken('abc');
        expect(result).toEqual({ id: 1 });
    });

    it('decodeToken should return null if jwt.decode throws', () => {
        (jwt.decode as any).mockImplementation(() => { throw new Error(); });
        const result = jwtUtils.decodeToken('bad');
        expect(result).toBeNull();
    });
});