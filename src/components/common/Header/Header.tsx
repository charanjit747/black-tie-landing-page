'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { CommonButton } from '@/components/common/Button/CommonButton';
import { MenuIcon, SunIcon, MoonIcon } from '@/constants/icons';
import { MobileMenu } from './MobileMenu';
import { getLenis } from '@/providers/LenisProvider';

// ── Nav Links Config (matches Figma: Home / Marketplace / Learn / Partner With Us / FAQs) ──
// Hrefs are in-page anchors to the matching homepage section (not
// separate routes) — Home→Hero, Marketplace→Ecosystem, Learn→How It
// Works, Partner With Us→Our Partners, FAQs→FAQ. Smooth-scrolled via
// Lenis (see handleNavClick below) rather than a plain browser jump.
const NAV_LINKS = [
  { label: 'Home',            href: '#home' },
  { label: 'Marketplace',     href: '#ecosystem' },
  { label: 'Learn',           href: '#how-it-works' },
  { label: 'Partner With Us', href: '#partners' },
  { label: 'FAQs',            href: '#faq' },
] as const;

// ── Component ────────────────────────────────────────────────
// The header is a translucent "glass" pill nav that floats over the homepage
// hero (per Figma). It turns into a solid, theme-aware bar once the user
// scrolls past the hero, or on any inner page that has no dark hero behind it.

export const Header: React.FC = () => {
  const pathname   = usePathname();
  const dispatch   = useAppDispatch();
  const theme      = useAppSelector((state) => state.theme.mode);
  const isDark     = theme === 'dark';
  const isHome     = pathname === '/';

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Transparent glass state only applies on the homepage hero, before scroll.
  const isTransparent = isHome && !scrolled;

  // Close mobile menu on route change — adjusted during render (React's
  // own recommended pattern for "reset state when a prop changes",
  // using state rather than a ref to track the previous value so it
  // stays correct under concurrent rendering) rather than in an effect,
  // which would call setState synchronously on every render and trigger
  // a redundant extra render each time.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  // Hide the header the moment the user scrolls down at all, reveal it the
  // moment they scroll back up. The background (transparent ↔ solid) is
  // deliberately NOT re-evaluated while scrolling down — it only changes
  // while revealing on scroll-up, or resets the instant they're back at
  // the very top — so there's never a flash of solid color right before
  // the header slides away.
  //
  // A hard "ignore anything under N px" dead-zone still matters here even
  // without a top threshold: Lenis's eased/inertial scroll reports lots of
  // tiny, sometimes momentarily reversed sub-pixel deltas as it settles,
  // and without a dead-zone that was flipping `hidden` back and forth
  // (visible as flicker) on every one of those micro-corrections.
  useEffect(() => {
    const DEAD_ZONE = 4;

    // Seeded from the real scroll position at mount, not 0 — a reload
    // (or back/forward restore) can land mid-page before this effect
    // even runs. Seeding `lastScrollY` at 0 made the very first
    // `handleScroll()` call see a huge fake "scrolled down" delta
    // (0 → actual y), which hid the header and left `scrolled` at its
    // stale `false` (only the scroll-UP branch below ever sets it) —
    // i.e. the header lost its solid/visible state until the user's
    // next real scroll happened to move it back up past the dead zone.
    const initialY = Math.max(0, window.scrollY);
    let hiddenState = false;
    let scrolledState = initialY > 80;
    lastScrollY.current = initialY;
    setScrolled(scrolledState);

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        const delta = y - lastScrollY.current;

        if (y === 0) {
          hiddenState = false;
          scrolledState = false; // back at the very top — always transparent
        } else if (delta > DEAD_ZONE) {
          hiddenState = true; // scrolling down: hide, leave bg untouched
        } else if (delta < -DEAD_ZONE) {
          hiddenState = false;
          scrolledState = y > 80; // scrolling up: safe to reconsider the bg
        }
        // else: movement too small to be a real direction change — keep
        // whatever state we were already in, instead of re-deciding.

        setHidden(hiddenState);
        setScrolled(scrolledState);
        lastScrollY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth-scrolls to the matching homepage section via the site's own
  // Lenis instance (a native anchor jump would be instant and fight
  // Lenis's momentum) — used by the logo, desktop nav, and mobile nav.
  // Off-page (not on "/"), this is a no-op: the <Link> falls through to
  // a normal Next navigation to "/#id", and the browser's own hash
  // handling takes it from there.
  const scrollToSection = (e: React.MouseEvent, href: string) => {
    if (!isHome || !href.startsWith('#')) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    e.preventDefault();
    setMenuOpen(false);

    const headerOffset = (headerRef.current?.offsetHeight ?? 0) + 16;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { offset: -headerOffset });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={[
          'site-header',
          // Two distinct states — home is transparent only at the very
          // top, before there's any scroll; the instant it scrolls it
          // matches every inner page exactly (same solid background, no
          // blur, no shadow).
          isTransparent ? 'site-header--transparent' : 'site-header--solid',
          hidden ? 'site-header--hidden' : '',
        ].filter(Boolean).join(' ')}
        role="banner"
      >
        <Container className="site-header__container">
        <div className="site-header__inner">

          {/* ── Logo ── */}
          {/* Always points at "/" (so it still works from another page)
              but on the homepage itself this scrolls smoothly to the
              top instead of being a same-URL no-op navigation. */}
          <Link
            href="/#home"
            onClick={(e) => scrollToSection(e, '#home')}
            className="site-header__logo"
            aria-label="Black Tie Asset Hub — Home"
          >
            <Image
              // TEMPORARY: reverted to local — CDN path 403s (S3
              // AccessDenied), see logo/ in the CDN migration notes.
              src="/assets/logo/black-tie-logo.png"
              alt="Black Tie Asset Hub"
              width={167}
              height={50}
              priority
            />
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="site-header__nav" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={isHome ? href : `/${href}`}
                onClick={(e) => scrollToSection(e, href)}
                className="site-header__nav-link"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Actions ── */}
          <div className="site-header__actions">

            {/* Referral pill — ghost/glass, always the same on light & dark.
                Stays `lg` (the real Figma size) — it just gets globally
                scaled down below $bp-narrow-desktop (1679px) alongside
                every other `--lg` button, instead of being a different
                size prop. Only shown at the full-size desktop tier and up. */}
            <CommonButton
              as="link"
              href="/partner"
              variant="ghost"
              size="lg"
              className="site-header__referral"
            >
              Become a Referral Partner
            </CommonButton>

            {/* Login pill — genuinely theme-reactive per Figma: white pill /
                black text in Home-Light, #0c0c0c pill / #efefef text in
                Home-Dark. Unlike Referral (identical glass look in both
                themes), this one really does need `secondary`, not `ghost`.
                (The header's own background staying constant on scroll/
                theme is a separate concern — this button's colors are
                meant to flip.) */}
            <CommonButton
              as="link"
              href="/login"
              variant="secondary"
              size="lg"
              className="d-none d-md-inline-flex"
            >
              Login/Create Account
            </CommonButton>

            {/* Theme Toggle */}
            <button
              className="site-header__theme-toggle"
              onClick={() => dispatch(toggleTheme())}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
              type="button"
            >
              {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>

            {/* Hamburger */}
            <button
              className="site-header__hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              type="button"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>
        </Container>
      </header>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
        activePath={pathname}
        onLinkClick={scrollToSection}
        isHome={isHome}
      />
    </>
  );
};

export default Header;
