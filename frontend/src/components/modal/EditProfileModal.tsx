import React, { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import {ProfileProps} from "../profile/ProfileProps.tsx";

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    profile: ProfileProps;
    onUpdate: (updatedProfile: ProfileProps) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
                                                               open,
                                                               onClose,
                                                               profile,
                                                               onUpdate,
                                                           }) => {
    const [displayName, setDisplayName] = useState(profile.displayName);
    const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
    const [bio, setBio] = useState(profile.bio ?? "");
    const [location, setLocation] = useState(profile.location ?? "");
    const [website, setWebsite] = useState(profile.website ?? "");
    const [isPrivate, setIsPrivate] = useState(profile.isPrivate ?? false);
    const [loading, setLoading] = useState(false);
    const [coverImageUrl, setCoverImageUrl] = useState("");

    useEffect(() => {
        if (open) {
            setDisplayName(profile.displayName);
            setAvatarUrl(profile.avatarUrl ?? "");
            setBio(profile.bio ?? "");
            setLocation(profile.location ?? "");
            setWebsite(profile.website ?? "");
            setIsPrivate(profile.isPrivate ?? false);
            setCoverImageUrl(profile.avatarUrl ?? "");
        }
    }, [open, profile]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedProfileData = {
                displayName,
                avatarUrl,
                bio,
                location,
                website,
                isPrivate,
                coverImageUrl
            };

            const res = await axios.put("/profile", updatedProfileData, {
                withCredentials: true,
            });

            if (onUpdate) {
                onUpdate(res.data.updatedProfile);
            }

            onClose();
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Edit Profile</h2>

                <label className="block mb-2 text-black dark:text-white">
                    Display Name
                    <input
                        type="text"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        className="w-full p-2 border rounded mt-1 dark:bg-gray-900 dark:text-white"
                    />
                </label>

                <label className="block mb-2 text-black dark:text-white">
                    Avatar URL
                    <input
                        type="text"
                        value={avatarUrl}
                        onChange={e => setAvatarUrl(e.target.value)}
                        className="w-full p-2 border rounded mt-1 dark:bg-gray-900 dark:text-white"
                    />
                </label>

                <label className="block mb-2 text-black dark:text-white">
                    Cover Image URL
                    <input
                        type="text"
                        value={coverImageUrl}
                        onChange={e => setCoverImageUrl(e.target.value)}
                        className="w-full p-2 border rounded mt-1 dark:bg-gray-900 dark:text-white"
                    />
                </label>

                <label className="block mb-2 text-black dark:text-white">
                    Bio
                    <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={3}
                        className="w-full p-2 border rounded mt-1 dark:bg-gray-900 dark:text-white"
                    />
                </label>

                <label className="block mb-2 text-black dark:text-white">
                    Location
                    <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full p-2 border rounded mt-1 dark:bg-gray-900 dark:text-white"
                    />
                </label>

                <label className="block mb-2 text-black dark:text-white">
                    Website
                    <input
                        type="url"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                        className="w-full p-2 border rounded mt-1 dark:bg-gray-900 dark:text-white"
                    />
                </label>

                <label className="block mb-4 text-black dark:text-white flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={() => setIsPrivate(!isPrivate)}
                    />
                    Private Profile
                </label>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 rounded bg-blue-600 text-white"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );

};
