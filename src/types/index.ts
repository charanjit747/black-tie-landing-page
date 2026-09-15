/**
 * types/index.ts — Shared TypeScript types & interfaces
 */

// ── Theme ──────────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark';

// ── Navigation ─────────────────────────────────────────────
export interface NavLink {
  label: string;
  href:  string;
  icon?: React.ReactNode;
  children?: NavLink[];
}

// ── API Response ────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data:    T;
  message: string;
  success: boolean;
  status:  number;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
  };
}

// ── Form ───────────────────────────────────────────────────
export interface SelectOption {
  value:     string | number;
  label:     string;
  disabled?: boolean;
}

// ── Component Utilities ─────────────────────────────────────
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';

/** Makes specific keys optional */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Makes specific keys required */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
