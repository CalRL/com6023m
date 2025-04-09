import React, { useEffect, useState } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useAuthStore from './store/auth';
import LoginForm from './components/LoginForm';
import AuthWrapper from './components/AuthWrapper';
import axios from "./api/axios.ts";


const App: React.FC = () => {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <div className="mx-auto flex">
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
