'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { ASSETS_BASE_URL } from '@/constants/cdn';
import { initDashboardShowcaseAnimation } from '@/utils/gsapAnimations';

// ── Steps Config (matches Figma: Dashboard / BTX Markets / Investment
// Orders / Payment Screen) ──────────────────────────────────────────
const STEPS = [
  {
    index: '01',
    title: 'Dashboard',
    titleMuted: null,
    image: `${ASSETS_BASE_URL}/dashboard-showcase/dashboard.jpg`,
  },
  {
    index: '02',
    title: 'BTX',
    titleMuted: 'Markets',
    image: `${ASSETS_BASE_URL}/dashboard-showcase/btx-markets.jpg`,
  },
  {
    index: '03',
    title: 'Investment',
    titleMuted: 'Orders',
    image: `${ASSETS_BASE_URL}/dashboard-showcase/investment-orders.jpg`,
  },
  {
    index: '04',
    title: 'Payment Screen',
    titleMuted: '+ E-Signature',
    image: `${ASSETS_BASE_URL}/dashboard-showcase/payment-screen.jpg`,
  },
] as const;

// ── Component ────────────────────────────────────────────────
// Same two-column design as before (heading text on the left, its own
// screenshot on the right, one row per step) but no sticky/pinned
// column and no crossfade any more — the whole section just scrolls
// normally, a single grid auto-placing each heading/image pair into
// its own row. Each screenshot instead plays its own one-time 3D tilt
// as it scrolls into view — the same technique used by
// https://agntix-next.vercel.app/creative-agency's "OUR RECENT
// PROJECTS" thumbnails. The GSAP-animated element is
// .dashboard-showcase__item-image-card — the whole card, gradient
// border frame included, not just the cropped image inside it — so the
// frame tilts along with the screenshot as one rigid piece rather than
// staying static while the image moves inside it. See
// initDashboardShowcaseAnimation in utils/gsapAnimations.ts for the
// actual GSAP/ScrollTrigger work.
export const DashboardShowcase: React.FC = () => {
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const cards = cardRefs.current.filter((el): el is HTMLElement => el !== null);
    if (cards.length === 0) return;

    return initDashboardShowcaseAnimation({ cards });
  }, []);

  return (
    <section className="dashboard-showcase">
      <SectionBackgroundLines />
      <Container>
        <div className="dashboard-showcase__grid">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.index}>
              <div className="dashboard-showcase__item">
                <p className="dashboard-showcase__index">{step.index}</p>
                <h3 className="dashboard-showcase__title">
                  {step.title}
                  {step.titleMuted && (
                    <>
                      {/* The trailing space (before the <br/>, so it's
                          invisible at the line break) is what keeps
                          "BTX Markets" etc. reading as one line with a
                          gap once <br/> is hidden — see
                          .dashboard-showcase__title br below. */}
                      {' '}
                      <br />
                      <span className="dashboard-showcase__title-muted">{step.titleMuted}</span>
                    </>
                  )}
                </h3>
              </div>

              <div className="dashboard-showcase__item-image">
                <div
                  className="dashboard-showcase__item-image-card"
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                >
                  <div className="dashboard-showcase__item-image-inner">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={1195}
                      height={787}
                      sizes="(min-width: 1280px) 70vw, 100vw"
                    />
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default DashboardShowcase;
