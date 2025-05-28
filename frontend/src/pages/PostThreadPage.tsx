import { useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import { PostProps } from "../components/posts/PostProps.ts";
import { ProfileProps } from "../components/profile/ProfileProps.tsx";
import Post from "../components/posts/Post.tsx";
import PostFeed from "../components/posts/PostFeed.tsx";

interface EnrichedPost {
    post: PostProps;
    profile: ProfileProps;
}

interface LayoutContext {
    setRefreshRepliesCallback: (cb: () => void) => void;
    refreshRepliesCallback: () => void;
}

const PostThreadPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const { setRefreshRepliesCallback, refreshRepliesCallback } = useOutletContext<LayoutContext>();

    const [mainPost, setMainPost] = useState<EnrichedPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMainPost = async () => {
            const postRes = await axios.get(`/posts/${postId}`, { withCredentials: true });
            const profileRes = await axios.get(`/profile/${postRes.data.post.profileId}`, { withCredentials: true });

            setMainPost({
                post: postRes.data.post,
                profile: profileRes.data.profile,
            });
            setLoading(false);
        };

        fetchMainPost();
    }, [postId]);

    if (loading) return <div>Loading...</div>;
    if (!mainPost) return <div>Post not found</div>;

    return (
        <div className="p-4 space-y-6">
            <Post
                post={mainPost.post}
                profile={mainPost.profile}
                onReplySuccess={refreshRepliesCallback}
            />

            <h3 className="text-lg font-semibold text-white">Replies</h3>
            <PostFeed
                endpoint={`/posts/${postId}/replies`}
                queryParams={{}}
                attachRefresh={setRefreshRepliesCallback}
                isProfileView={false}
                extractPosts={(res) => res.data.posts}
            />
        </div>
    );
};

export default PostThreadPage;
