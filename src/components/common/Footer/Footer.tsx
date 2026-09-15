import React from 'react';
import Link from 'next/link';
import { TwitterIcon, LinkedInIcon, InstagramIcon, FacebookIcon } from '@/constants/icons';

// ── Config ───────────────────────────────────────────────────

const FOOTER_LINKS = {
  Company: [
    { label: 'About Us',    href: '/about' },
    { label: 'Services',    href: '/services' },
    { label: 'Blog',        href: '/blog' },
    { label: 'Careers',     href: '/careers' },
  ],
  Support: [
    { label: 'Contact',     href: '/contact' },
    { label: 'FAQ',         href: '/faq' },
    { label: 'Help Center', href: '/help' },
  ],
  Legal: [
    { label: 'Privacy Policy',  href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy',   href: '/cookies' },
  ],
} as const;

const SOCIAL_LINKS = [
  { Icon: TwitterIcon,   href: '#', label: 'Twitter / X' },
  { Icon: LinkedInIcon,  href: '#', label: 'LinkedIn' },
  { Icon: InstagramIcon, href: '#', label: 'Instagram' },
  { Icon: FacebookIcon,  href: '#', label: 'Facebook' },
] as const;

// ── Component ────────────────────────────────────────────────

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">
        <div className="site-footer__grid">

          {/* ── Brand Column ── */}
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__logo" aria-label="Black Tie — Home">
              Black<span>Tie</span>
            </Link>
            <p className="site-footer__tagline">
              Crafting premium digital experiences with precision and elegance.
            </p>

            {/* Social Links */}
            <div className="site-footer__socials">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="site-footer__social-link"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Link Columns ── */}
          {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
            ([colTitle, links]) => (
              <div key={colTitle}>
                <h3 className="site-footer__col-title">{colTitle}</h3>
                <ul className="site-footer__links" role="list">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="site-footer__link">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        <hr className="site-footer__divider" />

        {/* ── Bottom Bar ── */}
        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            &copy; {currentYear} BlackTie. All rights reserved.
          </p>

          <nav className="site-footer__bottom-links" aria-label="Legal navigation">
            <Link href="/privacy" className="site-footer__bottom-link">
              Privacy
            </Link>
            <Link href="/terms" className="site-footer__bottom-link">
              Terms
            </Link>
            <Link href="/cookies" className="site-footer__bottom-link">
              Cookies
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
