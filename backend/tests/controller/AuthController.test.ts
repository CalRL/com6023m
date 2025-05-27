import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authControllerModule from '../../src/controllers/AuthController.js'; // adjust path as needed
import { registerController, loginController } from '../../src/controllers/AuthController.js';
import {authService} from '../../src/services/AuthService.js';
import * as jwtUtils from '../../src/utils/jwt.js';

describe('Auth Controllers', () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        req = {
            body: {},
            headers: {},
            cookies: {},
        };
        res = {
            status: vi.fn(() => res),
            json: vi.fn(() => res),
            cookie: vi.fn(() => res),
            clearCookie: vi.fn(() => res),
            send: vi.fn(() => res),
        };

        vi.restoreAllMocks();
    });

    describe('registerController', () => {
        it('should register a user and return accessToken and set refreshToken cookie', async () => {
            req.body = { username: 'user', email: 'user@test.com', password: 'pass' };

            const tokens = { accessToken: 'access123', refreshToken: 'refresh123' };
            vi.spyOn(authService, 'registerUser').mockResolvedValue(tokens);

            await registerController(req, res);

            expect(authService.registerUser).toHaveBeenCalledWith('user', 'user@test.com', 'pass');
            expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh123', expect.objectContaining({
                httpOnly: true,
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ accessToken: 'access123' });
        });

        it('should handle errors and respond with 400', async () => {
            req.body = { username: 'user', email: 'user@test.com', password: 'pass' };
            vi.spyOn(authService, 'registerUser').mockRejectedValue(new Error('Failed to register'));

            await registerController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Failed to register' });
        });
    });

    describe('loginController', () => {
        it('should login a user and return accessToken and set refreshToken cookie', async () => {
            req.body = { email: 'user@test.com', password: 'pass' };

            const tokens = { accessToken: 'access123', refreshToken: 'refresh123' };
            vi.spyOn(authService, 'loginUser').mockResolvedValue(tokens);

            await loginController(req, res);

            expect(authService.loginUser).toHaveBeenCalledWith('user@test.com', 'pass');
            expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh123', expect.objectContaining({
                httpOnly: true,
                secure: true,
                path: "/",
            }));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ accessToken: 'access123' });
        });

        it('should handle login errors and respond with 401', async () => {
            req.body = { email: 'user@test.com', password: 'pass' };
            vi.spyOn(authService, 'loginUser').mockRejectedValue(new Error('Invalid credentials'));

            await loginController(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });
    });

    describe('AuthController.check', () => {
        const authController = authControllerModule.default;

        it('should respond 200 with decoded access token if valid', async () => {
            req.headers.authorization = 'Bearer validtoken';
            vi.spyOn(jwtUtils, 'verifyToken').mockImplementation(token => {
                if(token === 'validtoken') return { id: 1, email: 'user@test.com' };
                return null;
            });

            await authController.check(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: 1,
                email: 'user@test.com',
            });
        });

        it('should respond 401 if no refresh token provided and no valid access token', async () => {
            req.headers.authorization = 'Bearer invalidtoken';
            req.cookies.refreshToken = undefined;
            vi.spyOn(jwtUtils, 'verifyToken').mockReturnValue(null);

            await authController.check(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'No refresh token available' });
        });

        it('should respond 403 if refresh token is invalid', async () => {
            req.cookies.refreshToken = 'badtoken';
            vi.spyOn(jwtUtils, 'verifyToken').mockImplementation(token => null);

            await authController.check(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired refresh token' });
        });

        it('should generate new access token if refresh token is valid', async () => {
            req.cookies.refreshToken = 'goodtoken';
            vi.spyOn(jwtUtils, 'verifyToken').mockImplementation(token => {
                if(token === 'goodtoken') return { id: 2, email: 'refreshtest@test.com' };
                return null;
            });
            vi.spyOn(jwtUtils, 'generateAccessToken').mockReturnValue('newAccessToken');

            await authController.check(req, res);

            expect(jwtUtils.generateAccessToken).toHaveBeenCalledWith({ id: 2, email: 'refreshtest@test.com' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: 2,
                email: 'refreshtest@test.com',
                accessToken: 'newAccessToken',
            });
        });
    });

    describe('AuthController.logout', () => {
        const authController = authControllerModule.default;

        it('should clear refresh token cookie and respond 204', async () => {
            await authController.logout(req, res);

            expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', {
                httpOnly: true,
                secure: true,
            });
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });
    });

    // TODO: Implement refresh tests when implementation is done
});
