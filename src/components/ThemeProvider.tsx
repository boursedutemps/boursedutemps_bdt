"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  isDark: false,
});

// Détecte si l'app tourne dans Capacitor (APK Android)
const isCapacitor = () =>
  typeof window !== 'undefined' && !!(window as unknown as { Capacitor?: unknown }).Capacitor;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isDark, setIsDark]    = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bdt_theme') as Theme | null;
    // Par défaut : light (évite tout problème d'inversion de couleurs)
    setThemeState(saved || 'light');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mql  = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (t: Theme) => {
      const dark = t === 'dark' || (t === 'system' && mql.matches);
      setIsDark(dark);
      root.classList.toggle('dark', dark);
    };

    applyTheme(theme);

    if (theme === 'system') {
      const handler = () => applyTheme('system');
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    localStorage.setItem('bdt_theme', t);
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
