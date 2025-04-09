import { Request, Response } from 'express';
import { profileService } from '../services/ProfileService.js';
import {ProfileDTO} from "../models/profile.model.js";
import permissionsService from "../services/PermissionsService.js";
import {PermissionsDTO} from "../models/PermissionModel.js";
import {AuthenticatedRequest} from "../utils/interface/AuthenticatedRequest.js";

export async function getProfile(req: Request, res: Response) {
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