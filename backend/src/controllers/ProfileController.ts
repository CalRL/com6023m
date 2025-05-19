import {Request, Response} from 'express';
import {profileService} from '../services/ProfileService.js';
import {ProfileDTO} from "../models/profile.model.js";
import {AuthenticatedRequest} from "../utils/interface/AuthenticatedRequest.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import {Permissions} from "../User/Permissions.js";
import {userService} from "../services/UserService.js";
import {authService} from "../services/AuthService.js";
import permissionsService from "../services/PermissionsService.js";
import {debug} from "node:util";
import {debugMode} from "../utils/DebugMode.js";

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
            const user = await authService.fromRequest(req, res);
            if(!user || typeof user.id !== 'number') {
                return res.status(401).json({ message: 'Unauthorized: No valid token found' });
            }

            const userId = user.id;
            const targetId: number = req.params.id ? parseInt(req.params.id) : userId;

            if(!targetId) {
                return res.status(500);
            }

            let hasPermission: boolean = false;
            if(targetId === user.id) {
                hasPermission = await permissionsService.hasPermission(targetId, Permissions.SELF_READ);
                debugMode.log(`ProfileController: Getting selfread permission ${hasPermission}`)
            } else {
                hasPermission = await permissionsService.hasPermission(user.id, Permissions.READ_OTHER);
                debugMode.log(`ProfileController: Getting readother permission ${hasPermission}`)
            }

            if(!hasPermission) {
                return res.status(401).json({ message: 'Unauthorized: Not authorized' });
            }

            const profile = await profileService.getProfileById(targetId);
            if(!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }

            return res.status(200).json(profile);

        } catch(error) {
            res.status(500);
            throw error;
        }
    }

    async getUsername(req: Request, res: Response) {
        const user = await authService.fromAccessToken(req);
        if(!user || typeof user.id !== 'number') {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }

        const userId: number = user.id;
        const targetId: number = req.params.id ? parseInt(req.params.id) : userId;

        if(!targetId) {
            return res.status(500);
        }

        let hasPermission = false;
        if(targetId === user.id) {
            hasPermission = await permissionsService.hasPermission(targetId, Permissions.SELF_READ);
            debugMode.log(`ProfileController: Getting selfread permission ${hasPermission}`)
        } else {
            hasPermission = await permissionsService.hasPermission(targetId, Permissions.READ_OTHER);
            debugMode.log(`ProfileController: Getting readother permission ${hasPermission}`)
        }

        if(!hasPermission) {
            return res.status(401).json({ message: 'Unauthorized: Not authorized' });
        }

        const username = await userService.getUsername(targetId);
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

    /*
    todo: make it Only self
     */
    async uploadAvatar(req: Request, res: Response) {}
    async deleteAvatar(req: Request, res: Response) {}
    async uploadBanner(req: Request, res: Response) {}
    async deleteBanner(req: Request, res: Response) {}
    async updateLocation(req: Request, res: Response) {}
    async getLocation(req: Request, res: Response) {}

    async updateBio(req: Request, res: Response) {}
    async getBio(req: Request, res: Response) {}

    //todo: make a privacy interface
    async getPrivacy(req: Request, res: Response) {}
    async updatePrivacy(req: Request, res: Response) {}

}

const profileController = new ProfileController();
export default profileController;
