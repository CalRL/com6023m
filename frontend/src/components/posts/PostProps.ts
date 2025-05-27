export interface PostProps {
    id: number;
    content: string;
    mediaUrl?: string;
    createdAt: string;
    liked?: boolean;
    bookmarked?: boolean;
    likeCount?: number;
    bookmarkCount?: number;
    profileId: number;
}

