import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LenisProvider } from '@/providers/LenisProvider';
// ── Third-party CSS (must be imported in JS, not @use in SCSS) ─
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-phone-input-2/lib/style.css';
// ── Global SCSS (design system + custom styles) ──────────────
import '@/styles/global.scss';
import { SkipLink } from '@/components/common/SkipLink';

// Sitewide brand typeface per Figma (DM Sans is the only font used across
// the whole design — nav, buttons, headings and body copy all use it).
// Loaded once via next/font/google, self-hosted at build time and exposed
// as a CSS variable — the standard Next.js font pattern.
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '900'], // 900 needed for the mobile menu's extra-bold nav labels
});

export const metadata: Metadata = {
  title: {
    default: 'BlackTie — Premium Digital Experiences',
    template: '%s | BlackTie',
  },
  description:
    'Crafting premium digital experiences with precision and elegance. A Next.js TypeScript boilerplate.',
  keywords: ['Next.js', 'TypeScript', 'Boilerplate', 'BlackTie'],
  authors: [{ name: 'BlackTie' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'BlackTie — Premium Digital Experiences',
    description: 'Crafting premium digital experiences with precision and elegance.',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={dmSans.variable}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('preferred-theme');
                  if (saved === 'dark' || saved === 'light') {
                    document.documentElement.setAttribute('data-theme', saved);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ReduxProvider>
          <ThemeProvider>
            <LenisProvider>
              <SkipLink />
              {children}
            </LenisProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
