'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';

interface LenisProviderProps {
  children: React.ReactNode;
}

// Module-level singleton so any other component (the header's nav/logo
// smooth-scroll, say) can drive the same Lenis instance instead of the
// browser's native instant jump — there's only ever one on the page, so
// a plain exported reference is simpler here than wiring up a context
// just for this.
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * LenisProvider — drives the whole site's smooth-scroll feel. Hooked into
 * GSAP's ticker (rather than its own rAF loop) so Lenis and every GSAP
 * scroll-driven animation stay perfectly in sync on one clock.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  // Client-side navigation between pages (e.g. the homepage's "Read More"
  // → /faq) kept the old scroll position: Next's own scroll-to-top
  // doesn't reliably take with Lenis driving the scroll, which holds its
  // own target position. Reset through Lenis itself, instantly. Skipped
  // when the URL has a #hash (e.g. /faq → /#partners) — that jump to a
  // section belongs to the nav link's own handling, not to top.
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (window.location.hash) return;
    lenisInstance?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisInstance = lenis;

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}

export default LenisProvider;
