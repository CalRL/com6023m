export default function ProfilePage() {
    return (
        <div className="flex flex-col">
            {/* Banner */}
            <div className="h-40 bg-gradient-to-r from-purple-700 to-pink-500 w-full rounded-t-lg" />

            {/* Profile Info */}
            <div className="flex items-center gap-4 -mt-12 px-6">
                {/* Avatar */}
                <img
                    src="https://via.placeholder.com/96"
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-black"
                />

                {/* Display Name */}
                <div>
                    <h2 className="text-xl font-bold">Display Name</h2>
                    <p className="text-gray-400">@username</p>
                </div>
            </div>
        </div>
    );
}
