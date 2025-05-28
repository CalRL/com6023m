import database from '../config/database.js';

class BookmarkService {

    async getBookmarks(profileId: number, offset: number, limit: number) {
        try {
            const bookmarks = await database`
              SELECT posts.*, bookmarks.id AS bookmark_id, bookmarks.created_at
              FROM bookmarks
              JOIN posts ON posts.id = bookmarks.post_id
              WHERE bookmarks.profile_id = ${profileId}
              ORDER BY bookmarks.created_at DESC
              OFFSET ${offset}
              LIMIT ${limit}
            `;

            return bookmarks;

        } catch (err) {
            console.error(err);
        }
    }

    async addBookmark(profileId: number, postId: number) {
        await database.begin(async (sql) => {
            const result = await sql`
          INSERT INTO bookmarks (profile_id, post_id)
          VALUES (${profileId}, ${postId})
          ON CONFLICT DO NOTHING
          RETURNING *
        `;

            if (result.length > 0) {
                // Insert happened → safe to increment
                await sql`
        UPDATE posts
        SET bookmark_count = bookmark_count + 1
        WHERE id = ${postId}
      `;
            }
        });
    }

    async removeBookmark(profileId: number, postId: number) {
        await database.begin(async (sql) => {
            const result = await sql`
      DELETE FROM bookmarks
      WHERE profile_id = ${profileId} AND post_id = ${postId}
      RETURNING *
    `;

            if (result.length > 0) {
                await sql`
        UPDATE posts
        SET bookmark_count = bookmark_count - 1
        WHERE id = ${postId}
      `;
            }
        });
    }


    async isPostBookmarked(profileId: number, postId: number) {
        const result = await database`
      SELECT 1 FROM bookmarks
      WHERE profile_id = ${profileId} AND post_id = ${postId}
      LIMIT 1
    `;
        return result.length > 0;
    }

    async getBookmarkCount(postId: number): Promise<number> {
        const result = await database`
          SELECT COUNT(*) FROM bookmarks
          WHERE post_id = ${postId}
        `;
        return Number(result[0].count);
    }

    /**
     * Deletes all bookmarks from this user
     * Updates all posts bookmark count
     * @param userId
     */
    async deleteAllByUserId(userId: number): Promise<void> {
        const bookmarks = await database`
        SELECT post_id FROM bookmarks WHERE user_id = ${userId}
      `;

        await database`
        DELETE FROM bookmarks WHERE user_id = ${userId}
      `;

        for (const { post_id } of bookmarks) {
            await database`
          UPDATE posts SET bookmark_count = (
            SELECT COUNT(*) FROM bookmarks WHERE post_id = ${post_id}
          )
          WHERE id = ${post_id}
        `;
        }
    }

}

const bookmarkService = new BookmarkService();
export default bookmarkService ;