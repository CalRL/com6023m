import { Request, Response } from 'express';
import { profileService } from '../services/ProfileService';
import { hasPermission, Permission } from '../User/Permissions';
import UserWrapper from "../User/UserWrapper.js";

export async function getProfile(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const permissions = req.user.permissions;
        const user = new UserWrapper(userId);
        // Check permission
        if (await user.hasPermission(permissions, Permissions.SELF_READ)) {
            return res.status(403).json({ message: 'Permission denied' });
        }

        const profile = await profileService.getProfileById(userId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        return res.status(200).json(profile);
    } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        return res.status(500).json({ message: 'Error fetching profile' });
    }
}

/**
 * This method should never be called.
 * This is here to show I haven't missed the creation part of profiles.
 * Profiles should never be created without a user.
 * Profiles are created by the service in the UserController.
 * @param req
 * @param res
 */
export async function createProfile(req: Request, res: Response) {
    return res.status(403).json({ message: 'Forbidden.' });
}