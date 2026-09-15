'use client';

import React from 'react';

/** Accessibility skip link — must be client due to onFocus/onBlur handlers */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        top: '-100%',
        left: 0,
        padding: '0.5rem 1rem',
        background: 'var(--color-brand-accent)',
        color: '#fff',
        zIndex: 9999,
        transition: 'top 0.1s',
        textDecoration: 'none',
        fontWeight: 600,
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.top = '0';
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.top = '-100%';
      }}
    >
      Skip to main content
    </a>
  );
}
