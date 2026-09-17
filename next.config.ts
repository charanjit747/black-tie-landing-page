import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── SCSS / Sass ─────────────────────────────────────────────
  // Next.js handles SCSS natively when `sass` is installed.
  // No extra config needed, but you can add sass options here:
  sassOptions: {
    // includePaths: ['./src/styles'],
  },

  // ── Images ──────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // All static assets (see src/constants/cdn.ts) now serve from here
      // instead of public/assets/.
      { protocol: 'https', hostname: 'd354qrbjihw1mn.cloudfront.net' },
    ],
  },

  // ── Headers (Security) ──────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // ── Compiler ────────────────────────────────────────────────
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // ── Experimental ────────────────────────────────────────────
  experimental: {
    // optimizeCss: true, // Uncomment to enable CSS optimization
  },
};

export default nextConfig;
