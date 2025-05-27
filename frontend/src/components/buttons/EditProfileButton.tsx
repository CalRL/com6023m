import { FaPen } from "react-icons/fa6";

interface EditProfileButtonProps {
    setEditModalOpen: (open: boolean) => void;
}

export default function EditProfileButton({ setEditModalOpen }: EditProfileButtonProps) {
    return (
        <div className="ml-auto">
            <button
                onClick={() => setEditModalOpen(true)}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-600"
                aria-label="Edit Profile"
            >
                <FaPen />
                Edit Profile
            </button>
        </div>
    );
}