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
     * @param {number} profileId - The ID of the user.
     * @returns {Promise<User | null>} - The user's profile or null if not found.
     */
    async getProfileById(profileId: number): Promise<ProfileDTO | null> {
        try {
            const result = await database<ProfileDTO[]>`
                SELECT * FROM profiles WHERE id = ${profileId};
            `;
            return result[0] || null;
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    }

    async getDisplayNameById(profileId: number): Promise<ProfileDTO> {
        try {
            const result = await database<ProfileDTO[]>`
                SELECT display_name FROM profiles WHERE id = ${profileId};
            `;
            return result[0] || null;
        } catch(error) {
            throw error;
        }
    }

    async getJoinDateById(profileId: number): Promise<ProfileDTO> {
        try {
            const result = await database<ProfileDTO[]>`
                SELECT joined_at FROM profiles WHERE id = ${profileId};
            `;
            return result[0] || null;
        } catch(error) {
            throw error;
        }
    }

    async getBioById(profileId: number): Promise<ProfileDTO> {
        try {
            const result = await database<ProfileDTO[]>`
                SELECT bio FROM profiles WHERE id = ${profileId};
            `;
            return result[0] || null;
        } catch(error) {
            throw error;
        }
    }

    async getWebsiteById(profileId: number): Promise<ProfileDTO> {
        try {
            const result = await database<ProfileDTO[]>`
                SELECT website FROM profiles WHERE id = ${profileId};
            `;
            return result[0] || null;
        } catch(error) {
            throw error;
        }
    }

    async getAvatarById(profileId: number) {
        try {
            const result = await database<ProfileDTO[]>`
                SELECT avatar_url FROM profiles WHERE id = ${profileId};
            `;
            return result[0] || null;
        } catch(error) {
            throw error;
        }
    }

    async getPrivacyById(profileId: number) {
        try {
            const result = await database<ProfileDTO[]>`
                SELECT is_private FROM profiles WHERE id = ${profileId};
            `;
            return result[0] || null;
        } catch(error) {
            throw error;
        }
    }

    async getBannerById(profileId: number) {
        try {
            const result = await database<ProfileDTO[]>`
                SELECT cover_image_url FROM profiles WHERE id = ${profileId};
            `;
            return result[0] || null;
        } catch(error) {
            throw error;
        }
    }
    async getLocationById(profileId: number) {
        try {
            const result = await database<ProfileDTO[]>`
                SELECT location FROM profiles WHERE id = ${profileId};
            `;
            return result[0] || null;
        } catch(error) {
            throw error;
        }
    }
}

export const profileService = new ProfileService();