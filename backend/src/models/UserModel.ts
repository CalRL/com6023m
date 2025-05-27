export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
  first_name?: string;
  last_name?: string;
  phone_ext?: string;
  phone_number?: string;
  birthday?: Date;
}

// Data Transfer Object (DTO) for creating or updating a user
export interface UserDTO {
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