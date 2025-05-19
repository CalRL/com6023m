import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export default function DarkModeDropdown() {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem('theme') as Theme;
        console.log('[INIT] Loaded theme from localStorage:', stored);
        return stored || 'system';
    });

    useEffect(() => {
        const root = document.documentElement;
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = (mode: Theme) => {
            console.log('[APPLY] Applying theme:', mode);

            // 🔧 Force reset before applying new mode
            root.classList.remove('dark');

            if (mode === 'dark') {
                root.classList.add('dark');
            } else if (mode === 'system') {
                if (darkQuery.matches) {
                    root.classList.add('dark');
                }
            }

            localStorage.setItem('theme', mode);
        };

        applyTheme(theme);

        const handleSystemChange = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                if (e.matches) root.classList.add('dark');
                else root.classList.remove('dark');
            }
        };

        darkQuery.addEventListener('change', handleSystemChange);
        return () => darkQuery.removeEventListener('change', handleSystemChange);
    }, [theme]);

    return (
        <select
            value={theme}
            onChange={(e) => {
                const newTheme = e.target.value as Theme;
                console.log('[UI] Theme selected:', newTheme);
                setTheme(newTheme);
            }}
            className="p-2 border rounded dark:bg-gray-900 dark:text-white"
        >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="system">🖥️ System</option>
        </select>
    );
}
