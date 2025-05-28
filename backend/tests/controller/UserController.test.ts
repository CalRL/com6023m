import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { userController } from '../../src/controllers/UserController.js';
import { Request, Response } from 'express';

vi.mock('../../src/services/UserService', async () => {
    return {
        userService: {
            createUser: vi.fn(),
            update: vi.fn(),
            deleteById: vi.fn(),
            findAll: vi.fn(),
            findById: vi.fn(),
            getFields: vi.fn(),
            updateFields: vi.fn(),
            sanitizeFields: vi.fn(),
            updatePassword: vi.fn()
        }
    }
});

vi.mock('../../src/services/PermissionsService', async () => {
    return {
        default: {
            hasPermission: vi.fn(),
        }
    }
});

vi.mock('../../src/services/AuthService', async () => {
    return {
        authService: {
            fromRequest: vi.fn(),
        }
    }
});

vi.mock('../../src/services/BlacklistService', async () => {
    return {
        default: {
            add: vi.fn(),
        }
    }
});

import { userService } from '../../src/services/UserService.js';
import permissionsService from '../../src/services/PermissionsService.js';
import { authService } from '../../src/services/AuthService.js';
import blacklistService from '../../src/services/BlacklistService.js';

const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    res.clearCookie = vi.fn().mockReturnThis();
    return res as Response;
};

describe('UserController', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('createUser', () => {
        it('should create a user and return 201', async () => {
            const mockUser = { username: 'test', email: 'test@example.com', password: 'password' };
            (userService.createUser as any).mockResolvedValue(mockUser);

            const req = {
                body: {
                    user: mockUser,
                }
            } as Request;
            const res = mockRes();

            await userController.createUser(req, res);

            expect(userService.createUser).toHaveBeenCalledWith('test', 'test@example.com', 'password');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully', user: mockUser });
        });

        it('should return 400 if fields are missing', async () => {
            const req = {
                body: {
                    user: { email: '', username: '', password: '' },
                }
            } as Request;
            const res = mockRes();

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 500 on error', async () => {
            (userService.createUser as any).mockRejectedValue(new Error('DB error'));
            const req = {
                body: {
                    user: { username: 'fail', email: 'fail@example.com', password: '123' },
                }
            } as Request;
            const res = mockRes();

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error creating user' });
        });
    });

    describe('getAllUsers', () => {
        it('should return users if ADMIN permission is granted', async () => {
            const mockUsers = [{ id: 1, username: 'admin' }];
            (authService.fromRequest as any).mockResolvedValue({ id: 1 });
            (permissionsService.hasPermission as any).mockResolvedValue(true);
            (userService.findAll as any).mockResolvedValue(mockUsers);

            const req = {} as Request;
            const res = mockRes();

            await userController.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should deny permission if not admin', async () => {
            (authService.fromRequest as any).mockResolvedValue({ id: 2 });
            (permissionsService.hasPermission as any).mockResolvedValue(false);

            const req = {} as Request;
            const res = mockRes();

            await userController.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('UserController', () => {
        
        afterEach(() => vi.restoreAllMocks());

        describe('updateUser', () => {
            beforeEach(() => {
                // Mock requester globally for these tests
                (authService.fromRequest as any).mockResolvedValue({ id: 1 });
            });

            it('should update a user and return 200', async () => {
                const req = {
                    params: { id: '1' },
                    body: { email: 'new@example.com' }
                } as unknown as Request;

                const res = mockRes();

                (permissionsService.hasPermission as any).mockResolvedValue(false);
                (userService.update as any).mockResolvedValue({ id: 1, email: 'new@example.com' });

                await userController.updateUser(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'User updated successfully',
                    updatedUser: { id: 1, email: 'new@example.com' }
                });
            });

            it('should return 422 for invalid user format', async () => {
                const req = {
                    params: { id: '1' },
                    body: null
                } as unknown as Request;

                const res = mockRes();

                (permissionsService.hasPermission as any).mockResolvedValue(false);

                await userController.updateUser(req, res);

                expect(res.status).toHaveBeenCalledWith(422);
                expect(res.json).toHaveBeenCalledWith({ error: 'User format invalid' });
            });

            it('should return 404 if user not found', async () => {
                const req = {
                    params: { id: '1' },
                    body: { email: 'notfound@example.com' }
                } as unknown as Request;

                const res = mockRes();

                (permissionsService.hasPermission as any).mockResolvedValue(false);
                (userService.update as any).mockResolvedValue(null); // Simulate user not found

                await userController.updateUser(req, res);

                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
            });
        });

        describe('deleteUserById', () => {
            it('should delete own account and blacklist token', async () => {
                const req = { params: { id: '1' }, headers: { authorization: 'Bearer token' } } as any;
                const res = mockRes();
                (authService.fromRequest as any).mockResolvedValue({ id: 1 });
                (permissionsService.hasPermission as any).mockResolvedValue(true);
                (userService.deleteById as any).mockResolvedValue(true);

                await userController.deleteUserById(req, res);
                expect(blacklistService.add).toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(200);
            });
        });

        describe('getUserById', () => {
            it('should return user if has admin permission', async () => {
                const req = { params: { id: '1' } } as any;
                const res = mockRes();
                (authService.fromRequest as any).mockResolvedValue({ id: 1 });
                (permissionsService.hasPermission as any).mockResolvedValue(true);
                (userService.findById as any).mockResolvedValue({ id: 1, username: 'admin' });

                await userController.getUserById(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
            });
        });

        describe('getFields', () => {
            it('should return specific fields for a user', async () => {
                const req = {
                    params: { id: '1' },
                    body: { fields: { first_name: true } }
                } as any;

                const res = mockRes();

                (authService.fromRequest as any).mockResolvedValue({ id: 1 });
                (permissionsService.hasPermission as any).mockResolvedValue(true);
                (userService.getFields as any).mockResolvedValue({ first_name: 'John' });

                await userController.getFields(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    data: { first_name: 'John' }
                });
            });
        });

        describe('updateFields', () => {
            it('should update allowed fields', async () => {
                const req = { params: { id: '1' }, body: { fields: { first_name: 'John' } } } as any;
                const res = mockRes();

                const sanitized = await userService.sanitizeFields({ first_name: 'John' });
                (userService.updateFields as any).mockResolvedValue(sanitized);
                (authService.fromRequest as any).mockResolvedValue({ id: 1 });
                (permissionsService.hasPermission as any).mockResolvedValue(true);
                (userService.sanitizeFields as any).mockResolvedValue({ first_name: 'John' });
                (userService.updateFields as any).mockResolvedValue({ first_name: 'John' });


                await userController.updateFields(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    message: 'User fields updated successfully'
                });
            });
        });

    });
});
