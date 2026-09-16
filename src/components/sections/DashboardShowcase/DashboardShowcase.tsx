'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { initDashboardShowcaseAnimation } from '@/utils/gsapAnimations';

// ── Steps Config (matches Figma: Dashboard / BTX Markets / Investment
// Orders / Payment Screen) ──────────────────────────────────────────
const STEPS = [
  {
    index: '01',
    title: 'Dashboard',
    titleMuted: null,
    image: '/assets/dashboard-showcase/dashboard.jpg',
  },
  {
    index: '02',
    title: 'BTX',
    titleMuted: 'Markets',
    image: '/assets/dashboard-showcase/btx-markets.jpg',
  },
  {
    index: '03',
    title: 'Investment',
    titleMuted: 'Orders',
    image: '/assets/dashboard-showcase/investment-orders.jpg',
  },
  {
    index: '04',
    title: 'Payment Screen',
    titleMuted: '+ E-Signature',
    image: '/assets/dashboard-showcase/payment-screen.jpg',
  },
] as const;

// ── Component ────────────────────────────────────────────────
// Desktop (≥1280px): a GSAP ScrollTrigger pins the right column (a
// full-viewport-height wrapper, flex-centered — see
// .dashboard-showcase__media) starting when the list reaches the top
// of the viewport, and — critically — ending exactly when the LAST
// heading reaches the vertical center of the viewport (tied directly to
// that heading via `endTrigger`/`end: 'center center'`, not an
// approximated scroll distance), so the section only becomes scrollable
// again once the last slide is centered against the image. Crossfades
// between the 4 stacked images the instant each item's own heading
// enters the bottom 20% of the viewport (see
// initDashboardShowcaseAnimation in utils/gsapAnimations.ts for the
// actual ScrollTrigger work — this component only wires up the DOM
// refs). Below 1280px the animation doesn't run at all — see
// .dashboard-showcase__item-image, a plain inline image per item
// instead.
export const DashboardShowcase: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!listRef.current || !mediaRef.current) return;

    const headings = headingRefs.current.filter((el): el is HTMLDivElement => el !== null);
    const images = imageRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (headings.length === 0 || images.length === 0) return;

    const cleanup = initDashboardShowcaseAnimation({
      list: listRef.current,
      media: mediaRef.current,
      headings,
      images,
    });

    return cleanup;
  }, []);

  return (
    <section className="dashboard-showcase">
      <SectionBackgroundLines />
      <Container>
        <div className="dashboard-showcase__grid">
          <div className="dashboard-showcase__list" ref={listRef}>
            {STEPS.map((step, index) => (
              <div key={step.index} className="dashboard-showcase__item">
                {/* The crossfade trigger — deliberately just the heading
                    text, not the whole (much taller) item box, so the
                    fade fires when the heading itself reaches the
                    bottom 20% of the viewport, not whenever the item's
                    own top happens to. */}
                <div
                  className="dashboard-showcase__heading"
                  ref={(el) => {
                    headingRefs.current[index] = el;
                  }}
                >
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

                {/* Mobile/tablet fallback — hidden at ≥1280px, where the
                    sticky media column to the right takes over instead. */}
                <div className="dashboard-showcase__item-image">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={1195}
                    height={787}
                    sizes="100vw"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-showcase__media" ref={mediaRef} aria-hidden="true">
            <div className="dashboard-showcase__media-inner">
              {STEPS.map((step, index) => (
                <div
                  key={step.index}
                  className="dashboard-showcase__image"
                  ref={(el) => {
                    imageRefs.current[index] = el;
                  }}
                >
                  <div className="dashboard-showcase__image-inner">
                    <Image src={step.image} alt="" fill sizes="(min-width: 1280px) 70vw, 0px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DashboardShowcase;
