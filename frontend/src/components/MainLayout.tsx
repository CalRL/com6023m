import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="flex h-screen w-screen dark:bg-black dark:text-white">
            {/* Left */}

            <aside className="w-1/5 p-4 border-r border-gray-800">
                <h1 className="text-black dark:text-white pb-8">React Vite App</h1>
                <div className="text-2xl space-y-8">
                    <div>🏠 Home</div>
                    <div>🔖 Bookmarks</div>
                    <div>👤 Profile</div>
                </div>

            </aside>

            {/* Middle */}
            <main className="flex-1 border-r border-gray-800 p-4 overflow-y-auto">
                <Outlet />
            </main>

            {/* Right */}
            <aside className="w-1/4 p-4 hidden lg:block">
                <div className="bg-gray-900 p-4 rounded">
                    <strong>Trending</strong>
                    <div>#Liverpool</div>
                </div>
            </aside>
        </div>
    )
}