import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import {PostProps} from "../components/posts/PostProps.ts";
import {ProfileProps} from "../components/profile/ProfileProps.tsx";
import Post from "../components/posts/Post.tsx";

interface EnrichedPost {
    post: PostProps;
    profile: ProfileProps;
}

const PostThreadPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [mainPost, setMainPost] = useState<EnrichedPost | null>(null);
    const [replies, setReplies] = useState<EnrichedPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!postId) return;

        const fetchPostThread = async () => {
            try {
                const postRes = await axios.get(`/posts/${postId}`, { withCredentials: true });
                const postData = postRes.data.post;

                // fetch profile by profileId
                const profileRes = await axios.get(`/profile/${postData.profileId}`, { withCredentials: true });
                const profileData = profileRes.data.profile;

                setMainPost({
                    post: postData,
                    profile: profileData
                });

                const replyRes = await axios.get(`/posts/${postId}/replies`, { withCredentials: true });
                setReplies(replyRes.data.posts ?? []);
            } catch (err) {
                console.error("Failed to load post thread", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPostThread();
    }, [postId]);

    if (loading) return <div className="p-4 text-white">Loading...</div>;
    if (!mainPost) return <div className="p-4 text-red-400">Post not found.</div>;

    return (
        <div className="p-4 space-y-6">
            <Post post={mainPost.post} profile={mainPost.profile} />

            <h3 className="text-lg font-semibold text-white">Replies</h3>
            {replies.length === 0 ? (
                <div className="text-gray-400">No replies yet.</div>
            ) : (
                replies.map(({ post, profile }) => (
                    <Post key={post.id} post={post} profile={profile} />
                ))
            )}
        </div>
    );
};

export default PostThreadPage;

