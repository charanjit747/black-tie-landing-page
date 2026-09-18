import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommonButton } from '@/components/common/Button/CommonButton';

export const metadata = {
  title: '404 — Page Not Found | BlackTie',
  description: 'The page you are looking for does not exist.',
};

/**
 * Custom 404 Not Found Page — adopts the active dual theme (Light / Dark)
 * via MainLayout and CSS custom properties.
 */
export default function NotFound() {
  return (
    <MainLayout>
      <section
        className="section"
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundColor: 'var(--color-bg-primary)',
          color: 'var(--color-text-primary)',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        <div className="container-custom" style={{ maxWidth: '540px' }}>
          {/* 404 Badge */}
          <div
            style={{
              fontSize: 'clamp(5rem, 12vw, 8rem)',
              fontWeight: 900,
              lineHeight: 1,
              color: 'var(--color-brand-accent)',
              marginBottom: '1rem',
              letterSpacing: '-0.04em',
            }}
          >
            404
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
            }}
          >
            Page Not Found
          </h1>

          <p
            style={{
              fontSize: '1.6rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            Sorry, the page you are looking for doesn&apos;t exist or has been moved.
          </p>

          <CommonButton as="link" href="/" variant="primary" size="lg">
            Back to Home
          </CommonButton>
        </div>
      </section>
    </MainLayout>
  );
}
