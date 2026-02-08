'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isThemeLoaded: boolean; // Flag to indicate when theme is loaded
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const NewThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false); // Track if theme is loaded

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Get saved theme from localStorage
      const savedTheme = localStorage.getItem('theme') as Theme | null;

      if (savedTheme) {
        // Use saved theme preference
        setTheme(savedTheme);
      }
      // If no saved theme, use default 'light'

      // Mark as loaded after getting the theme
      setIsThemeLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document element only after theme is loaded
    if (isThemeLoaded) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Save theme preference to localStorage
      localStorage.setItem('theme', theme);
    }
  }, [theme, isThemeLoaded]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isThemeLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useNewTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useNewTheme must be used within a NewThemeProvider');
  }
  return context;
};