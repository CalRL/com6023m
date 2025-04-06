import { userService } from '../../src/services/UserService';
import database from '../../src/config/database';
import ProfileService from '../../src/services/ProfileService';
import PermissionsService from '../../src/services/PermissionsService';

// Mock the database module and its transaction method
jest.mock('../../src/config/database', () => {
    const mockSql = jest.fn().mockResolvedValue([{
        id: 1,
        email: 'test@example.com',
        username: 'test',
        password_hash: 'hashedpassword123',
    }]);

    const database = jest.fn((strings: TemplateStringsArray, ...values: any[]) => {
        return Promise.resolve([{
            id: 1,
            email: 'test@example.com',
            username: 'test',
            password_hash: 'hashedpassword123',
        }]);
    });

    database.begin = jest.fn((cb) => cb(mockSql));
    database.unsafe = jest.fn((query: string) => query);

    return database;
});

jest.mock('../../src/services/ProfileService', () => ({
    createProfile: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../src/services/PermissionsService', () => ({
    createDefaultPermissions: jest.fn().mockResolvedValue(undefined),
}));

describe('UserService', () => {

    // Test for createUser
    describe('createUser', () => {
        it('should successfully create a new user', async () => {
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                username: "test",
                password_hash: 'hashedpassword123',
            };

            const result = await userService.createUser('test@example.com', 'hashedpassword123');

            expect(result).toEqual(mockUser);
            expect(database.begin).toHaveBeenCalledTimes(1);
            expect(ProfileService.createProfile).toHaveBeenCalledWith(1, 'test');
            expect(PermissionsService.createDefaultPermissions).toHaveBeenCalledWith(1);
        });

        it('should throw an error if user creation fails', async () => {
            database.begin.mockRejectedValueOnce(new Error('Database error'));
            await expect(userService.createUser('test@example.com', 'hashedpassword123')).rejects.toThrow('User creation failed');
        });
    });

    afterAll(async () => {
        await new Promise((resolve) => setTimeout(() => resolve(true), 500));
    });
});
