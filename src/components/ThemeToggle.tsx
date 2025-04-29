import React, { useEffect, useState } from 'react';
import themeSwitcher from '../utils/theme-switcher';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [currentTheme, setCurrentTheme] = useState<string>('enhanced');

  useEffect(() => {
    // Get current theme
    setCurrentTheme(themeSwitcher.currentTheme);

    // Listen for theme changes
    const handleThemeChange = (e: CustomEvent) => {
      setCurrentTheme(e.detail.theme);
    };

    document.addEventListener('themeChanged', handleThemeChange as EventListener);

    return () => {
      document.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  const handleToggleTheme = () => {
    const newTheme = themeSwitcher.toggleTheme();
    setCurrentTheme(newTheme);
  };

  return (
    <div className={`theme-toggle-container ${className}`}>
      <button 
        className="theme-toggle-btn"
        onClick={handleToggleTheme}
        aria-label={`Switch to ${currentTheme === 'enhanced' ? 'original' : 'enhanced'} theme`}
      >
        {currentTheme === 'enhanced' ? (
          <>
            <span>Diseño Mejorado</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </>
        ) : (
          <>
            <span>Diseño Original</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
