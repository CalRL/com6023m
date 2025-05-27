import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import Profile from './Profile';

const ProfileRouter: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const [selfId, setSelfId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || id === 'undefined') {
            setLoading(true);
            axios.get('/auth/check', { withCredentials: true })
                .then(res => {
                    setSelfId(res.data.id.toString());
                })
                .catch(err => {
                    console.error("Failed to fetch self ID", err);
                    setError("Failed to fetch your profile");
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (id && id !== 'undefined') {
        return <Profile />;
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (selfId) return <Profile />;

    return null; // or fallback UI
};

export default ProfileRouter;
