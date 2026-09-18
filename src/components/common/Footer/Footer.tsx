'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import { SocialLinkArrowIcon } from '@/constants/icons';
import { getLenis } from '@/providers/LenisProvider';

// ── Config ───────────────────────────────────────────────────
// Home/FAQs/Marketplace/Partner with us are in-page anchors to the
// matching homepage section — same sections, same ids, as the header's
// own nav (see NAV_LINKS in Header.tsx: Home→Hero, Marketplace→
// Ecosystem, Partner with us→Our Partners, FAQs→FAQ). There's no
// standalone /faqs, /marketplace, or /partner route in this app — the
// landing page is the only page that exists, so every link here is an
// in-page anchor.
const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'FAQs', href: '#faq' },
  { label: 'Marketplace', href: '#ecosystem' },
  { label: 'Partner with us', href: '#partners' },
] as const;

// href is '#' for both — no real Privacy Policy/Terms pages to link to yet.
const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  // "Glassay" is how Figma's own copy spells it — reproduced verbatim
  // rather than silently "corrected", same as this page's other
  // copy blocks throughout (e.g. FAQ).
  { label: 'Glassay of terms', href: '#' },
] as const;

// Brand colors are literal per platform, not theme tokens — Figma uses
// the exact same hex in both Home-Light and Home-Dark.
interface SocialLink {
  label: string;
  href: string;
  color?: string;
  gradient?: boolean;
}

// href is '#' for every one — no real social profiles to link to yet.
const SOCIALS: SocialLink[] = [
  { label: 'Twitter', href: '#', color: '#39bfe6' },
  { label: 'Facebook', href: '#', color: '#1877f2' },
  { label: 'Instagram', href: '#', gradient: true },
  { label: 'Linkedin', href: '#', color: '#0077d3' },
  { label: 'You tube', href: '#', color: '#ff0002' },
];

// ── Component ────────────────────────────────────────────────
// The one section on the page that's a true document landmark rather
// than a homepage-only <section> — it's rendered once in MainLayout
// and shows up on every page (see src/components/layout/MainLayout.tsx).
export const Footer: React.FC = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const currentYear = new Date().getFullYear();

  // Same smooth-scroll-to-section approach as the header (see
  // scrollToSection in Header.tsx) — off-page (not on "/"), this is a
  // no-op and the <Link> falls through to a normal Next navigation to
  // "/#id" instead. Only one <header> ever exists on the page, so
  // there's no need for the header's own ref to it here.
  const scrollToSection = (e: React.MouseEvent, href: string) => {
    if (!isHome || !href.startsWith('#')) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    e.preventDefault();

    const headerOffset = (document.querySelector('header')?.clientHeight ?? 0) + 16;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { offset: -headerOffset });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <Container>
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__logo" aria-label="Black Tie Asset Hub — Home">
              <span className="site-footer__logo-mark" aria-hidden="true" />
              <span className="site-footer__logo-text">
                <span className="site-footer__logo-line1">Black Tie</span>
                <span className="site-footer__logo-line2">Asset Hub</span>
              </span>
            </Link>

            <div className="site-footer__brand-copy">
              <p className="site-footer__about">
                Black Tie Asset Hub is at the forefront of transforming the real estate industry
                through the innovative use of blockchain technology.
              </p>

              <p className="site-footer__disclaimer">
                Black Tie Holdings Licensing Pvt Ltd is an Authorized Representative AR Number{' '}
                <strong>001319812</strong> of Australian Insurance Company Pty Ltd{' '}
                <strong>(ABN 65 002 941 513, AFS License No. 238384) (AIC)</strong>
              </p>
            </div>
          </div>

          <div className="site-footer__contact">
            <a href="tel:+18156912579" className="site-footer__phone">
              +1 (815) 691-2579
            </a>
            <a href="mailto:support@blacktie.digital" className="site-footer__email">
              support@blacktie.digital
            </a>

            <ul className="site-footer__socials">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`site-footer__social${social.gradient ? ' site-footer__social--instagram' : ''}`}
                    style={social.gradient ? undefined : { backgroundColor: social.color }}
                  >
                    {social.label}
                    <SocialLinkArrowIcon size={9} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-footer__middle">
          <nav className="site-footer__nav" aria-label="Footer">
            <ul className="site-footer__nav-list">
              {NAV_LINKS.map(({ label, href }) => {
                // Anchor links resolve against "/" when off-page (same as
                // the header).
                const resolvedHref = href.startsWith('#') && !isHome ? `/${href}` : href;

                return (
                  <li key={href}>
                    {/* aria-current stays for assistive tech even though the
                        underline Figma shows on "Home" is only a hover-state
                        reference, not a permanent current-page style — every
                        link looks the same at rest, underlining only on hover. */}
                    <Link
                      href={resolvedHref}
                      onClick={(e) => scrollToSection(e, href)}
                      aria-current={pathname === href ? 'page' : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="site-footer__nav-list">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__info">
            <div className="site-footer__info-block">
              <h3 className="site-footer__info-heading">Independent Remittance Dealer</h3>
              <p className="site-footer__info-text">
                IND100778824-001&nbsp;&nbsp;|&nbsp;&nbsp;Exchange Registered Provider&nbsp;&nbsp;|&nbsp;&nbsp;DCE100778824-001
              </p>
            </div>

            <div className="site-footer__info-block">
              <h3 className="site-footer__info-heading">Address</h3>
              <address className="site-footer__address">L32, 101 Miller St North Sydney NSW 2060</address>
            </div>

            <p className="site-footer__partner">
              Development Partner:{' '}
              <a href="https://www.antier.com/" target="_blank" rel="noopener noreferrer">
                www.antier.com
              </a>
              <span className="site-footer__partner-logo" role="img" aria-label="Antier" />
            </p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            &copy; {currentYear} All Rights Reserved Black Tie Holdings Pvt. Ltd.
          </p>
          <p className="site-footer__since">[ Since 2012 ]</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
