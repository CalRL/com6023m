export interface Profile {
    id: number;
    displayName: String;
    avatarUrl?: string;
    location?: String;
}

export interface ProfileDTO{
    id: number;
    displayName: string;
    avatarUrl?: string;
    location?: string;
}

/*

  id          Int      @id
  displayName String
  avatarUrl   String?
  location    String?

 */