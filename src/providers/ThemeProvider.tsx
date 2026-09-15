'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/slices/themeSlice';
import type { ThemeMode } from '@/constants/colors';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider — Syncs theme state between Redux, DOM <html> attribute,
 * and localStorage so theme selection persists across refreshes without reset.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const [initialized, setInitialized] = useState(false);

  // ── 1. On mount: load saved theme from localStorage into Redux ──
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('preferred-theme') as ThemeMode | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        dispatch(setTheme(savedTheme));
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch {
      // Ignore storage errors (e.g. private browsing)
    }
    setInitialized(true);
  }, [dispatch]);

  // ── 2. Sync to DOM & localStorage ONLY after initial hydration ──
  useEffect(() => {
    if (!initialized) return;

    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('preferred-theme', theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme, initialized]);

  return <>{children}</>;
}
