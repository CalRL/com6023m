export interface Profile {
    id: number;
    displayName: String;
    avatarUrl?: string;
    location?: String;
}

export interface ProfileDTO{
    displayName: String;
    avatarUrl?: string;
    location?: String;
}

/*

  id          Int      @id
  displayName String
  avatarUrl   String?
  location    String?

 */