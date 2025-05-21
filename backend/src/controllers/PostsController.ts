import { Request, Response } from "express";
import {debugMode} from "../utils/DebugMode.js";
import authMiddleware, {fromToken} from "../middleware/AuthMiddleware.js";
import permissionsService from "../services/PermissionsService.js";
import {Permissions} from "../User/Permissions.js";
import {User, UserDTO} from "../models/UserModel.js";
import {PostDTO} from "../models/PostModel.js";
import {ErrorMessages} from "../utils/errors.js";
import {authService} from "../services/AuthService.js";
import postsService from "../services/PostsService.js";

class PostsController {
    status: string = "Alive";

    constructor() {
        this.getStatus = this.getStatus.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
    }

    // CRUD
    // CUD Methods
    async createPost(req: Request, res: Response) {
        const user = await fromToken(req);
        if(!user || !user.id) {
            return res.status(401).json({ message: 'User Not Found' });
        }
        const hasPermission = await permissionsService.hasPermission(user.id, Permissions.CREATE_POST);
        if(!hasPermission) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const post = req.body.post as PostDTO;
        post.profileId = user.id;
        if(!post) {
            return res.status(500).json({ message: "Couldn't process post" });
        }

        const createdPost = await postsService.create(post);
        return res.status(201).json({createdPost});

    }
    async updatePost(req: Request, res: Response) {}
    async deletePost(req: Request, res: Response) {
        const user = await fromToken(req);
        if(!user || !user.id) {
            return res.status(401).json({ message: 'User Not Found' });
        }

        const postId = req.params.id;
        const post = await postsService.getById(parseInt(postId));
        if(!post) {
            return res.status(404).json({ message: 'Not found' });
        }
        let hasPermission = false;
        if(post.profileId == user.id) {
            hasPermission = await permissionsService.hasPermission(user.id, Permissions.DELETE_POST);
        } else {
            let deleteOther: boolean = await permissionsService.hasPermission(user.id, Permissions.DELETE_OTHER_POST)
            let admin: boolean= await permissionsService.hasPermission(user.id, Permissions.ADMIN)
            if(admin || deleteOther) {
                hasPermission = true;
            }
        }

        if(!hasPermission) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const isDeleted = await postsService.deleteById(parseInt(postId));
        if(!isDeleted) {
            return res.status(500).json({ message: 'Error' });
        }
        return res.status(204).json({message: 'Successfully deleted'});
    }

    async getStatus(req: Request, res: Response) {
        try {
            const user = await authService.fromRequest(req, res);

            debugMode.log("PostsController: " + JSON.stringify(user));
            if(!user || !user.id) {
                return res.status(401).json({ message: 'User Not Found' });
            }

            const hasPermission = permissionsService.hasPermission(user.id, Permissions.ADMIN)
            if(!hasPermission) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            debugMode.log(`PostsController: hasPermission: ${JSON.stringify(hasPermission)}`);
            return res.status(200).json({"status": this.status});

        } catch (error) {
            return res.status(403).json({ message: (error as Error).message });
        }
    }
    async updateStatus(req: Request, res: Response) {
        try {
            const user = await fromToken(req);
            debugMode.log("PostsController: " + JSON.stringify(user));
            if(!user || !user.id) {
                return res.status(401).json({ message: 'User Not Found' });
            }
            const hasPermission = await permissionsService.hasPermission(user.id, Permissions.ADMIN);
            debugMode.log(`PostsController: hasPermission: ${JSON.stringify(hasPermission)}`);
            if(!hasPermission) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            this.status = this.status === "Alive" ? "Inactive" : "Alive";
            debugMode.log(`PostsController: updated status to '${this.status}' by: ${JSON.stringify(user)}`);
            return res.status(200).json({"status": this.status});
        } catch(error) {
            throw error;
        }
    }

    // R methods
    async getPostById(req: Request, res: Response) {
        const user = await fromToken(req);
        if(!user || !user.id) {
            return res.status(401).json({ message: 'User Not Found' });
        }
        const hasPermission = await permissionsService.hasPermission(user.id, Permissions.READ_POST);
        if(!hasPermission) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const postId = req.params.id;
        const post = await postsService.getById(parseInt(postId));

        return res.status(200).json({post});


    }
    async getPostsByParentId(req: Request, res: Response) {}
    async getPostsByUserId(req: Request, res: Response) {
        
    }

    /**
     * Gets the user
     * Checks the user has permission
     * returns
     *
     * @param req
     * @param permission
     */
    async handleRequest(req: Request, permission: Permissions) {


    }
}

export const postsController = new PostsController();