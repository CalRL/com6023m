import {PostDTO} from "../models/PostModel.js";
import database from "../config/database.js";
import {debugMode} from "../utils/DebugMode.js";

class PostsService {
    async create(post: PostDTO) {
        const result = await database<PostDTO[]>`
          INSERT INTO posts (
            profile_id, 
            parent_id, 
            content, 
            created_at
          )
          VALUES (
            ${post.profileId}, 
            ${post.parentId ?? null}, 
            ${post.content}, 
            NOW()
          )
          RETURNING *;
        `;

        const postDTO = result[0] as PostDTO;
        if(!postDTO) {
            debugMode.warn("Couldn't create post...");
        }
        return postDTO;
    }

    async getById(id: number) {
        const result = await database`
        SELECT * FROM posts WHERE id = ${id}
        `
        const postDTO = result[0] as PostDTO;
        if(!postDTO) {
            debugMode.warn("Couldn't get post...");
        }
        return postDTO;
    }
    async deleteById(id: number) {
        const result = await database`
        DELETE FROM posts WHERE id = ${id}
        `;
        if (result.count === 0) {
            debugMode.warn("Couldn't delete post...");
        }
        return result.count > 0;
    }

    async getAllByProfileId(profileId: number) {}
    async deleteAllByProfileId(profileId: number) {}

}

const postsService = new PostsService();
export default postsService;