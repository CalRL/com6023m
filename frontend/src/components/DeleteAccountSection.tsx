import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function DeleteAccountSection() {
    const [confirming, setConfirming] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.delete('/users', { withCredentials: true });
            setMessage('Account deleted successfully.');
            setTimeout(() => navigate('/logout'), 1500);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to delete account');
        }
    };

    return (
        <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-md text-white space-y-4">
            <h2 className="text-lg font-semibold">Danger Zone</h2>
            {!confirming ? (
                <button
                    onClick={() => setConfirming(true)}
                    className="bg-red-700 hover:bg-red-600 w-full py-2 rounded"
                >
                    Delete My Account
                </button>
            ) : (
                <>
                    <p>Are you sure? This action cannot be undone.</p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleDelete}
                            className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded"
                        >
                            Yes, delete
                        </button>
                        <button
                            onClick={() => setConfirming(false)}
                            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}
            {message && <p className="text-sm text-red-400">{message}</p>}
        </div>
    );
}
