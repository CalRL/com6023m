import React from "react";

interface ReplyModalProps {
    username: string;
    open: boolean;
    onClose: () => void;
    onSubmit: (content: string) => void;
    content: string;
    setContent: (content: string) => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({
                                                   username,
                                                   open,
                                                   onClose,
                                                   onSubmit,
                                                   content,
                                                   setContent
                                               }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg w-full max-w-md shadow-lg">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    Reply to @{username}
                </h3>
                <textarea
                    className="w-full h-24 p-2 rounded border border-gray-400 text-black dark:text-white dark:bg-gray-800"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your reply..."
                />
                <div className="flex justify-end space-x-2 mt-2">
                    <button
                        onClick={() => {
                            onClose();
                            console.log("closing")
                        }}
                        className="px-3 py-1 text-sm bg-gray-600 rounded text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (!content.trim()) return;
                            onSubmit(content);
                        }}
                        className="px-3 py-1 text-sm bg-blue-600 rounded text-white"
                    >
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReplyModal;
