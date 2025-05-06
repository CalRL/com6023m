import {useEffect, useState} from "react";
import {ProfileModel} from "../models/ProfileModel.ts";
import axios from "../api/axios.ts";

interface Props {
    id: string;
}

const UserProfile: React.FC<Props> = ({ id }) => {
    const [profile, setProfile] = useState<ProfileModel | null>(null);

    useEffect(() => {
        const response = axios.get(`/profile/${id}`, { withCredentials: true }).then((res) => {
            setProfile(res.data);
        });
        console.log(JSON.stringify(response));
    }, [id]);

    return (
        <div>
            <h1>Viewing {profile?.display_name}'s profile</h1>
        </div>
    );
};

export default UserProfile;