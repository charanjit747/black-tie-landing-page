'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import { SocialLinkArrowIcon } from '@/constants/icons';

// ── Config ───────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Partner with us', href: '/partner' },
] as const;

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  // "Glassay" is how Figma's own copy spells it — reproduced verbatim
  // rather than silently "corrected", same as this page's other
  // copy blocks throughout (e.g. FAQ).
  { label: 'Glassay of terms', href: '/terms' },
] as const;

// Brand colors are literal per platform, not theme tokens — Figma uses
// the exact same hex in both Home-Light and Home-Dark.
interface SocialLink {
  label: string;
  href: string;
  color?: string;
  gradient?: boolean;
}

const SOCIALS: SocialLink[] = [
  { label: 'Twitter', href: 'https://twitter.com', color: '#39bfe6' },
  { label: 'Facebook', href: 'https://facebook.com', color: '#1877f2' },
  { label: 'Instagram', href: 'https://instagram.com', gradient: true },
  { label: 'Linkedin', href: 'https://linkedin.com', color: '#0077d3' },
  { label: 'You tube', href: 'https://youtube.com', color: '#ff0002' },
];

// ── Component ────────────────────────────────────────────────
// The one section on the page that's a true document landmark rather
// than a homepage-only <section> — it's rendered once in MainLayout
// and shows up on every page (see src/components/layout/MainLayout.tsx).
export const Footer: React.FC = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

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
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  {/* aria-current stays for assistive tech even though the
                      underline Figma shows on "Home" is only a hover-state
                      reference, not a permanent current-page style — every
                      link looks the same at rest, underlining only on hover. */}
                  <Link href={href} aria-current={pathname === href ? 'page' : undefined}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="site-footer__nav-list">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={href}>
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
