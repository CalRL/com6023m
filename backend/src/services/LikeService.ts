import database from '../config/database.js';

class LikeService {
    /**
     * Adds a like to a post by id
     * @param profileId
     * @param postId
     */
    async addLike(profileId: number, postId: number) {
        return database`
      INSERT INTO likes (profile_id, post_id)
      VALUES (${profileId}, ${postId})
      ON CONFLICT (profile_id, post_id) DO NOTHING
    `;
    }

    /**
     * Remove a like from a post by id
     * @param profileId
     * @param postId
     */
    async removeLike(profileId: number, postId: number) {
        return database`
      DELETE FROM likes
      WHERE profile_id = ${profileId} AND post_id = ${postId}
    `;
    }

    /**
     * Check by id if a profile has liked a post
     * @param profileId
     * @param postId
     */
    async isPostLiked(profileId: number, postId: number) {
        const result = await database`
      SELECT 1 FROM likes
      WHERE profile_id = ${profileId} AND post_id = ${postId}
      LIMIT 1
    `;
        return result.length > 0;
    }

    /**
     * Get like count by post id
     * @param postId
     */
    async getLikeCount(postId: number) {
        const result = await database`
      SELECT COUNT(*) FROM likes
      WHERE post_id = ${postId}
    `;
        return Number(result[0].count);
    }

    /**
     * Deletes all likes from this user
     * Updates all posts like count
     * @param userId - the user's id
     */
    async deleteAllByUserId(userId: number): Promise<void> {

        const likes = await database`
        SELECT post_id FROM likes WHERE user_id = ${userId}
      `;

        await database`
        DELETE FROM likes WHERE user_id = ${userId}
      `;

        for (const { post_id } of likes) {
            await database`
          UPDATE posts SET like_count = (
            SELECT COUNT(*) FROM likes WHERE post_id = ${post_id}
          )
          WHERE id = ${post_id}
        `;
        }
    }
}

const likeService = new LikeService();
export default likeService;
