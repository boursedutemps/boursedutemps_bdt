'use client';

// src/components/ThemeToggle.tsx
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  const next: Record<string, 'light' | 'dark' | 'system'> = {
    light:  'dark',
    dark:   'system',
    system: 'light',
  };

  const labels: Record<string, string> = {
    light:  'Mode clair',
    dark:   'Mode sombre',
    system: 'Système',
  };

  const icons = {
    light:  <Sun  className="w-4 h-4" />,
    dark:   <Moon className="w-4 h-4" />,
    system: <Monitor className="w-4 h-4" />,
  };

  return (
    <button
      onClick={() => setTheme(next[theme])}
      aria-label={`Thème actuel : ${labels[theme]}. Cliquer pour passer à ${labels[next[theme]]}`}
      title={labels[theme]}
      className="flex items-center justify-center w-9 h-9 rounded-full text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200"
    >
      {icons[theme]}
    </button>
  );
}
