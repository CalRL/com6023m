import { useState, useEffect } from 'react';
import axios from '../api/axios.ts';
import useAuthStore from "../store/auth.ts";
import ChangePasswordForm from "./ChangePasswordForm.tsx";
import DeleteAccountSection from "./DeleteAccountSection.tsx";

export default function Settings() {
    const [fields, setFields] = useState({
        first_name: '',
        last_name: '',
        phone_ext: '',
        phone_number: '',
        birthday: ''
    });

    const currentUserId = useAuthStore(state => state.user?.id);

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const res = await axios.post(
                    `/users/${currentUserId}/fields`,
                    {
                        fields: {
                            first_name: true,
                            last_name: true,
                            birthday: true,
                            phone_ext: true,
                            phone_number: true,
                        }
                    },
                    { withCredentials: true }
                );

                if (res.data?.success && res.data.data) {
                    setFields(prev => ({ ...prev, ...res.data.data }));
                }
            } catch (err) {
                console.error('Failed to fetch user fields:', err);
            }
        };

        fetchFields();
    }, [currentUserId]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.patch(`/users/${currentUserId}/fields`, {
                fields
            }, { withCredentials: true });

            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        }
    };

    return (
        <div>
            <div className="min-h-screen flex flex-col items-center justify-center space-y-12 p-6 bg-black">
                <form
                    onSubmit={handleSubmit}
                    className="bg-zinc-900 p-6 rounded-2xl shadow-lg w-full max-w-md space-y-6"
                >
                    <h2 className="text-2xl font-bold mb-2 text-center">⚙️ Settings</h2>
                    {Object.entries(fields).map(([key, value]) => (
                        <div key={key}>
                            <label className="block text-sm font-medium capitalize mb-1">
                                {key.replace('_', ' ')}
                            </label>
                            <input
                                type="text"
                                name={key}
                                value={value}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition"
                    >
                        Save Changes
                    </button>
                </form>
                <ChangePasswordForm />
                <DeleteAccountSection />
            </div>

        </div>

    );
}
