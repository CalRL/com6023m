import {ProfileDTO} from './ProfileModel.js';

export interface PostDTO {
    id?: number;
    profileId: number;
    parentId?: number | null;
    content: string;
    mediaUrl?: string | null;
    createdAt?: string;
    like_count?: number;
    bookmark_count?: number;
}

export type EnrichedPost = {
    post: PostDTO & {
        likeCount: number;
        bookmarkCount: number;
        liked: boolean;
        bookmarked: boolean;
    };
    profile: ProfileDTO;
};
