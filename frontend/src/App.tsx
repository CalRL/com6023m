import React, { useEffect } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useAuthStore from './store/auth';
import LoginForm from './components/LoginForm';
import AuthWrapper from './components/AuthWrapper';
import RegisterForm from "./components/RegisterForm.tsx";
import ProfileRouter from "./components/ProfileRouter.tsx";
import Logout from "./components/Logout.tsx";
import DarkModeDropdown from "./components/dropdowns/DarkModeDropdown.tsx";



const App: React.FC = () => {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <div className="min-h-screen bg-lightBg text-black dark:bg-[#171717] dark:text-white transition-colors duration-300">
            <Router>
            <div className="mx-auto flex text-white dark:text-slate-600">

                    <div>
                        <h1 className="text-green-400 dark:text-orange-400">React Vite App</h1>
                        <Routes>
                            <Route path="/" element={<LoginForm />} />
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route
                                path="/profile/:id?"
                                element={
                                    <AuthWrapper>
                                        <ProfileRouter />
                                    </AuthWrapper>
                                }
                            />
                        </Routes>
                    </div>

                <div className="block">
                    <DarkModeDropdown />
                </div>
            </div>
            </Router>
        </div>
    );
};

export default App;
