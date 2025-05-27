import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../../src/utils/PasswordUtils.js';

describe('Password Utils', () => {
    it('verifyPassword should return true for correct password', async () => {
        const password = 'securePassword123';
        const hashed = await hashPassword(password);
        const result = await verifyPassword(password, hashed);
        expect(result).toBe(true);
    });

    it('verifyPassword should return false for incorrect password', async () => {
        const password = 'securePassword123';
        const hashed = await hashPassword(password);
        const result = await verifyPassword('wrongPassword', hashed);
        expect(result).toBe(false);
    });

    it('verifyPassword should throw if hash format is invalid', async () => {
        await expect(verifyPassword('password', 'invalid-format')).rejects.toThrow(
            /Error verifying password/
        );
    });
});
