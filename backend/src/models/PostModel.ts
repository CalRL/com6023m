export interface PostDTO {
    id?: number;
    profileId: number;
    parentId?: number | null;
    content: string;
    mediaUrl?: string | null;
    createdAt?: string;
}

export interface Post {

}