'use client';

import React from 'react';

/**
 * icons.tsx — Central SVG Icon Registry
 *
 * Add your custom SVG icons here as named React components.
 * Each icon accepts standard SVG props + an optional `size` shorthand.
 *
 * Usage:
 *   import { MenuIcon, SunIcon } from '@/constants/icons';
 *   <MenuIcon size={24} className="text-accent" />
 */

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Shorthand to set both width and height */
  size?: number | string;
}

const defaultProps = (size: number | string = 24): Partial<IconProps> => ({
  width: size,
  height: size,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
});

// ── Navigation ────────────────────────────────────────────────

export const MenuIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    {/* Replace with your custom SVG paths */}
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

// ── Theme ─────────────────────────────────────────────────────
// Exact paths exported from Figma's header theme-toggle (nodes 1:2446 /
// 612:450) — filled, not stroked, so they use `currentColor` directly
// rather than the shared stroke-icon defaults.

export const SunIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 23 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.0325 12.1535C17.4928 15.5332 14.5622 18.1196 11.0313 18.1196C7.11821 18.1196 3.94099 14.9423 3.94099 11.0293C3.94099 7.49835 6.52736 4.5677 9.90705 4.02806C10.2734 3.96976 10.6484 3.93903 11.0313 3.93903C14.9443 3.93903 18.1215 7.11626 18.1215 11.0293C18.1215 11.4122 18.0908 11.7872 18.0325 12.1535ZM7.90129 6.48917C6.46118 7.48495 5.5166 9.14801 5.5166 11.0293C5.5166 14.0726 7.98795 16.5439 11.0313 16.5439C12.9125 16.5439 14.5748 15.6002 15.5698 14.1608C14.897 14.4279 14.1628 14.5744 13.3947 14.5744C10.1339 14.5744 7.48612 11.9266 7.48612 8.66588C7.48612 7.89776 7.63265 7.16432 7.90129 6.48917ZM10.2434 0.787807C10.2434 0.352938 10.5964 0 11.0313 0C11.4661 0 11.8191 0.352938 11.8191 0.787807V2.36342C11.8191 2.79829 11.4661 3.15123 11.0313 3.15123C10.5964 3.15123 10.2434 2.79829 10.2434 2.36342V0.787807ZM17.7158 3.2308C18.0238 2.92276 18.5225 2.92276 18.8298 3.2308C19.1378 3.53804 19.1378 4.03672 18.8298 4.34476L17.7158 5.45871C17.4085 5.76596 16.9091 5.76596 16.6018 5.45871C16.2946 5.15147 16.2946 4.652 16.6018 4.34476L17.7158 3.2308ZM21.2727 10.2415C21.7076 10.2415 22.0605 10.5944 22.0605 11.0293C22.0605 11.4642 21.7076 11.8171 21.2727 11.8171H19.6971C19.2623 11.8171 18.9093 11.4642 18.9093 11.0293C18.9093 10.5944 19.2623 10.2415 19.6971 10.2415H21.2727ZM18.8298 17.7138C19.1378 18.0219 19.1378 18.5206 18.8298 18.8278C18.5225 19.1358 18.0238 19.1358 17.7158 18.8278L16.6018 17.7138C16.2946 17.4066 16.2946 16.9071 16.6018 16.5999C16.9091 16.2926 17.4085 16.2926 17.7158 16.5999L18.8298 17.7138ZM11.8191 21.2708C11.8191 21.7057 11.4661 22.0586 11.0313 22.0586C10.5964 22.0586 10.2434 21.7057 10.2434 21.2708V19.6952C10.2434 19.2603 10.5964 18.9074 11.0313 18.9074C11.4661 18.9074 11.8191 19.2603 11.8191 19.6952V21.2708ZM4.34671 18.8278C4.03868 19.1358 3.53999 19.1358 3.23275 18.8278C2.92472 18.5206 2.92472 18.0219 3.23275 17.7138L4.34671 16.5999C4.65395 16.2926 5.15342 16.2926 5.46067 16.5999C5.76791 16.9071 5.76791 17.4066 5.46067 17.7138L4.34671 18.8278ZM0.78976 11.8171C0.354891 11.8171 0.00195312 11.4642 0.00195312 11.0293C0.00195312 10.5944 0.354891 10.2415 0.78976 10.2415H2.36537C2.80024 10.2415 3.15318 10.5944 3.15318 11.0293C3.15318 11.4642 2.80024 11.8171 2.36537 11.8171H0.78976ZM3.23275 4.34476C2.92472 4.03672 2.92472 3.53804 3.23275 3.2308C3.53999 2.92276 4.03868 2.92276 4.34671 3.2308L5.46067 4.34476C5.76791 4.652 5.76791 5.15147 5.46067 5.45871C5.15342 5.76596 4.65395 5.76596 4.34671 5.45871L3.23275 4.34476Z"
      fill="currentColor"
    />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 23 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.75724 1.57904C8.85386 1.67563 8.9196 1.79876 8.94611 1.93279C8.97262 2.06681 8.9587 2.20569 8.90613 2.3318C8.48594 3.34027 8.27036 4.42219 8.27194 5.5147C8.27194 7.70859 9.14346 9.81262 10.6948 11.3639C12.2461 12.9152 14.3501 13.7868 16.544 13.7868C17.6365 13.7883 18.7184 13.5728 19.7269 13.1526C19.8529 13.1001 19.9917 13.0862 20.1256 13.1127C20.2595 13.1391 20.3825 13.2048 20.4791 13.3012C20.5757 13.3977 20.6415 13.5207 20.6681 13.6546C20.6947 13.7885 20.6809 13.9272 20.6286 14.0533C19.8951 15.8118 18.6577 17.3139 17.0722 18.3705C15.4867 19.4271 13.624 19.9909 11.7186 19.9908C6.38867 19.9908 2.0679 15.67 2.0679 10.3401C2.0679 6.32536 4.51919 2.88419 8.0054 1.43014C8.13139 1.37777 8.27008 1.36396 8.40392 1.39047C8.53776 1.41698 8.66072 1.4826 8.75724 1.57904Z"
      fill="currentColor"
    />
  </svg>
);

// ── Actions ───────────────────────────────────────────────────

export const SearchIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/**
 * ArrowNextIcon — exact path exported from Figma (node 13:8008, the
 * "Get Started" CTA's arrow). Filled, not stroked, so it uses
 * `currentColor` directly rather than the shared stroke-icon defaults.
 */
export const ArrowNextIcon: React.FC<IconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={typeof size === 'number' ? (size * 15) / 16 : size}
    viewBox="0 0 16 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M0.0001297 8.99993L0 3.00407e-05L2 0L2.0001 6.99993L12.1719 7.00003L8.22224 3.05027L9.63644 1.63606L16.0003 8.00003L9.63644 14.364L8.22224 12.9497L12.1719 9.00003L0.0001297 8.99993Z"
      fill="currentColor"
    />
  </svg>
);

export const ExternalLinkIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/**
 * ArrowUpRightIcon — exact path exported from Figma (node 81:575), the
 * small "up-right" arrow used next to every tag/pill label sitewide
 * (FAQs, Investor, Asset Manager Section, Our Partners, Contact Us,
 * etc.). Filled, not stroked, so it uses `currentColor` directly
 * rather than the shared stroke-icon defaults, with its own 11x11
 * viewBox instead of the generic 24x24 grid.
 *
 * NOT used by the footer's social pills — those have their own
 * distinct glyph, see SocialLinkArrowIcon below.
 */
export const ArrowUpRightIcon: React.FC<IconProps> = ({ size = 11, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M0.21967 9.40717C-0.0732233 9.70006 -0.0732233 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.73954e-07 9.9375 4.21468e-07L3.1875 0C2.77329 0 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5V0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * SocialLinkArrowIcon — exact path exported from Figma (node
 * 132:1779), the small arrow inside the footer's Twitter/Facebook/
 * Instagram/LinkedIn/YouTube pills. A genuinely different glyph from
 * ArrowUpRightIcon above (confirmed directly from Figma rather than
 * assumed) — narrower and more vertical, not the same 11x11 diagonal
 * arrow used everywhere else. Filled, uses `currentColor`, own 9x10
 * viewBox.
 */
export const SocialLinkArrowIcon: React.FC<IconProps> = ({ size = 9, ...props }) => (
  <svg
    width={size}
    height={typeof size === 'number' ? (size * 10) / 9 : size}
    viewBox="0 0 9 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M5.62494 9.99994L0.562517 10L0.5625 8.75003L4.49994 8.74996L4.5 2.39273L2.27828 4.86124L1.48278 3.97739L5.0625 0L8.64225 3.97739L7.84676 4.86124L5.625 2.3927L5.62494 9.99994Z"
      fill="currentColor"
    />
  </svg>
);

// ── Form ──────────────────────────────────────────────────────

export const EyeIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const AlertCircleIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.68 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 5.37 5.37l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// ── Social ────────────────────────────────────────────────────

export const TwitterIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} fill="currentColor" stroke="none" {...props}>
    {/* Add your Twitter/X SVG path here */}
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 5.232zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const LinkedInIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} fill="currentColor" stroke="none" {...props}>
    {/* Add your LinkedIn SVG path here */}
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} fill="currentColor" stroke="none" {...props}>
    {/* Add your Instagram SVG path here */}
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} fill="currentColor" stroke="none" {...props}>
    {/* Add your Facebook SVG path here */}
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// ── Status ────────────────────────────────────────────────────

export const CheckCircleIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const LoaderIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);
