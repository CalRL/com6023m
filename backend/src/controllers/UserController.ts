import {userService} from "../services/UserService.js";
import {UserDTO} from "../models/UserModel.js";
import permissionsService from "../services/PermissionsService.js";
import {fromToken} from "../middleware/AuthMiddleware.js";
class UserController {
    async createUser(req: Request, res: Response): Promise<User> {
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
     *
     * @param req
     * @param res
     */
    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user: UserDTO = req.body;
            console.log("User: " + JSON.stringify(user))

            if(!user) {
                return res.status(422).json({ error: 'User format invalid' });
            }

            const updatedUser = await userService.update(id, user)

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
    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params

            const success = await userService.deleteById(id);
            if(success === false) {
                throw new Error(`UserService couldn't delete ${id}`);
            }

            res.status(200).json({ message: 'Success'})

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

    async getAllUsers(req: Request, res: Response) {
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
    async getUserById(req: Request, res: Response) {
        return res.status(404).json({ message: 'Resource not found' });
    }
    async getUserByEmail() {}

    async checkPermission() {}
}

export const userController = new UserController();