import {decodeToken} from '../utils/jwt.js';
import {DecodedToken} from '../utils/authenticate.js';

class BlackListService {

    tokenBlacklist = new Map<string, number>();

    /**
     * Add token to the blacklist
     * @param tkn
     */
    add(tkn: string): void {
        const token = decodeToken(tkn) as DecodedToken;
        const expiresAt = token.exp! * 1000;
        this.tokenBlacklist.set(token.jti!, expiresAt);
    }

    /**
     * Check if token is currently blacklisted
     * @param jti
     */
    isTokenBlacklisted(jti: string): boolean {
        const expiresAt = this.tokenBlacklist.get(jti);
        if (!expiresAt) return false;

        const now = Date.now();
        if (expiresAt < now) {
            this.tokenBlacklist.delete(jti);
            return false;
        }

        return true;
    }

    /**
     * Cleanup task for expired tokens
     */
    async cleanExpired(): Promise<void> {
        const now = Date.now();
        for (const [jti, expiresAt] of this.tokenBlacklist.entries()) {
            if (expiresAt < now) {
                this.tokenBlacklist.delete(jti);
            }
        }
    }
}

const blacklistService = new BlackListService();
export default blacklistService;
