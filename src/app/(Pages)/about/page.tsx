import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about BlackTie and our mission.',
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container-custom" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
          About <span style={{ color: 'var(--color-brand-accent)' }}>BlackTie</span>
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          BlackTie is a premium Next.js TypeScript boilerplate designed for teams who
          care deeply about code quality, design consistency, and developer experience.
        </p>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
          It ships with Redux Toolkit for state management, a dual light/dark theme
          system, GSAP for animations, React Bootstrap for layout, React Slick for
          carousels, and a unified Formik + Yup form control system — all wired up and
          ready to extend.
        </p>
      </div>
    </section>
  );
}
