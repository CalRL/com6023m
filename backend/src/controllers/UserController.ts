import {userService} from "../services/UserService.js";
import {UserDTO} from "../models/UserModel.js";
import permissionsService from "../services/PermissionsService.js";
import {fromToken} from "../middleware/AuthMiddleware.js";
import { User } from "../models/UserModel.js";
import { Request, Response } from "express";
import {debugMode} from "../utils/DebugMode.js";
import { Permissions } from "../User/Permissions.js";


class UserController {
    /**
     * {
     *     "user": {
     *         "email": "",
     *         "password": ""
     *     }
     * }
     * @param req
     * @param res
     */
    async createUser(req: Request, res: Response): Promise<Response>  {
        try {
            const { username, email, password } = req.body.user;

            if (!username || !email || !password) {
                return res.status(400).json({ error: 'Email, username, and password are required' });
            }

            console.log(`Username: ${username}`);
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);

            const user: UserDTO = await userService.createUser(username, email, password);
            return res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Error creating user' });
        }
    }

    /**
     *
     * TODO: Logic
     * I'm thinking having a standardized system like,
     * {
     *     "id": number
     *     "user": {
     *         userdatahere
     *     }
     * }
     *
     * then check the userid,
     * if its the same as the person who made the request,
     * check permission SELF_UPDATE,
     * else check for UPDATE_OTHER,
     * then offload the logic to the UserService.
     *
     * TODO: represent data object with a interface?
     * TODO: check permissions
     *
     * @param req
     * @param res
     */
    async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user: UserDTO = req.body;
            console.log("User: " + JSON.stringify(user))

            const parsedId = parseInt(id);

            if(!user) {
                return res.status(422).json({ error: 'User format invalid' });
            }

            const updatedUser = await userService.update(parsedId, user)

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({ message: 'User updated successfully', updatedUser });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ error: 'Error updating user' });
        }
    }

    /**
     * Check user is self or admin
     * todo: make it chek req res
     * todo: check perms
     * @param req
     * @param res
     */
    async deleteUserById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params
            const targetId: number = parseInt(id);

            const user = await fromToken(req);
            if(!user) {
                return res.status(500);
            }
            /**
             * Handle self deletion..
             */
            let hasPermission: boolean = false;
            const userId: number | undefined = user.id;

            /**
             * No user id found
             */
            if(!userId) {
                return res.status(500);
            }

            /**
             * handle each diff permission
             */
            if(userId == targetId) {
                hasPermission = await permissionsService.hasPermission(userId, Permissions.DELETE_SELF);
            } else {
                if(await permissionsService.hasPermission(userId, Permissions.DELETE_OTHER)) {
                    hasPermission = true
                }
                if (await permissionsService.hasPermission(userId, Permissions.ADMIN)) {
                    hasPermission = true
                }
            }

            if(!hasPermission) {
                return res.status(403).json({ message: "Forbidden: Lacking permission"})
            }

            const success = await userService.deleteById(targetId);

            if(!success) {
                res.status(500).json({message: `Couldn't delete user with id ${targetId}`});
                throw new Error(`UserService couldn't delete ${targetId}`);
            }

            return res.status(200).json({ message: 'Success'})

        } catch(error) {
            console.error("Error deleting user: ", error);
            return res.status(500).json({ error: 'Error deleting user' });
        }

    }

    /**
     * delete self
     * @param req
     * @param res
     */
    async deleteUser(req: Request, res: Response): Promise<Response> {
        const user = await fromToken(req);
        if(!user) {
            return res.status(500).json({ error: 'User not found' });
        }

        const userId = user.id;
        if(!userId) {
            return res.status(500).json({ error: 'User object has no ID' });
        }

        const hasPermission = await permissionsService.hasPermission(userId, Permissions.DELETE_SELF);
        if(!hasPermission) {
            return res.status(403).json({ message: "Forbidden: Lacking permission"});
        }

        const success = await userService.deleteById(userId);
        if(!success) {
            return res.status(500);
        }
        return res.status(200).json({ message: 'Success'});

    }

    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const user = await fromToken(req);
            console.log("UserController: " + JSON.stringify(user));

            if(user == null || user.id == null) {
                return res.status(500).json({ error: 'User not found in provided token' });
            }
            
            const hasPermission = await permissionsService.hasPermission(user.id, "ADMIN");
            console.log('Perm: ' + hasPermission);

            if(!hasPermission) {
                console.log('No permission');
                return res.status(403).json({ error: 'Permission Denied' });
            }

            const users = await userService.findAll();
            return res.status(200).json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error getting users"});
        }
    }
    async getUserById(req: Request, res: Response): Promise<Response> {
        const userId = parseInt(req.params.id);
        const reqUser = await fromToken(req);

        if(reqUser == null || reqUser.id == null) {
            return res.status(500).json({ error: 'User not found in provided token' });
        }

        const hasPermission = await permissionsService.hasPermission(reqUser.id, "ADMIN");

        if(!hasPermission) {
            debugMode.log(`User ${userId} does not have permission`);
            return res.status(403).json({ error: 'Permission Denied' });
        }

        const user: User | null = await userService.findById(userId);
        if (!user) {
            return res.status(500).json({ error: 'User not found' });
        }

        console.log(`UserController: Found User ${JSON.stringify(user)}`);

        return res.status(200).json({ message: 'User found successfully', user });
    }
    async getUserByEmail() {}

    async checkPermission() {}

    async getPermissions(req: Request, res: Response): Promise<Response> {
        const user = await fromToken(req);
        if(!user) {
            return res.status(500).json({ error: 'User not found in provided token'});
        }

        const userId: number | undefined = user.id;
        if(!userId) {
            return res.status(500).json({error: 'No user id found'})
        }

        let hasPermission: boolean = await permissionsService.hasPermission(userId, Permissions.SELF_READ);
        if(!hasPermission) {
            return res.status(403).json({ error: 'Forbidden: Permission Denied' });
        }

        const permissions = await permissionsService.getPermissions(userId);
        if(!permissions) {
            return res.status(500).json({ error: 'User has no permissions?' });
        }

        return res.status(200).json({ success: true, permissions: permissions });
    }

    async getFields(req: Request, res: Response): Promise<Response> {
        try {
            const userId = parseInt(req.params.id);

            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID format'
                });
            }

            // Get fields from request body
            const { fields } = req.body;
            debugMode.log("Fields:" + JSON.stringify(fields));
            // Use the UserService to get the fields
            const userData = await userService.getFields(userId, fields);

            if (!userData) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: userData
            });
        } catch (error) {
            console.error('Error fetching user fields:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch user fields',
                error: (error as Error).message
            });
        }
    }

    async updateFields(req: Request, res: Response): Promise<Response> {
        try {
            const userId = parseInt(req.params.id);

            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID format'
                });
            }

            const fields = req.body.fields;

            if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid request body'
                });
            }

            // Optionally, validate allowed field names here
            const allowedFields = ['first_name', 'last_name', 'phone_ext', 'phone_number', 'birthday'];
            const filteredFields: Record<string, any> = {};

            for (const [key, value] of Object.entries(fields)) {
                if (allowedFields.includes(key)) {
                    filteredFields[key] = value;
                }
            }

            if (Object.keys(filteredFields).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No valid fields provided for update'
                });
            }

            await userService.updateFields(userId, filteredFields);

            return res.status(200).json({
                success: true,
                message: 'User fields updated successfully'
            });
        } catch (error) {
            console.error('Error updating user fields:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update user fields',
                error: (error as Error).message
            });
        }
    }
}

export const userController = new UserController();