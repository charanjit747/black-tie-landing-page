'use client';

import React from 'react';
import Link from 'next/link';
import { CommonButton } from '@/components/common/Button/CommonButton';
import { CloseIcon } from '@/constants/icons';

interface NavLinkItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: readonly NavLinkItem[];
  activePath: string;
  /** Same smooth-scroll-to-section handler the desktop nav uses (see Header.tsx). */
  onLinkClick?: (e: React.MouseEvent, href: string) => void;
  /** Whether the link hrefs (in-page "#id" anchors) should resolve against "/" for navigation from another page. */
  isHome?: boolean;
}

// The background is split into this many vertical strips, each one
// extending from its own left edge out to the right (see _mobile-menu.scss),
// same structure as the reference demo's `.js-menu-inner-background` list
// of `<li><i></i></li>`.
const BG_STRIP_COUNT = 4;

// ── Full-screen mobile nav ─────────────────────────────────────
// Always mounted (visibility/opacity toggled via the `mobile-menu--open`
// class, not conditional rendering) so the close transition can play
// instead of the panel just vanishing.
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  links,
  activePath,
  onLinkClick,
  isHome = false,
}) => {
  return (
    <div
      className={`mobile-menu${isOpen ? ' mobile-menu--open' : ''}`}
      aria-hidden={!isOpen}
    >
      <div className="mobile-menu__bg" aria-hidden="true">
        {Array.from({ length: BG_STRIP_COUNT }).map((_, index) => (
          <span
            key={index}
            className="mobile-menu__bg-strip"
            style={{
              left: `${(index * 100) / BG_STRIP_COUNT}%`,
              width: `${100 / BG_STRIP_COUNT}%`,
              backgroundPosition: `${(index * 100) / (BG_STRIP_COUNT - 1)}% 0`,
            }}
          />
        ))}
      </div>

      <button
        type="button"
        className="mobile-menu__close"
        onClick={onClose}
        aria-label="Close menu"
      >
        <CloseIcon size={22} />
      </button>

      {/* The actual scroll container — kept separate from the outer
          `.mobile-menu` (which stays fixed/non-scrolling, so `__bg` and
          `__close` above always cover/sit at the full viewport
          regardless of inner scroll position) so a short viewport or a
          longer nav list can scroll without losing the fixed backdrop
          behind it. See _mobile-menu.scss for why `__content` (not
          `justify-content: center` on this scroll container itself)
          is what does the vertical centering — centering the scroll
          container directly made the very first item permanently
          unreachable once content overflowed. */}
      {/* data-lenis-prevent: without it, the site's Lenis instance (see
          LenisProvider) intercepts every wheel/touch scroll for its own
          smooth-scroll of the page underneath, and this panel's own
          native overflow-y scroll never receives the input at all. */}
      <div className="mobile-menu__scroll" data-lenis-prevent>
        <div className="mobile-menu__content">
          <nav className="mobile-menu__nav" aria-label="Mobile navigation">
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={isHome ? href : `/${href}`}
                onClick={(e) => onLinkClick?.(e, href)}
                className="mobile-menu__link"
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
            {/* `secondary` (white bg in light theme, #0c0c0c in dark) was
                merging invisibly into this panel's own background, which
                tracks the same light/dark direction (see _mobile-menu.scss)
                — unlike the header, where Login sits against a background
                that's always dark regardless of theme. `primary` moves the
                OPPOSITE way (dark bg in light theme, white bg in dark),
                which is what actually contrasts here, and keeps Login
                visually filled/prominent against Referral's outlined ghost. */}
            <CommonButton as="link" href="/login" variant="primary" size="lg" block>
              Login/Create Account
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
