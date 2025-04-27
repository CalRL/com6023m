import {userService} from "../services/UserService.js";
import {UserDTO} from "../models/UserModel.js";
import permissionsService from "../services/PermissionsService.js";
import {fromToken} from "../middleware/AuthMiddleware.js";
import { User } from "../models/UserModel.js";
import { Request, Response } from "express";
import {debugMode} from "../utils/DebugMode.js";


class UserController {
    async createUser(req: Request, res: Response): Promise<Response>  {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email, username, and password are required' });
            }

            const user: UserDTO = await userService.createUser(email, password);
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
     * @param req
     * @param res
     */
    async deleteUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params
            const parsedId: number = parseInt(id);

            const success = await userService.deleteById(parsedId);

            if(success === false) {
                throw new Error(`UserService couldn't delete ${id}`);
            }

            return res.status(200).json({ message: 'Success'})

        } catch(error) {
            console.error("Error deleting user: ", error);
            return res.status(500).json({ error: 'Error deleting user' });
        }

    }

    /**
     * Check if user is admin
     * @param id
     */
    async deleteUserById(id: number) {}

    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            //todo: get permission
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
        const JSON = req.body;
        if(req.body.fields) {
           const fields = Object.keys(req.body.fields);

           const disallowedFields = ['id', 'password_hash'];
            if(!Array.isArray(fields) || fields.length === 0) {
                return res.status(400).json({ error: 'No Fields Provided' });
            }

            const safeFields = fields.filter(f => disallowedFields.includes(f));
            if(safeFields.length === 0) {
                return res.status(400).json({ error: 'No Valid Fields Provided' });
            }
        }
        return res.status(404).json({ message: 'Resource not found' });
    }
    async getUserByEmail() {}

    async checkPermission() {}

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