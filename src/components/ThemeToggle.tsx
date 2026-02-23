'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { interactionDuration, standardEase } from '@/lib/animations';

interface ThemeToggleProps {
  variant?: 'circle' | 'nav';
}

export function ThemeToggle({ variant = 'circle' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isNavVariant = variant === 'nav';

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className={isNavVariant ? 'h-6 w-6' : 'h-10 w-10'} aria-hidden="true" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={
        isNavVariant
          ? 'inline-flex h-6 w-6 items-center justify-center text-slate-700 transition-colors hover:text-cyan-600 dark:text-white dark:hover:text-cyan-300'
          : 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-950/45 text-cyan-200 backdrop-blur transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/20'
      }
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.svg
        key={theme}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: interactionDuration, ease: standardEase }}
        className={isNavVariant ? 'h-5 w-5' : 'h-4 w-4'}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isDark ? (
          // Sun icon
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        ) : (
          // Moon icon
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        )}
      </motion.svg>
    </button>
  );
}
