import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuthStore from '../store/auth';
import CenteredPage from "../pages/CenteredPage.tsx";

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

    const validateFields = (usernameToCheck = username, emailToCheck = email, passwordToCheck = password) => {
        const newErrors: typeof errors = {};

        if (!/^[a-zA-Z0-9_]{3,20}$/.test(usernameToCheck) && username.length > 0) {
            newErrors.username = 'Username must be 3-20 characters, letters/numbers/underscores only.';
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailToCheck) && emailToCheck.length > 0) {
            newErrors.email = 'Invalid email address.';
        }

        if (passwordToCheck.length < 6 && passwordToCheck.length != 0) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }

        setErrors(newErrors);
        console.log(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        validateFields(e.target.value, email, password);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        validateFields(username, e.target.value, password);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        validateFields(username, email, e.target.value);
    };


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) {
            return;
        }

        try {
            console.log("Attempting to register");
            const JSON = {
                email: email,
                username: username,
                password: password,
            }
            const response = await axios.post('/auth/register', JSON, { withCredentials: true });

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
    const boxClass = "block w-full border-neutral-500 p-2 mb-4 border rounded"
    return (
        <CenteredPage>
        <form onSubmit={handleRegister} className="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-xl mt-8">
    <div className="mb-4 space-y-0 text-left">
    <h2 className="text-2xl ">Sign up</h2>
        <div>or <a href="/login">log in</a></div>
    </div>

        <input
            type="username"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className={boxClass}
            required
        />
        {errors.username && <div className="text-red-500 text-sm mb-2">{errors.username}</div>}

        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        className={boxClass}
        required
        />
        {errors.email && <div className="text-red-500 text-sm mb-2">{errors.email}</div>}

        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        className={boxClass}
        required
        />
        {errors.password && <div className="text-red-500 text-sm mb-2">{errors.password}</div>}

        <button
            type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={Object.keys(errors).length > 0}
        >
        Register
        </button>
    </form>
        </CenteredPage>
);
};

export default RegisterForm;
