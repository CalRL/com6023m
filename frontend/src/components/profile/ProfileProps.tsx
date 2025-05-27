export interface ProfileProps {
    id: number;
    displayName: string;
    username: string;
    avatarUrl: string | null;
    bio?: string;
    website?: string;
    location?: string;
    joinedAt: string;
    isPrivate?: boolean;
    coverImageUrl?: string | null;
}

export interface Profile {
    profile: ProfileProps;
}