import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

type Theme = 'light' | 'dark';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <header className="bg-surface/80 backdrop-blur-lg sticky top-0 z-10 w-full border-b border-border mb-6">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and App Name */}
                    <div className="flex items-center space-x-3">
                        <Icon name="notebook" className="w-7 h-7 text-primary" />
                        <span className="text-xl font-bold font-heading text-text-primary">
                            UnicornXOSW
                        </span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleTheme}
                            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                            className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary bg-surface hover:bg-border rounded-full transition-colors"
                        >
                            <Icon name={theme === 'light' ? 'moon' : 'sun'} className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-surface text-text-primary rounded-md hover:bg-border active:scale-95 transition-all duration-200 border border-border flex items-center text-sm font-medium"
                        >
                            <Icon name="log-out" className="w-4 h-4 mr-2" />
                            ออกจากระบบ
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;