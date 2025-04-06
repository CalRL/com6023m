import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/**
 *
 * @param password
 * @returns
 */
export async function hashPassword(password: string): Promise<string> {
    try {
        const salt = randomBytes(16).toString("base64");
        const hash = scryptSync(password, salt, 64).toString("base64");
        return `${salt}:${hash}`; // Store salt and hash together
    } catch (error: unknown) {
        throw new Error(`Error hashing password: ${(error as Error).message}`);
    }
}

/**
 * Verifies if the plain text password matches the stored hash.
 *
 * Uses {@link timingSafeEqual} to prevent timing attacks;
 *
 * @param password
 * @param storedHash
 * @returns
 */
export async function verifyPassword(
    password: string,
    storedHash: string
): Promise<boolean> {
    try {
        const [salt, hash] = storedHash.split(":");
        const hashedBuffer = scryptSync(password, salt, 64);
        const storedBuffer = Buffer.from(hash, "base64");

        return timingSafeEqual(hashedBuffer, storedBuffer);
    } catch (error: unknown) {
        throw new Error(`Error verifying password: ${(error as Error).message}`);
    }
}
