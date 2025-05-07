import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export default function DarkModeDropdown() {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme') as Theme;
        console.log('[INIT] Loaded theme from localStorage:', saved);
        return saved || 'system';
    });

    useEffect(() => {
        const root = document.documentElement;
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = (mode: Theme) => {
            console.log('[APPLY] Forcing theme to:', mode);
            if (mode === 'dark') {
                root.classList.add('dark');
                console.log('[DOM] Forced dark mode ON');
            } else if (mode === 'light') {
                root.classList.remove('dark');
                console.log('[DOM] Forced dark mode OFF');
            } else {
                // system mode
                const isSystemDark = darkQuery.matches;
                root.classList.toggle('dark', isSystemDark);
                console.log('[DOM] System prefers dark:', isSystemDark);
            }

            localStorage.setItem('theme', mode);
            console.log('[STORAGE] Saved theme:', mode);
        };

        applyTheme(theme);

        const systemChangeHandler = (e: MediaQueryListEvent) => {
            if (localStorage.getItem('theme') === 'system') {
                console.log('[SYSTEM] System theme changed:', e.matches);
                root.classList.toggle('dark', e.matches);
            }
        };

        darkQuery.addEventListener('change', systemChangeHandler);
        return () => {
            darkQuery.removeEventListener('change', systemChangeHandler);
        };
    }, [theme]);

    return (
        <select
            value={theme}
            onChange={(e) => {
                const val = e.target.value as Theme;
                console.log('[UI] Theme selected:', val);
                setTheme(val);
            }}
            className="p-2 border rounded dark:bg-gray-900 dark:text-white"
        >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="system">🖥️ System</option>
        </select>
    );
}
