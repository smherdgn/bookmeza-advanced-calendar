
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Theme } from '../../../types';
import { lightTheme, darkTheme } from '../../../constants';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', newMode === 'dark');
      }
      return newMode;
    });
  };
  
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  // Effect to set initial theme class on html element
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', mode === 'dark');
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
