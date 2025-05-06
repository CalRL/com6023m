import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from './Profile';
import UserProfile from './UserProfile';

const ProfileRouter: React.FC = () => {
    const { id } = useParams<{ id?: string }>();

    if (!id || id === 'undefined') {
        return <Profile />; // current user's profile
    } else {
        return <UserProfile id={id} />;
    }
};

export default ProfileRouter;