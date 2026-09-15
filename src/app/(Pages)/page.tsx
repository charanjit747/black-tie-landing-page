import { Hero } from '@/components/sections/Hero/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks/HowItWorks';

// ── Page Component ────────────────────────────────────────────
// Homepage — built section by section from Figma. Header + Hero +
// How It Works (For Investors) exist right now; the rest (Partners,
// Slides, Footer, etc.) are added next, one at a time.

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
    </>
  );
}
