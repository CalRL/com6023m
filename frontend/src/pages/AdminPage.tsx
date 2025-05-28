import { useEffect, useState } from 'react';
import axios from '../api/axios.ts';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function AdminPage() {
    const [metrics, setMetrics] = useState<null | {
        totalUsers: number;
        usersToday: number;
        likesToday: number;
        bookmarksToday: number;
        likesPerHour: { hour: number; count: number }[];
        bookmarksPerHour: { hour: number; count: number }[];
        likeTimestamps: string[];
        bookmarkTimestamps: string[];

    }>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();



    useEffect(() => {
        axios.get('/admin/metrics', { withCredentials: true })
            .then(res => {
                setMetrics(res.data);
                setLoading(false);
            })
            .catch(err => {
                if (err.response?.status === 403) {
                    navigate('/'); // not an admin, redirect away
                } else {
                    console.error(err);
                }
            });
    }, []);

    if (loading || !metrics) return <p>Loading...</p>;

    const likeTimeData = metrics.likeTimestamps.map((ts, i) => ({
        time: new Date(ts).toLocaleTimeString(),
        count: i + 1
    }));

    const bookmarkTimeData = metrics.bookmarkTimestamps.map((ts, i) => ({
        time: new Date(ts).toLocaleTimeString(),
        count: i + 1
    }));

    console.log(JSON.stringify(metrics));
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">⚙️ Admin Dashboard</h1>
            <ul className="space-y-2">
                <li>Total Users: {metrics.totalUsers}</li>
                <li>Users Joined Today: {metrics.usersToday}</li>
                <li>Likes Today: {metrics.likesToday}</li>
                <li>Bookmarks Today: {metrics.bookmarksToday}</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2">Likes Per Hour (Today)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.likesPerHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" label={{ value: "Hour", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Likes", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>

            <h2 className="text-xl font-semibold mt-8 mb-2">Bookmarks Per Hour (Today)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.bookmarksPerHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" label={{ value: "Hour", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Bookmarks", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>

            <h2 className="text-xl font-semibold mt-8 mb-2">Like Times (Today)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={likeTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis label={{ value: 'Likes', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>

            <h2 className="text-xl font-semibold mt-8 mb-2">Bookmark Times (Today)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bookmarkTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis label={{ value: 'Bookmarks', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>

        </div>
    );
}
