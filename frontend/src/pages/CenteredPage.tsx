import React from "react";

const CenteredPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen w-screen flex items-center justify-center 00 px-4">
        <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
);

export default CenteredPage;
