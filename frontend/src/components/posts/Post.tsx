import {useState} from "react";
import axios from "../../api/axios";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import {FaRegBookmark, FaBookmark, FaComment} from "react-icons/fa6";
import { PostProps } from "./PostProps.ts";
import { ProfileProps } from "../profile/ProfileProps.tsx";
import ReplyModal from "../modal/ReplyModal.tsx";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth.ts";

interface PostComponentProps {
    post: PostProps;
    profile: ProfileProps;
    onReplySuccess?: () => void;
}

const Post: React.FC<PostComponentProps> = ({ post, profile, onReplySuccess }) => {
    const [isLiked, setLiked] = useState(post.liked ?? false);
    const [isBookmarked, setBookmarked] = useState(post.bookmarked ?? false);
    const [likes, setLikes] = useState(post.likeCount ?? 0);
    const [bookmarks, setBookmarks] = useState(post.bookmarkCount ?? 0);
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const currentUserId = useAuthStore(state => state.user?.id);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await axios.delete(`/posts/${post.id}`, { withCredentials: true });
            window.location.reload();
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
    };

    const toggleLike = async () => {
        try {
            if (isLiked) {
                await axios.delete(`/likes/${post.id}`, { withCredentials: true });
                setLikes(prev => prev - 1);
            } else {
                await axios.post(`/likes/${post.id}`, { withCredentials: true });
                setLikes(prev => prev + 1);
            }
            setLiked(!isLiked);
        } catch (err) {
            console.error("Like error:", err);
        }
    };

    const toggleBookmark = async () => {
        try {
            if (isBookmarked) {
                await axios.delete(`/bookmarks/${post.id}`);
                setBookmarks(prev => prev - 1);
            } else {
                await axios.post(`/bookmarks/${post.id}`);
                setBookmarks(prev => prev + 1);
            }
            setBookmarked(!isBookmarked);
        } catch (err) {
            console.error("Bookmark error:", err);
        }
    };

    const handleReplySubmit = async (content: string) => {
        if (!content.trim()) return;

        try {
            await axios.post(
                "/posts",
                {
                    post: {
                        content,
                        parentId: post.id
                    }
                },
                { withCredentials: true }
            );
            setReplyContent("");
            setReplyOpen(false);
            onReplySuccess?.();
        } catch (err) {
            console.error("Failed to post reply:", err);
        }
    };

    const navigate = useNavigate();
    const handlePostClick = () => {
        navigate(`/posts/${post.id}`);
    };

    return (

            <div className="flex space-x-4 border-b border-slate-700 p-4"
            onClick={handlePostClick}>
                <img
                    src={profile.avatarUrl || "https://placehold.co/48x48"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent post navigation
                        navigate(`/profile/${profile.id}`);
                    }}
                />

                <div className="flex-1">
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="font-bold text-white">{profile.displayName}</span>
                        <span className="text-gray-400">@{profile.username}</span>
                        <span className="text-gray-500">· {new Date(post.createdAt).toLocaleString()}</span>
                    </div>

                    <p className="text-white mt-2">{post.content}</p>

                    {post.mediaUrl && (
                        <img
                            src={post.mediaUrl}
                            alt="Post media"
                            className="mt-2 rounded-lg max-w-full max-h-96 object-cover"
                        />
                    )}

                    <div className="flex space-x-4 mt-3 text-sm text-gray-400">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleLike();
                            }}
                            className="flex items-center space-x-1 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-sm text-gray-300"
                        >
                            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                            <span>{likes}</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark();
                            }}
                            className="flex items-center space-x-1 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-sm text-gray-300"
                        >
                            {isBookmarked ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
                            <span>{bookmarks}</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setReplyOpen(true)
                            }}
                            className="flex items-center space-x-1 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-sm text-gray-300"
                        >
                            <FaComment className="text-blue-400" />
                        </button>

                        {(() => {
                            console.log("post ", JSON.stringify(profile));
                            console.log("post.profileId:", profile.id);
                            console.log("currentUserId:", currentUserId);

                            if (profile.id === currentUserId) {
                                return (
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center space-x-1 px-3 py-1 rounded bg-red-800 hover:bg-red-700 text-sm text-white"
                                    >
                                        <span>Delete</span>
                                    </button>
                                );
                            }

                            return null;
                        })()}

                        <ReplyModal
                            open={replyOpen}
                            onClose={() => setReplyOpen(false)}
                            onSubmit={handleReplySubmit}
                            username={profile.username}
                            content={replyContent}
                            setContent={setReplyContent}
                        />
                    </div>
                </div>
            </div>


    );
};

export default Post;
