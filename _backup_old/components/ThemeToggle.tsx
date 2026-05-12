"use client";

import React, { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const options = [
    { value: 'light',  label: 'Clair',    icon: <Sun size={14} /> },
    { value: 'dark',   label: 'Sombre',   icon: <Moon size={14} /> },
    { value: 'system', label: 'Système',  icon: <Monitor size={14} /> },
  ] as const;

  const current = options.find(o => o.value === theme) || options[2];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        title="Thème"
      >
        {current.icon}
      </button>
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setTheme(opt.value); setShowMenu(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition ${
                  theme === opt.value
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
