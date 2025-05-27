import database from '../config/database.js';
import { ProfileDTO } from '../models/ProfileModel.js';

class ProfileService {
    async createProfile(profile: ProfileDTO): Promise<void> {
        const userId = profile.id;
        const displayName = profile.displayName;
        try {
            await database`
                INSERT INTO profiles (id, display_name)
                VALUES (${userId}, ${displayName})
            `;
        } catch (error) {
            console.error(`Error creating profile for user ${userId}:`, error);
            throw error;
        }
    }

    /**
     * Fetches a user's profile by their ID.
     * @param {number} profileId - The ID of the user.
     * @returns {Promise<User | null>} - The user's profile or null if not found.
     */
    async getProfileById(profileId: number): Promise<ProfileDTO | null> {
        try {
            const result = await database`
                SELECT
                    p.*,
                    u.username
                FROM profiles p
                         JOIN users u ON u.id = p.id
                WHERE p.id = ${profileId};
            `;

            const row = result[0];
            if (!row) return null;

            return {
                id: row.id,
                displayName: row.display_name,
                avatarUrl: row.avatar_url ?? undefined,
                location: row.location ?? undefined,
                username: row.username ?? undefined,
                bio: row.bio ?? undefined,
                website: row.website ?? undefined,
                isPrivate: row.is_private,
                coverImageUrl: row.cover_image_url ?? undefined,
                joinedAt: row.joined_at ?? undefined
            };
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    }

    async updateFields(userId: number, fields: Record<string, any>) {
        const disallowedFields = ['joined_at', 'id', 'username', 'joinedAt']; // don't update username here

        const containsDisallowed = Object.keys(fields).some(key => disallowedFields.includes(key));
        if (containsDisallowed) {
            throw new Error(`Update contains disallowed fields: ${disallowedFields.join(', ')}`);
        }

        const safeEntries = Object.entries(fields).filter(
            ([key]) => !disallowedFields.includes(key)
        );

        if (safeEntries.length === 0) {
            throw new Error('No valid fields to update');
        }

        const toSnakeCase = (str: string) =>
            str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

        const safeFields = Object.fromEntries(
            safeEntries.map(([key, value]) => [toSnakeCase(key), value])
        );

        await database`
        UPDATE profiles
        SET ${database(safeFields)}
        WHERE id = ${userId}
      `;

        const [row] = await database`
        SELECT p.*, u.username
        FROM profiles p
        JOIN users u ON u.id = p.id
        WHERE p.id = ${userId}
      `;


        if (!row) return null;

        return {
            id: row.id,
            displayName: row.display_name,
            avatarUrl: row.avatar_url ?? undefined,
            location: row.location ?? undefined,
            username: row.username ?? undefined,
            bio: row.bio ?? undefined,
            website: row.website ?? undefined,
            isPrivate: row.is_private,
            coverImageUrl: row.cover_image_url ?? undefined,
            joinedAt: row.joined_at ?? undefined
        };
    }

}

export const profileService = new ProfileService();