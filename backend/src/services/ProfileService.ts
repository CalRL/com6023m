import database from '../config/database';

class ProfileService {
    async createProfile(userId: number, username: string): Promise<void> {
        try {
            await database`
                INSERT INTO profiles (id, display_name)
                VALUES (${userId}, ${username})
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
    async getProfileById(userId: number): Promise<Profile> {
        try {
            const result = await database`
                SELECT * FROM profiles WHERE id = ${userId};
            `;
            return result[0] || null;
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    }
}

export const profileService = new ProfileService();