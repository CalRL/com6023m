import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuthStore from './store/auth';
import LoginForm from './components/LoginForm';
import AuthWrapper from './components/AuthWrapper';

const Profile: React.FC = () => {
    const { user } = useAuthStore();
    return <div>Welcome, {user?.email || 'Guest'}!</div>;
};

const App: React.FC = () => {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <div>
            <div>hi</div>
            <Router>
                <div>
                    <h1>React Vite App</h1>
                    <Routes>
                        <Route path="/" element={<LoginForm />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route
                            path="/profile"
                            element={
                                <AuthWrapper>
                                    <Profile />
                                </AuthWrapper>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </div>

    );
};

export default App;
