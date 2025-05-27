export interface Profile {
    id: number;
    displayName: string;
    avatarUrl?: string;
    location?: string;
}

export interface ProfileDTO{
    id: number;
    displayName: string;
    avatarUrl?: string;
    location?: string;
    username?: string;
    bio?: string;
    website?: string;
    isPrivate?: boolean;
    coverImageUrl?: string;
    joinedAt?: string;
}