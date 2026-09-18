import type { Metadata, Viewport } from 'next';
import { DM_Sans, Krona_One } from 'next/font/google';
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
import { CustomCursor } from '@/components/common/CustomCursor/CustomCursor';

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

// Only used for the "BLACK TIE / ASSET HUB" wordmark in the footer — the
// header uses a flattened logo image, but the footer's is live text per
// Figma, so this is the one spot in the site that needs it.
const kronaOne = Krona_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-krona-one',
  display: 'swap',
});

// `shrinkToFit` (the property as given — "shrinkTooFit" was a typo) isn't
// part of Next's typed Viewport at all (no such field in ViewportLayout);
// it's not a real browser viewport property either, historically a
// non-standard iOS Safari `<meta>` value. Left out entirely rather than
// added under a misspelled/invalid key, which would fail the TypeScript
// build (`Metadata`'s Viewport type only accepts width/height/
// initialScale/minimumScale/maximumScale/userScalable/viewportFit/
// interactiveWidget).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
  // Full favicon set (ico/svg/png + apple touch + manifest) served as
  // plain static files from public/ — declared explicitly here instead
  // of via the app/favicon.ico file convention so every size/type gets
  // its own <link>, not just a single default icon.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
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
      className={`${dmSans.variable} ${kronaOne.variable}`}
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
              <CustomCursor />
              {children}
            </LenisProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
