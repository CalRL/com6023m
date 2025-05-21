import React, { useEffect, useState } from "react";
import axios from "../api/axios.ts";
import { ProfileModel } from "../models/ProfileModel.js";
import { useParams } from "react-router-dom";

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [profile, setProfile] = useState<ProfileModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [username, setUsername] = useState("");
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const endpoint = id ? `/profile/${id}` : `/profile`;
                const response = await axios.get(endpoint, { withCredentials: true });
                setProfile(response.data.profile);
                const username = await axios.get(`/profile/${response.data.profile.id}/username`, { withCredentials: true })
                setUsername(username.data.username);
                setLoading(false);
            } catch (err) {
                setError((err as Error).message);
                setLoading(false);
                
                setPosts([])
                posts.keys();
            }
        };

        getProfile();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-col">
            {/* Banner */}
            <div
                className="h-40 w-full rounded-t-lg bg-cover bg-center"
                style={{
                    backgroundImage: `url(${profile?.cover_image_url || "https://placehold.co/1200x160?text=No+Cover"})`
                }}
            />

            {/* Profile Info */}
            <div className="flex items-center gap-4 mt-12 px-6">
                <img
                    src={profile?.avatar_url || "https://placehold.co/96x96"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-black"
                />
                <div>
                    <h2 className="text-xl font-bold">{profile?.display_name}</h2>
                    <div>{username}</div>
                    {profile?.bio && <p className="text-gray-400">{profile.bio}</p>}
                    {profile?.website && (
                        <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                        >
                            {profile.website}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
