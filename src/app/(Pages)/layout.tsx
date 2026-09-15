import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'BlackTie — Premium Digital Experiences',
};

/**
 * (Pages) layout — wraps all pages inside this route group
 * with Header + Footer via MainLayout.
 */
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
