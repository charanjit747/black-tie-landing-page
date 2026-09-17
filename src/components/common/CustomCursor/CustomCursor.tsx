'use client';

import React, { useEffect, useRef } from 'react';
import { initCustomCursorAnimation } from '@/utils/gsapAnimations';

// Mounted once at the site root (see app/layout.tsx) — a single shared
// ring + dot, positioned via GSAP quickTo in initCustomCursorAnimation.
// Renders unconditionally; the min-width:1280px + hover:hover +
// pointer:fine gate lives in both the SCSS (_custom-cursor.scss, so it
// never paints/lays out below that) and the animation init itself (so
// it never adds a single listener or gsap.* call below it either).
export const CustomCursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ringRef.current || !dotRef.current) return;
    return initCustomCursorAnimation(ringRef.current, dotRef.current);
  }, []);

  return (
    <>
      <div className="custom-cursor" ref={ringRef} aria-hidden="true" />
      <div className="custom-cursor__dot" ref={dotRef} aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
