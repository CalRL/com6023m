export interface Permissions {
    user_id: number;
    permissions: string[];
}

export interface PermissionsDTO {
    user_id?: number;
    permissions?: string[];
}