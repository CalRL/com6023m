import React, { useEffect } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuthStore from './store/auth';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Logout from './components/Logout';
import AuthWrapper from './components/AuthWrapper';

import ProfileRouter from './components/ProfileRouter';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';

import BookmarksPage from "./pages/BooksmarksPage";

const App: React.FC = () => {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <div className="min-h-screen w-screen bg-lightBg text-black dark:bg-[#171717] dark:text-white transition-colors duration-300">
            <Router>
                <div className="mx-auto flex text-white dark:text-slate-600">
                    <div>
                        <Routes>
                            {/* Public */}
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
                            <Route path="/logout" element={<Logout />} />

                            {/* Redirect root to /home */}
                            <Route path="/" element={<Navigate to="/home" replace />} />

                            {/* Authenticated layout for all main content */}
                            <Route
                                element={
                                    <AuthWrapper>
                                        <MainLayout />
                                    </AuthWrapper>
                                }
                            >
                                <Route path="/home" element={<HomePage />} />
                                <Route path="/bookmarks" element={<BookmarksPage />} />
                                <Route path="/profile/:id?" element={<ProfileRouter />} />
                            </Route>
                        </Routes>
                    </div>

                    {/*

                    <div className="block">
                        <DarkModeDropdown />
                    </div>

                    */}

                </div>
            </Router>
        </div>
    );
};

export default App;
