// themeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { theme, Theme } from '@/src/theme/theme';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  activeTheme: Theme;
  useSystemTheme: boolean;
  setUseSystemTheme: (use: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  activeTheme: theme.light as Theme,
  useSystemTheme: true,
  setUseSystemTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = 'useColorScheme();'
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    if (useSystemTheme) {
      console.log('systemColorScheme', systemColorScheme);
      // setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, useSystemTheme]);

  const toggleTheme = () => {
    if (useSystemTheme) {
      setUseSystemTheme(false);
    }
    setIsDarkMode(!isDarkMode);
  };

  const activeTheme = isDarkMode ? theme.dark as Theme : theme.light as Theme;

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme, 
      activeTheme,
      useSystemTheme,
      setUseSystemTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);