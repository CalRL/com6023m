import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/auth';

interface AuthWrapperProps {
    children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the wrapped children
    return <>{children}</>;
};

export default AuthWrapper;
