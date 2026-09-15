import React from 'react';
import { Header } from '@/components/common/Header/Header';
import { Footer } from '@/components/common/Footer/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  /** Optional extra class names for the <main> element */
  mainClassName?: string;
}

/**
 * MainLayout — Wraps every page with Header + main content + Footer.
 * Used inside (Pages) route group layouts.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  mainClassName = '',
}) => {
  return (
    <>
      <Header />
      <main
        id="main-content"
        className={mainClassName}
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
