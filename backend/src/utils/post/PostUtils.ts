import likeService from '../../services/LikeService.js';
import {PostDTO} from '../../models/PostModel.js';
import bookmarkService from '../../services/BookmarkService.js';


export default async function formatPostWithCounts(post: PostDTO, profileId: number) {
    const [likeCount, bookmarkCount, liked, bookmarked] = await Promise.all([
        likeService.getLikeCount(post.id!),
        bookmarkService.getBookmarkCount(post.id!),
        likeService.isPostLiked(profileId, post.id!),
        bookmarkService.isPostBookmarked(profileId, post.id!),
    ]);

    return {
        ...post,
        likeCount,
        bookmarkCount,
        liked,
        bookmarked,
    };
}