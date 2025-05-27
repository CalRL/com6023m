import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuthStore from '../store/auth';
import CenteredPage from "../pages/CenteredPage.tsx";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', { email, password }, { withCredentials: true });

            console.log(response);

            if (!response || !response.data) {
                throw new Error('No response from server');
            }

            const accessToken = response.data.accessToken;
            if (!accessToken) {
                throw new Error('Access token not received');
            }

            login(accessToken);


            navigate('/profile');
        } catch (error) {
            console.error(error);
            alert('Login failed. Please check your credentials.');
        }
    };
    const boxClass = "block w-full border-neutral-500 p-2 mb-4 border rounded light:text-white"
    return (
        <CenteredPage>
        <form onSubmit={handleLogin} className="p-4 bg-neutral-800 rounded-xl mt-8">
            <div className="mb-4 space-y-0 text-left ">
                <h2 className="text-2xl ">Sign in</h2>
                <div>or <a href="/register">create an account</a></div>
            </div>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={boxClass}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={boxClass}
                required
            />
            <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Login
            </button>
        </form>
        </CenteredPage>
    );
};

export default LoginForm;
