import React, {useEffect, useState} from "react";
import axios from "../api/axios.ts";
import { ProfileModel } from "../models/ProfileModel.js"


const Profile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileModel | null>(null);  // To store the profile data
    const [loading, setLoading] = useState<boolean>(true);  // To track the loading state
    const [error, setError] = useState<string | null>(null);  // To track errors

    useEffect(() => {
        // Define the async function inside useEffect
        const getProfile = async () => {
            try {
                const response = await axios.get("/profile", { withCredentials: true });
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                setError((err as Error).message);
                setLoading(false);
            }
        };

        getProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;  // Show loading indicator while data is being fetched
    }

    if (error) {
        return <div>{error}</div>;  // Display error message if the request failed
    }

    return (
        <div>
            <h1>Welcome, {profile?.display_name}!</h1>
        </div>
    );
};

export default Profile;