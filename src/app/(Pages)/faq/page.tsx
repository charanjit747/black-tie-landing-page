import type { Metadata } from 'next';
import { FAQ } from '@/components/sections/FAQ/FAQ';

export const metadata: Metadata = {
  title: 'FAQ',
};

export default function FaqPage() {
  return <FAQ className="faq--page" defaultOpenIndex={0} returnHomeHref="/" showBackgroundLines={false} />;
}
