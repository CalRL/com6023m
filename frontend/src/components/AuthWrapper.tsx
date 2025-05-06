import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/auth';


const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuthStore();

    if (loading) return <div>Loading authentication...</div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <>{children}</>;
};

export default AuthWrapper;
