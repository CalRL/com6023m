import React, { useEffect, useState } from "react";
import axios from "../api/axios.ts";
import { useParams } from "react-router-dom";
import getDate from "../utils/Date.ts";
import {FaCalendarAlt, FaGlobe, FaLink} from "react-icons/fa";
import ProfilePosts from "./posts/ProfilePosts.tsx";
import {ProfileProps} from "./profile/ProfileProps.tsx";
import EditProfileButton from "./buttons/EditProfileButton.tsx";
import {EditProfileModal} from "./modal/EditProfileModal.tsx";
import {AxiosError} from "axios";

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [profile, setProfile] = useState<ProfileProps | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const endpoint = id ? `/profile/${id}` : `/profile`;
                const response = await axios.get(endpoint, { withCredentials: true });
                setProfile(response.data.profile);

                 setLoading(false);
            } catch (err) {
                const error = err as AxiosError<unknown>;
                const message = (error.response?.data as { message?: string })?.message;
                if (error.response?.status === 401 && message?.toLowerCase().includes("private")) {
                    setError(message);
                } else {
                    setError("Failed to load profile.");
                }
                setLoading(false);

                setPosts([])
                posts.keys();
            }
        };

        getProfile();
    }, [id]);

    const handleProfileUpdate = (updatedProfile: ProfileProps) => {
        console.log("Profile update received:", updatedProfile);
        setProfile(updatedProfile);
        setRefreshKey(prev => prev + 1);
        setEditModalOpen(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
        <div className="flex flex-col pb-6 border-b border-slate-400">


            {/* Banner */}
            <div
                className="h-40 w-full px-6 rounded-t-lg bg-cover bg-center"
                style={{
                    backgroundImage: `url(${profile?.coverImageUrl || "https://placehold.co/1200x160?text=No+Cover"})`
                }}
            />
        <div className="mt-12 ">
            {/* Profile Info */}
            <div className="flex items-center gap-4 ">
                <img
                    src={profile?.avatarUrl || "https://placehold.co/96x96"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-black"
                />
                <div>
                    <h2 className="text-xl font-bold">{profile?.displayName}</h2>
                    <div>{profile?.username}</div>
                    {<p className="text-gray-400">{profile?.bio || "No bio provided"}</p>}

                </div>

                {<div className="ml-auto">
                    <EditProfileButton setEditModalOpen={setEditModalOpen} />
                </div>}
            </div>
            <div className="flex">
                <div className="flex items-center space-x-2 px-2 mt-4">
                    <FaCalendarAlt />
                    <span>{`Joined ${getDate(profile?.joinedAt || "")}`}</span>
                </div>
                { hasLink(profile) &&
                    <div className="flex items-center space-x-2 px-2 mt-4">
                        <FaLink />
                        <a rel="noopener noreferrer" target="_blank" href={`https://${profile?.website}`}>{`${profile?.website}`}</a>
                    </div>
                }

                {hasLocation(profile) &&
                <div className="flex items-center space-x-2 px-2 mt-4">
                    <FaGlobe />
                    <span>{`${profile?.location}`}</span>
                </div>
                }

                </div>
            </div>


        </div>
            <div className="px-6 pt-6">
                {profile && <ProfilePosts key={refreshKey} profile={profile} />}
        </div>
            {profile && (
                <EditProfileModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    profile={profile}
                    onUpdate={handleProfileUpdate}
                />
            )}
    </div>
    );
};



export default Profile;

function hasLink(profile: ProfileProps | null): boolean {
    return !!profile?.website?.trim();
}

function hasLocation(profile: ProfileProps | null): boolean {
    return !!profile?.location?.trim();
}