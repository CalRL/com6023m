import {EnrichedPost, PostDTO} from '../models/PostModel.js';
import database from '../config/database.js';
import {debugMode} from '../utils/DebugMode.js';
import likeService from './LikeService.js';
import bookmarkService from './BookmarkService.js';
import {profileService} from './ProfileService.js';
import LikeService from './LikeService.js';
import {ProfileDTO} from '../models/ProfileModel.js';

class PostsService {

    /**
     * Create a post and return the created json
     * @param post - the postDTO
     */
    async create(post: PostDTO) {
        const result = await database`
          INSERT INTO posts (
            profile_id, 
            parent_id, 
            content, 
            created_at
          )
          VALUES (
            ${post.profileId}, 
            ${post.parentId ?? null}, 
            ${post.content}, 
            NOW()
          )
          RETURNING *;
        `;

        const row = result[0];
        if (!row) {
            debugMode.warn('Couldn\'t get post...');
            return null;
        }

        const postDTO: PostDTO = {
            id: row.id,
            profileId: row.profile_id,
            parentId: row.parent_id,
            content: row.content,
            mediaUrl: row.media_url,
            createdAt: row.created_at,
            like_count: row.like_count,
        };
        return postDTO;
    }

    /**
     * Get post by id
     * @param id
     */
    async getById(id: number) {
        const result = await database<any[]>`
            SELECT * FROM posts WHERE id = ${id}
        `;

        const row = result[0];
        if (!row) {
            debugMode.warn('Couldn\'t get post...');
            return null;
        }

        const postDTO: PostDTO = {
            id: row.id,
            profileId: row.profile_id,
            parentId: row.parent_id,
            content: row.content,
            mediaUrl: row.media_url,
            createdAt: row.created_at,
            like_count: row.like_count,
        };

        return postDTO;
    }

    /**
     * Delete post by id
     * @param id
     */
    async deleteById(id: number) {
        const result = await database`
        DELETE FROM posts WHERE id = ${id}
        `;
        if (result.count === 0) {
            debugMode.warn('Couldn\'t delete post...');
        }
        return result.count > 0;
    }

    async getAllByProfileId(profileId: number) {}
    async deleteAllByProfileId(profileId: number) {}

    /**
     * Get posts by profile id, with offset and limit
     * (defaults to 10 per request)
     * @param profileId
     * @param offset
     * @param limit
     */
    async getPostsByProfileId(profileId: number, offset = 0, limit = 10) {
        debugMode.log(`Using offset: ${offset} and limit ${limit}`);
        const result = await database`
            SELECT id, content, media_url, created_at
            FROM posts
            WHERE profile_id = ${profileId}
            ORDER BY created_at DESC, id DESC
            OFFSET ${offset}
            LIMIT ${limit}
        `;

        const posts = result;

        if (!posts || posts.length === 0) {
            return [];
        }

        return posts;
    }

    /**
     * Add a like to a post by id
     * @param profileId - the users profile id
     * @param postId - the post id
     */
    async addLike(profileId: number, postId: number) {
        await database`
      INSERT INTO likes (profile_id, post_id)
      VALUES (${profileId}, ${postId})
      ON CONFLICT DO NOTHING
    `;

        await database`
      UPDATE posts
      SET like_count = (
        SELECT COUNT(*) FROM likes WHERE post_id = ${postId}
      )
      WHERE id = ${postId}
    `;
    }

    /**
     * Remove a like from a post by id
     * @param profileId - the user's profile id
     * @param postId - the post id
     */
    async removeLike(profileId: number, postId: number) {
    await database`
      DELETE FROM likes
      WHERE profile_id = ${profileId} AND post_id = ${postId}
    `;

    await database`
      UPDATE posts
      SET like_count = (
        SELECT COUNT(*) FROM likes WHERE post_id = ${postId}
      )
      WHERE id = ${postId}
    `;
    }

    /**
     * Check if a profile has liked a post
     * @param profileId - the user's profile id
     * @param postId - the post id
     */
    async hasLiked(profileId: number, postId: number ) {
    const result = await database`
        SELECT 1 FROM likes WHERE profile_id = ${profileId} AND post_id = ${postId}
    `;
    return result.length > 0;
    }

    /**
     * Get message replies' by mesasge id
     * @param postId
     * @param profileId
     * @param offset
     * @param limit
     */
    async getRepliesByParentId(postId: number, profileId: number, offset: number, limit: number) {
        const replies = await database`
        SELECT id, profile_id, parent_id, content, media_url, created_at
        FROM posts
        WHERE parent_id = ${postId}
        ORDER BY created_at ASC
        OFFSET ${offset} LIMIT ${limit}
    `;

        const enriched = await Promise.all(
            replies.map(async (post) => {
                const profile = await profileService.getProfileById(post.profile_id);

                // Filter out replies from private profiles unless it's the current user
                if (!profile || (profile.isPrivate && profile.id !== profileId)) {
                    return null;
                }

                const [likeCount, bookmarkCount, liked, bookmarked] = await Promise.all([
                    likeService.getLikeCount(post.id!),
                    bookmarkService.getBookmarkCount(post.id!),
                    likeService.isPostLiked(profileId, post.id!),
                    bookmarkService.isPostBookmarked(profileId, post.id!)
                ]);

                return {
                    post: {
                        id: post.id!,
                        content: post.content,
                        mediaUrl: post.media_url,
                        createdAt: post.created_at!,
                        likeCount,
                        bookmarkCount,
                        liked,
                        bookmarked
                    },
                    profile
                };
            })
        );

        return enriched.filter(
            (entry): entry is { post: any; profile: ProfileDTO } => entry !== null
        );
    }


    /**
     * Get enriched post, this includes:
     * like count
     * bookmark count
     * is: liked, bookmarked
     * profile
     * @param userId
     * @param offset
     * @param limit
     */
    async getLatestEnrichedPosts(userId: number, offset: number, limit: number) {
        const rawPosts = await database`
        SELECT * FROM posts
        WHERE parent_id IS NULL
        ORDER BY created_at DESC
        OFFSET ${offset} LIMIT ${limit}
      `;

        const enriched = await Promise.all(
            rawPosts.map(async (post) => {
                const profile = await profileService.getProfileById(post.profile_id);

                // skip profile if private unless its self profile
                if (profile?.isPrivate && profile.id !== userId) {
                    return null;
                }

                const liked = await this.hasLiked(userId, post.id);
                const bookmarked = await bookmarkService.isPostBookmarked(userId, post.id);
                const bookmarkCount = await bookmarkService.getBookmarkCount(post.id);
                const likeCount = await likeService.getLikeCount(post.id);

                return {
                    post: {
                        id: post.id,
                        profileId: post.profile_id,
                        parentId: post.parent_id,
                        content: post.content,
                        mediaUrl: post.media_url,
                        createdAt: post.created_at,
                        liked,
                        bookmarked,
                        bookmarkCount,
                        likeCount
                    },
                    profile
                };
            })
        );
        // return posts without null entries
        return enriched.filter((entry): entry is { post: any, profile: ProfileDTO } => entry !== null);
    }

}

const postsService = new PostsService();
export default postsService;