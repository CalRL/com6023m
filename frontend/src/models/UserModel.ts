/**
 * Needs to have an ID, everything else can be nullable
 */
export interface User {
    id: number;
    email?: string;
    username?: string;
    password_hash?: string;
    created_at?: Date;
    first_name?: string;
    last_name?: string;
    phone_ext?: string;
    phone_number?: string;
    birthday?: Date;
}