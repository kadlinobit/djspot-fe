import { useState } from '#imports';

export const useTheme = () => {
    const theme = useState<'light' | 'dark'>('theme', () => 'light');

    const applyTheme = () => {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme.value);
    };

    const setTheme = (value: 'light' | 'dark') => {
        theme.value = value;
        localStorage.setItem('theme', value);
        applyTheme();
    };

    const toggleTheme = () => {
        setTheme(theme.value === 'light' ? 'dark' : 'light');
    };

    const initTheme = () => {
        const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (saved) {
            theme.value = saved;
        }
        applyTheme();
    };

    return { theme, setTheme, toggleTheme, initTheme };
};
