export interface ApiKey {
    id: string;
    userId: number;
    apiKey: string;
    roleId: number;
    createdAt: Date;
    lastUsed?: Date;
    status: string;
}
