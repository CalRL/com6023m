import {Link, Outlet} from 'react-router-dom';
import {useState} from "react";
import {FaPlusCircle} from "react-icons/fa";
import PostModal from "./modal/PostModal.js";
import axios from "../api/axios.js";
import RandomFact from "./RandomFact.tsx";
import HackerNews from "./HackerNews.tsx";

export default function MainLayout() {
    const [postModalOpen, setPostModalOpen] = useState(false);
    const [content, setContent] = useState("");
    const [refreshPostsCallback, setRefreshPostsCallback] = useState<(() => void) | null>(null);
    const [refreshRepliesCallback, setRefreshRepliesCallback] = useState<(() => void) | null>(null);

    const handlePost = async (text: string) => {
        if (!text.trim()) return;

        try {
            await axios.post("/posts", {
                post: {
                    content: text
                }
            }, { withCredentials: true });
            setContent("");
            setPostModalOpen(false);
            if (refreshPostsCallback) refreshPostsCallback();
        } catch (err) {
            console.error("Failed to create post:", err);
        }
    };

    return (
        <div className="flex h-screen w-screen dark:bg-black dark:text-white">
            {/* Left */}

            <aside className="w-1/5 p-4 border-r border-gray-800">
                <h1 className="text-black dark:text-white pb-8">PostR</h1>
                <nav className="space-y-4 text-2xl">
                    <Link to="/" className="block p-2 rounded hover:bg-gray-700 transition">🏠 Home</Link>
                    <Link to="/bookmarks" className="block p-2 rounded hover:bg-gray-700 transition">🔖 Bookmarks</Link>
                    <Link to="/profile" className="block p-2 rounded hover:bg-gray-700 transition">👤 Profile</Link>
                    <Link to={"/settings"} className="block p-2 rounded hover:bg-gray-700 transition">⚙️ User Settings</Link>
                    <Link to="/admin" className="block p-2 rounded hover:bg-gray-700 transition">🔧 Admin</Link>

                    <button
                        onClick={() => setPostModalOpen(true)}
                        className="w-full flex items-center gap-2 p-2 rounded text-indigo-400 hover:bg-gray-700 transition text-2xl text-left"
                    >
                        <FaPlusCircle />
                        New Post
                    </button>
                </nav>

            </aside>

            {/* Middle */}
            <main className="flex-1 border-r border-gray-800 p-4 overflow-y-auto h-full">
                <Outlet context={{
                    setRefreshPostsCallback,
                    refreshPostsCallback,
                    setRefreshRepliesCallback,
                    refreshRepliesCallback
                }} />
            </main>

            {/* Right */}
            <aside className="w-1/4 p-4 hidden lg:block space-y-4">

                { <RandomFact /> }
                { <HackerNews /> }

            </aside>
            <PostModal
                open={postModalOpen}
                onClose={() => setPostModalOpen(false)}
                onSubmit={handlePost}
                content={content}
                setContent={setContent}
            />
        </div>
    )
}