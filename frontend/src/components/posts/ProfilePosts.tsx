import PostFeed from "./PostFeed";
import { useOutletContext } from "react-router-dom";
import { LayoutContext } from "../../models/LayoutContext";
import { Profile } from "../profile/ProfileProps";

const ProfilePosts: React.FC<Profile> = ({ profile }) => {
    const { setRefreshPostsCallback } = useOutletContext<LayoutContext>();

    return (
        <div className="space-y-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Posts</h2>
            <PostFeed
                endpoint={`/posts/profile/${profile.id}`}
                queryParams={{}}
                attachRefresh={setRefreshPostsCallback}
                isProfileView={true}
                profile={profile}
                extractPosts={(res) => res.data.posts}
            />
        </div>
    );
};

export default ProfilePosts;
