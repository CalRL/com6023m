import React from "react";

interface PostModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (content: string) => void;
    content: string;
    setContent: (content: string) => void;
}

const PostModal: React.FC<PostModalProps> = ({
                                                 open,
                                                 onClose,
                                                 onSubmit,
                                                 content,
                                                 setContent,
                                             }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-2 text-black dark:text-white">Create Post</h2>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full h-24 p-2 rounded border border-gray-400 text-black dark:text-white dark:bg-gray-900"
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-3 py-1 bg-gray-600 text-white rounded">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if(!content.trim()) return;
                            onSubmit(content)
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
