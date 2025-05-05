import database from '../config/database.js';
import { ProfileDTO } from "../models/profile.model.js";

class ProfileService {
    async createProfile(profile: ProfileDTO): Promise<void> {
        const userId = profile.id
        const displayName = profile.displayName
        try {
            await database`
                INSERT INTO profiles (id, display_name)
                VALUES (${userId}, ${displayName})
            `;
        } catch (error) {
            console.error(`Error creating profile for user ${userId}:`, error);
            throw new Error('Error creating profile');
        }
    }


    /**
     * Fetches a user's profile by their ID.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<User | null>} - The user's profile or null if not found.
     */
    async getProfileById(userId: number): Promise<ProfileDTO | null> {
        try {
            const result = await database<ProfileDTO[]>`
                SELECT * FROM profiles WHERE id = ${userId};
            `;
            return result[0] || null;
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    }
    async getAvatarById(userId: number) {}
    async getBannerById(userId: number) {}
    async getLocationById(userId: number) {}
    async getJoinDateById(userId: number) {}
}

export const profileService = new ProfileService();