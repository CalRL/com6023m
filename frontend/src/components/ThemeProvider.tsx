import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
    theme: Theme;
    setTheme: (t: Theme) => void;
}>({
    theme: 'system',
    setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('theme') as Theme) || 'system';
    });

    useEffect(() => {
        const root = document.documentElement;
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const applyTheme = (t: Theme) => {
            if (t === 'dark') root.classList.add('dark');
            else if (t === 'light') root.classList.remove('dark');
            else root.classList.toggle('dark', systemDark);
        };

        applyTheme(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);