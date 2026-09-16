import { Hero } from '@/components/sections/Hero/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks/HowItWorks';
import { LaunchScale } from '@/components/sections/LaunchScale/LaunchScale';
import { DashboardShowcase } from '@/components/sections/DashboardShowcase/DashboardShowcase';
import { Stats } from '@/components/sections/Stats/Stats';
import { Partners } from '@/components/sections/Partners/Partners';
import { Security } from '@/components/sections/Security/Security';

// ── Page Component ────────────────────────────────────────────
// Homepage — built section by section from Figma. Header + Hero + How
// It Works (For Investors) + Launch and Scale (Asset Manager) + the
// Dashboard/BTX Markets/Investment Orders/Payment Screen sticky
// showcase + the Stats trust bar + the Partners logo marquee + the
// Security and Compliance banner exist right now; the rest (Slides,
// Footer, etc.) are added next, one at a time.

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <LaunchScale />
      <DashboardShowcase />
      <Stats />
      <Partners />
      <Security />
    </>
  );
}
