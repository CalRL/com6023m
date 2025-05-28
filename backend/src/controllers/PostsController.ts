import { Request, Response } from 'express';
import {debugMode} from '../utils/DebugMode.js';
import authMiddleware, {fromToken} from '../middleware/AuthMiddleware.js';
import permissionsService from '../services/PermissionsService.js';
import {Permissions} from '../User/Permissions.js';
import {User, UserDTO} from '../models/UserModel.js';
import {PostDTO} from '../models/PostModel.js';
import {ErrorMessages} from '../utils/errors.js';
import {authService} from '../services/AuthService.js';
import postsService from '../services/PostsService.js';
import formatPostWithCounts from '../utils/post/PostUtils.js';
import {profileService} from '../services/ProfileService.js';


class PostsController {
    status: string = 'Alive';

    constructor() {
        this.getStatus = this.getStatus.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
    }

    // CRUD
    // CUD Methods
    async createPost(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
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
            return res.status(500).json({ message: 'Couldn\'t process post' });
        }

        const createdPost = await postsService.create(post);
        return res.status(201).json({createdPost});

    }
    async deletePost(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
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
            const deleteOther: boolean = await permissionsService.hasPermission(user.id, Permissions.DELETE_OTHER_POST);
            const admin: boolean= await permissionsService.hasPermission(user.id, Permissions.ADMIN);
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

            debugMode.log('PostsController: ' + JSON.stringify(user));
            if(!user || !user.id) {
                return res.status(401).json({ message: 'User Not Found' });
            }

            const hasPermission = permissionsService.hasPermission(user.id, Permissions.ADMIN);
            if(!hasPermission) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            debugMode.log(`PostsController: hasPermission: ${JSON.stringify(hasPermission)}`);
            return res.status(200).json({'status': this.status});

        } catch (error) {
            return res.status(403).json({ message: (error as Error).message });
        }
    }
    async updateStatus(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
        debugMode.log('PostsController: ' + JSON.stringify(user));
        if(!user || !user.id) {
            return res.status(401).json({ message: 'User Not Found' });
        }
        const hasPermission = await permissionsService.hasPermission(user.id, Permissions.ADMIN);
        debugMode.log(`PostsController: hasPermission: ${JSON.stringify(hasPermission)}`);
        if(!hasPermission) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        this.status = this.status === 'Alive' ? 'Inactive' : 'Alive';
        debugMode.log(`PostsController: updated status to '${this.status}' by: ${JSON.stringify(user)}`);
        return res.status(200).json({'status': this.status});
    }

    async getPostById(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
        if (!user?.id) {
            return res.status(401).json({ message: 'User not found' });
        }

        const postId = parseInt(req.params.id);
        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        try {
            const post = await postsService.getById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const profile = await profileService.getProfileById(post.profileId);
            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }

            const enrichedPost = await formatPostWithCounts(post, user.id);

            return res.status(200).json({
                post: enrichedPost,
                profile
            });
        } catch (err) {
            console.error('Failed to get enriched post:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getPostsByParentId(req: Request, res: Response) {}
    async getPostsByUserId(req: Request, res: Response) {

        const user = await authService.fromRequest(req, res);
        debugMode.log('PostsController: ' + JSON.stringify(user));
        if(!user || !user.id) {
            return res.status(401).json({ message: 'User Not Found' });
        }
        const hasPermission = await permissionsService.hasPermission(user.id, Permissions.READ_OTHER);
        debugMode.log(`PostsController: hasPermission: ${JSON.stringify(hasPermission)}`);
        if(!hasPermission) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const profileId = parseInt(req.params.id);
        const offset = parseInt(req.query?.offset as string) || 0;
        const limit = parseInt(req.query?.limit as string) || 10;

        if(isNaN(profileId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }


        try {
            const rawPosts = await postsService.getPostsByProfileId(profileId, offset, limit);
            const posts: PostDTO[] = rawPosts.map((row) => ({
                id: row.id,
                profileId: row.profile_id,
                parentId: row.parent_id,
                content: row.content,
                mediaUrl: row.media_url,
                createdAt: row.created_at,
            }));

            const enriched = await Promise.all(posts.map(p => formatPostWithCounts(p, user.id)));
            return res.status(200).json({ posts: enriched });
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getPostReplies(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
        if (!user?.id) {
            return res.status(401).json({ message: 'User not found' });
        }

        const postId = parseInt(req.params.id);
        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        const offset = parseInt(req.query.offset as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            const enriched = await postsService.getRepliesByParentId(postId, user.id, offset, limit);
            res.status(200).json({ posts: enriched });
        } catch (err) {
            console.error('Failed to fetch replies:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getLatestPosts(req: Request, res: Response) {

        const user = await authMiddleware.checkUserPermission(req, res, Permissions.READ_POST);
        if (!user?.id) return res.status(401).json({ message: 'Unauthorized' });

        const offset = parseInt(req.query.offset as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        debugMode.log(`Offset: ${offset}, limit: ${limit}`);
        try {
            const posts = await postsService.getLatestEnrichedPosts(user.id!, offset, limit);
            debugMode.log(`Posts ${JSON.stringify(posts)}`);
            return res.status(200).json({ posts });
        } catch (err) {
            console.error('Error fetching posts:', err);
            res.status(500).json({ error: 'Failed to fetch posts' });
        }
    }
}

export const postsController = new PostsController();