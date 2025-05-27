import { useEffect, useRef, useState, useCallback } from "react";
import axios from "../../api/axios.ts";
import Post from "./Post.tsx";
import { ProfileProps } from "../profile/ProfileProps.js";
import { useOutletContext } from "react-router-dom";
import { LayoutContext } from "../../models/LayoutContext.js";
import useInfiniteScroll from "../../utils/useInfiniteScroll.js";

type PostFeedProps = {
    endpoint: string;
    extractPosts: (res: any) => any[];
    queryParams?: Record<string, any>;
    attachRefresh?: (cb: ()=> void) => void;
    isProfileView?: boolean;
    title?: string;
    renderHeader?: React.ReactNode;
    profile?: ProfileProps;
};

const limit = 10;

const PostFeed: React.FC<PostFeedProps> = ({
                                               endpoint,
                                               extractPosts,
                                               queryParams = {},
                                               isProfileView,
                                               title,
                                               renderHeader,
                                                profile,
                                           }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const { setRefreshPostsCallback } = useOutletContext<LayoutContext>();

    const buildUrl = () => {
        const url = new URL(endpoint, window.location.origin);
        url.searchParams.append("offset", offset.toString());
        url.searchParams.append("limit", limit.toString());
        for (const key in queryParams) {
            url.searchParams.append(key, queryParams[key]);
        }
        return url.pathname + url.search;
    };

    const fetchPosts = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const res = await axios.get(buildUrl());
            const newPosts = extractPosts(res);

            if (newPosts.length < limit) setHasMore(false);

            setPosts((prev) => [...prev, ...newPosts]);
            setOffset((prev) => prev + limit);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        } finally {
            setLoading(false);
        }
    }, [offset, hasMore, loading]);

    const refreshPosts = () => {
        setOffset(0);
        setHasMore(true);
        setPosts([]);
        setTimeout(() => fetchPosts(), 0);
    };

    useEffect(() => {
        setRefreshPostsCallback(() => refreshPosts);
    }, []);

    useEffect(() => {
        fetchPosts();
    }, []);

    useInfiniteScroll({
        callback: fetchPosts,
        hasMore,
        loading,
        observerRef,
    });

    return (
        <div className="space-y-6 mt-6">
            {renderHeader}
            {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
            {posts.length === 0 && !loading ? (
                <p className="text-gray-400">No posts available.</p>
            ) : (
                posts.map((entry, i) => {
                    if (!entry) return null;

                    // Case: standard view (post + profile pair)
                    if (entry.post && entry.profile) {
                        return (
                            <Post
                                key={entry.post.id || i}
                                post={entry.post}
                                profile={entry.profile}
                            />
                        );
                    }

                    // Case: isProfileView = true (profile is passed separately)
                    if (!entry.profile && isProfileView && profile) {
                        return (
                            <Post
                                key={entry.id || i}
                                post={entry}
                                profile={profile}
                            />
                        );
                    }

                    console.warn("Invalid post entry:", entry);
                    return null;
                })
            )}

            <div ref={observerRef} className="h-10" />
            {loading && <p className="text-gray-400">Loading more...</p>}
            {!hasMore && posts.length > 0 && (
                <p className="text-gray-400 text-center mt-4">You've reached the end!</p>
            )}
        </div>
    );
};

export default PostFeed;
