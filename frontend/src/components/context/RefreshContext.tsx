import React, { createContext, useState, useContext } from "react";

const RefreshContext = createContext({
    refreshKey: 0,
    triggerRefresh: () => {},
});

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const triggerRefresh = () => {
        console.log("Refreshing")
        setRefreshKey((k) => k + 1);
    }

    return (
        <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => useContext(RefreshContext);
