import PostFeed from "../components/posts/PostFeed.tsx";
import { useOutletContext } from "react-router-dom";
import { LayoutContext } from "../models/LayoutContext";

export default function HomePage() {
    const { setRefreshPostsCallback } = useOutletContext<LayoutContext>();

    return (
        <div>
            <div className="bg-gray-900 p-4 rounded box-border">
                What's Happening?
            </div>
            <PostFeed
                endpoint="/posts"
                queryParams={{}}
                attachRefresh={setRefreshPostsCallback}
                isProfileView={false}
                extractPosts={(res) => res.data.posts}
            />
        </div>
    );
}
