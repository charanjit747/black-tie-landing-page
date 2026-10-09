'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Slider, { Settings } from 'react-slick';
import Container from 'react-bootstrap/Container';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { CommonButton } from '@/components/common/Button/CommonButton';
import { ArrowNextIcon } from '@/constants/icons';
import { ASSETS_BASE_URL } from '@/constants/cdn';
import { initEcosystemTitleAnimation } from '@/utils/gsapAnimations';

// ── Slides (matches Figma "Slides" component, 4 slides) ──────
// Each slide is one complete, pre-flattened export straight out of
// Figma (icon, logo, heading, checklist, everything baked into one
// image) — not live text over a photo. No content/copy is duplicated
// or reconstructed in code, so there's nothing here to get out of sync
// with the design.
const SLIDES = [
  { id: 'asset-hub', image: `${ASSETS_BASE_URL}/ecosystem/slide-1-asset-hub.jpg`, alt: 'Black Tie Asset Hub — Tokenisation & Primary Issuance Platform License' },
  { id: 'markets', image: `${ASSETS_BASE_URL}/ecosystem/slide-2-markets.jpg`, alt: 'Black Tie Markets — Secondary Trading Venue for Tokenised Assets' },
  { id: 'smart', image: `${ASSETS_BASE_URL}/ecosystem/slide-3-smart.jpg`, alt: 'Black Tie Smart — Coming Soon' },
  { id: 'treasury', image: `${ASSETS_BASE_URL}/ecosystem/slide-4-treasury.jpg`, alt: 'Black Tie Treasury — Coming Soon' },
];

// Plain react-slick settings (not the CommonSlider wrapper — that
// component's own defaults are built for horizontal multi-card
// carousels and kept overriding this single-slide slider in ways that
// were hard to fully suppress).
const SLIDER_SETTINGS: Settings = {
  dots: false,
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 4000,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  pauseOnHover: false,
  pauseOnFocus: false,
};

// Dots are mobile-only (≤767px, this project's `md` breakpoint) —
// switched on in the component below from this media query. Not
// react-slick's own `responsive` option: in 0.31 it only reacts when the
// viewport crosses a breakpoint, never applying the matching one on
// first load, so a page opened at phone width got no dots at all.
const MOBILE_QUERY = '(max-width: 767px)';

function subscribeMobile(onChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

const getIsMobile = () => window.matchMedia(MOBILE_QUERY).matches;
const getIsMobileServer = () => false;

// ── Component ────────────────────────────────────────────────
// An autoplaying slick slider that slides left on each transition
// (slick's default horizontal direction). Each slide is a
// fixed-height box (not sized off the image), with a shimmer
// placeholder permanently underneath the image — so the slider's own
// height calculation never depends on image load timing, and a
// slow/failed image load never leaves a blank or collapsed slide.
//
// The title row above it (missed on the first pass — it lives on its
// own "Container" node in Figma, a sibling positioned right before the
// Slides instance, not part of the instance itself) sits in the site's
// standard content-width Container (Figma: ~100px gutters at a 1920
// canvas, matching every other section's title row) — a narrower width
// than the near-full-bleed slider below it (~24px gutters), so the two
// use separate wrappers rather than sharing .ecosystem__wrap. The CTA
// is genuinely theme-reactive, unlike What We Do's a few sections up:
// dark pill on light theme, light pill on dark theme — see
// .ecosystem__cta.
export const Ecosystem: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ctaWrapRef = useRef<HTMLDivElement>(null);
  const isMobile = useSyncExternalStore(subscribeMobile, getIsMobile, getIsMobileServer);

  useEffect(() => {
    if (!sectionRef.current) return;
    return initEcosystemTitleAnimation({
      section: sectionRef.current,
      heading: headingRef.current,
      cta: ctaWrapRef.current,
    });
  }, []);

  return (
    <section id="ecosystem" className="ecosystem" ref={sectionRef}>
      <SectionBackgroundLines />
      <Container>
        <div className="ecosystem__header">
          <h2 className="ecosystem__heading" ref={headingRef}>
            Black Tie Real-World{' '}
            <span className="ecosystem__heading-muted">Asset Infrastructure Ecosystem</span>
          </h2>

          <div ref={ctaWrapRef} className="ecosystem__cta-wrap">
            <CommonButton
              as="link"
              href="/get-started"
              variant="primary"
              size="lg"
              attachedIcon
              rightIcon={<ArrowNextIcon size={16} />}
              className="ecosystem__cta"
            >
              Get a free quote
            </CommonButton>
          </div>
        </div>
      </Container>

      <div className="ecosystem__wrap">
        <Slider className="ecosystem__slider" {...SLIDER_SETTINGS} dots={isMobile}>
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className="ecosystem__slide">
              <div className="ecosystem__slide-media">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Ecosystem;
