'use client';

import React, { useEffect, useRef } from 'react';
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
  // Marks whether effect 2 below has already run once — a plain ref
  // flip, not React state, since this only needs to skip that effect's
  // own first invocation (see there for why), not trigger a render.
  const isFirstSync = useRef(true);

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
  }, [dispatch]);

  // ── 2. Sync to DOM & localStorage whenever the theme actually changes ──
  // Skips its own first run — effect 1 above already set the correct
  // initial DOM attribute directly from localStorage; re-doing it here on
  // mount would instead write this render's stale default `theme` value
  // (Redux's dispatch from effect 1 hasn't resolved into a re-render yet
  // at this point in the same commit), flashing the wrong theme for a
  // frame before the real one catches up.
  useEffect(() => {
    if (isFirstSync.current) {
      isFirstSync.current = false;
      return;
    }

    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('preferred-theme', theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  return <>{children}</>;
}
