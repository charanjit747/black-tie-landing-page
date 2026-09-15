/**
 * colors.ts — JS/TS mirror of SCSS color tokens
 * Use for programmatic access (charts, canvas, GSAP, etc.)
 * Keep in sync with src/styles/partials/_variables.scss
 */

// ── Base Palette ─────────────────────────────────────────────
export const palette = {
  black: '#0a0a0a',
  white: '#ffffff',

  gray: {
    50:  '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  primary: {
    DEFAULT: '#1a1a2e',
    light:   '#16213e',
    dark:    '#0f0f1a',
  },

  accent: {
    DEFAULT: '#c9a84c',
    light:   '#e2c472',
    dark:    '#a8873a',
  },

  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error:   '#ef4444',
    info:    '#3b82f6',
  },
} as const;

// ── Light Theme CSS Var References ───────────────────────────
export const lightTheme = {
  bgPrimary:   'var(--color-bg-primary)',
  bgSecondary: 'var(--color-bg-secondary)',
  bgCard:      'var(--color-bg-card)',
  textPrimary: 'var(--color-text-primary)',
  textMuted:   'var(--color-text-muted)',
  border:      'var(--color-border)',
  brandAccent: 'var(--color-brand-accent)',
} as const;

// ── Theme-aware helpers ───────────────────────────────────────
/** Returns the current CSS var value from the document root */
export function getCSSVar(varName: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

export type ThemeMode = 'light' | 'dark';
