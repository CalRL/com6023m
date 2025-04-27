import {PostDTO} from "../models/PostModel.js";
import database from "../config/database.js";
import {debugMode} from "../utils/DebugMode.js";

class PostsService {
    async create(post: PostDTO) {
        const result = await database<PostDTO[]>`
          INSERT INTO posts (
            user_id, 
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

    async getById(id: number) {}
    async deleteById(id: number) {}
    async getAllByProfileId(profileId: number) {}
    async deleteAllByProfileId(profileId: number) {}

}