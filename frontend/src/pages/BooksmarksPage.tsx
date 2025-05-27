import { useEffect, useState } from 'react'
import axios from '../api/axios.js';
import {PostProps} from "../components/posts/PostProps.ts";
import {ProfileProps} from "../components/profile/ProfileProps.tsx";
import Post from "../components/posts/Post.tsx";
import {AxiosError} from "axios";

interface BookmarkEntry {
    post: PostProps;
    profile: ProfileProps;
}

export default function BookmarksPage() {
    const [posts, setPosts] = useState<BookmarkEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await axios.get('/bookmarks')
                setPosts(res.data.bookmarks)
            } catch (err) {
                const error = err as AxiosError<unknown>;
                const message = (error.response?.data as { message?: string })?.message || "";
                setError(message);
                console.error('Failed to load bookmarks:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchBookmarks()
    }, [])

    if (loading) return <div className="p-4 text-white">Loading bookmarks...</div>
    if (error) return <div className="p-4 text-red-400">{error}</div>
    if (posts.length === 0) return <div className="p-4 text-gray-400">No bookmarks yet.</div>

    return (
        <div className="space-y-4 p-4">
            {posts.map(({post, profile}) => (
                <Post key={post.id} post={post} profile={profile} />
            ))}
        </div>
    )
}