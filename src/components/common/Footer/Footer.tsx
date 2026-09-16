import React from 'react';
// import Link from 'next/link';
// import { TwitterIcon, LinkedInIcon, InstagramIcon, FacebookIcon } from '@/constants/icons';
import { Container } from "react-bootstrap";

// ── Config ───────────────────────────────────────────────────

// const FOOTER_LINKS = {
//   Company: [
//     { label: 'About Us',    href: '/about' },
//     { label: 'Services',    href: '/services' },
//     { label: 'Blog',        href: '/blog' },
//     { label: 'Careers',     href: '/careers' },
//   ],
//   Support: [
//     { label: 'Contact',     href: '/contact' },
//     { label: 'FAQ',         href: '/faq' },
//     { label: 'Help Center', href: '/help' },
//   ],
//   Legal: [
//     { label: 'Privacy Policy',  href: '/privacy' },
//     { label: 'Terms of Service', href: '/terms' },
//     { label: 'Cookie Policy',   href: '/cookies' },
//   ],
// } as const;

// const SOCIAL_LINKS = [
//   { Icon: TwitterIcon,   href: '#', label: 'Twitter / X' },
//   { Icon: LinkedInIcon,  href: '#', label: 'LinkedIn' },
//   { Icon: InstagramIcon, href: '#', label: 'Instagram' },
//   { Icon: FacebookIcon,  href: '#', label: 'Facebook' },
// ] as const;

// ── Component ────────────────────────────────────────────────

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <Container>
        <h1 className="site-footer__copyright text-center">
          &copy; {currentYear} BlackTie. All rights reserved.
        </h1>
      </Container>
    </footer>
  );
};

export default Footer;
