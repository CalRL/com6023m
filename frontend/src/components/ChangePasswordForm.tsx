import {useState} from "react";
import axios from "../api/axios.ts";
import { useNavigate } from 'react-router-dom';

export default function ChangePasswordForm() {
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await axios.patch('/users/change-password', form, {
                withCredentials: true,
            });

            if (res.status === 200) {
                navigate('/logout');
            }

            setMessage(res.data.message);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Error updating password');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-md space-y-4 text-white"
        >
            <h2 className="text-2xl font-bold mb-2 text-center">
                🔒 Change Password
            </h2>

            <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium">Current Password</label>
                <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    className="w-full rounded bg-zinc-800 p-2 text-white"
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium">New Password</label>
                <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    className="w-full rounded bg-zinc-800 p-2 text-white"
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm New Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="w-full rounded bg-zinc-800 p-2 text-white"
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-medium py-2 rounded">
                Update Password
            </button>

            {message && <p className="text-sm text-center text-red-400">{message}</p>}
        </form>
    );
}