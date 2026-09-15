'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { gsap } from 'gsap';
import { CommonButton } from '@/components/common/Button/CommonButton';
import { CloseIcon } from '@/constants/icons';
import { createMobileMenuTimeline } from '@/utils/gsapAnimations';

interface NavLinkItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: readonly NavLinkItem[];
  activePath: string;
}

// The background is split into this many vertical strips, each one
// extending from its own left edge out to the right (see the timeline
// below) — same structure as the reference demo's
// `.js-menu-inner-background` list of `<li><i></i></li>`.
const BG_STRIP_COUNT = 4;

// ── Full-screen mobile nav ─────────────────────────────────────
// Always mounted (display toggled via GSAP, not conditional rendering)
// so the close animation can play instead of the panel just vanishing.
export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links, activePath }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stripRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Animation itself lives in utils/gsapAnimations.ts (createMobileMenuTimeline)
  // — same recipe as the reference GSAP mobile-menu demo:
  //  1. The background's 4 strips extend left→right (scaleX: 0 → 1),
  //     staggered a touch so they land one after another, not all at once.
  //  2. The nav links then slide in from the left one by one, starting
  //     only once the strips have landed.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const { timeline, destroy } = createMobileMenuTimeline({
      overlay,
      strips: stripRefs.current,
      closeButton: closeRef.current,
      links: linkRefs.current,
    });

    timelineRef.current = timeline;

    return destroy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links.length]);

  // Play forward on open a touch faster than normal; close reverses
  // quicker still.
  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;

    if (isOpen) {
      tl.timeScale(1.2).play();
    } else {
      tl.timeScale(1.5).reverse();
    }
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="mobile-menu"
      style={{ display: 'none' }}
      aria-hidden={!isOpen}
    >
      <div className="mobile-menu__bg" aria-hidden="true">
        {Array.from({ length: BG_STRIP_COUNT }).map((_, index) => (
          <span
            key={index}
            className="mobile-menu__bg-strip"
            ref={(el) => {
              stripRefs.current[index] = el;
            }}
            style={{
              left: `${(index * 100) / BG_STRIP_COUNT}%`,
              width: `${100 / BG_STRIP_COUNT}%`,
              backgroundPosition: `${(index * 100) / (BG_STRIP_COUNT - 1)}% 0`,
            }}
          />
        ))}
      </div>

      <button
        ref={closeRef}
        type="button"
        className="mobile-menu__close"
        onClick={onClose}
        aria-label="Close menu"
      >
        <CloseIcon size={22} />
      </button>

      <nav className="mobile-menu__nav" aria-label="Mobile navigation">
        {links.map(({ label, href }, index) => (
          <Link
            key={href}
            href={href}
            ref={(el) => {
              linkRefs.current[index] = el;
            }}
            className={`mobile-menu__link${
              activePath === href ? ' mobile-menu__link--active' : ''
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="mobile-menu__actions">
        {/* Both routed through CommonButton (not a raw <Link>) so they
            share the exact same box model — same height as Login. */}
        <CommonButton as="link" href="/partner" variant="ghost" size="lg" block>
          Become a Referral Partner
        </CommonButton>
        <CommonButton as="link" href="/login" variant="secondary" size="lg" block>
          Login/Create Account
        </CommonButton>
      </div>
    </div>
  );
};

export default MobileMenu;
