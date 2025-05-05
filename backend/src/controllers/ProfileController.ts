import {Request, Response} from 'express';
import {profileService} from '../services/ProfileService.js';
import {ProfileDTO} from "../models/profile.model.js";
import {AuthenticatedRequest} from "../utils/interface/AuthenticatedRequest.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import {Permissions} from "../User/Permissions.js";
import {userService} from "../services/UserService.js";

class ProfileController {

    async getProfile(req: Request, res: Response) {
        try {
            const authReq = req as unknown as AuthenticatedRequest;

            if (!authReq.user || !authReq.user.id) {
                return res.status(401).json({ message: 'Unauthorized: No valid token found' });
            }
            const userId: number = authReq.user.id;

            // const permissionsDTO: PermissionsDTO  = await permissionsService.getPermissions(userId);
            // const permissions: string[] = permissionsDTO.permissions
            // if(!permissions || !permissions.includes("SELF_READ")) {
            //     return res.status(403).json({ message: 'Permission denied' });
            // }

            const profileDTO: ProfileDTO | null = await profileService.getProfileById(userId);
            if (!profileDTO) {
                return res.status(404).json({ message: 'Profile not found' });
            }

            console.log("getProfile Output: " + JSON.stringify(profileDTO));
            return res.status(200).json(profileDTO);
        } catch (error: any) {
            console.error('Error fetching profile:', error.message);
            return res.status(500).json({ message: 'Error fetching profile' });
        }

    }

    async getProfileById(req: Request, res: Response) {
        try {
            const id = req.params.id;
        } catch(error) {
            res.status(500);
            throw error;
        }
    }

    async getUsername(req: Request, res: Response) {
        const hasPermission = await authMiddleware.ensurePermission(req, res, Permissions.READ_OTHER);
        if(!hasPermission) {
            return res.status(401).json({ message: 'Unauthorized: Not authorized' });
        }

        const targetId: string | undefined = req.params.id;
        if(!targetId || typeof targetId === 'undefined') {
            return res.status(500);
        }
        const username = await userService.getUsername(parseInt(targetId));
        if(!username) {
            return res.status(404).json({ message: 'No username found' });
        }

        return res.status(200).json(username);
    }

    /**
     * This method should never be called.
     * This is here to show I haven't missed the creation part of profiles.
     * Profiles should never be created without a user.
     * Profiles are created by the service in the UserController.
     * @param req
     * @param res
     */
    async createProfile(req: Request, res: Response) {
        return res.status(403).json({ message: 'Forbidden.' });
    }



}

const profileController = new ProfileController();
export default profileController;
