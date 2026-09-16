'use client';

import React from 'react';
import Image from 'next/image';
import Slider, { Settings } from 'react-slick';
import Container from 'react-bootstrap/Container';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { CommonButton } from '@/components/common/Button/CommonButton';
import { ArrowNextIcon } from '@/constants/icons';

// ── Slides (matches Figma "Slides" component, 4 slides) ──────
// Each slide is one complete, pre-flattened export straight out of
// Figma (icon, logo, heading, checklist, everything baked into one
// image) — not live text over a photo. No content/copy is duplicated
// or reconstructed in code, so there's nothing here to get out of sync
// with the design.
const SLIDES = [
  { id: 'asset-hub', image: '/assets/ecosystem/slide-1-asset-hub.jpg', alt: 'Black Tie Asset Hub — Tokenisation & Primary Issuance Platform License' },
  { id: 'markets', image: '/assets/ecosystem/slide-2-markets.jpg', alt: 'Black Tie Markets — Secondary Trading Venue for Tokenised Assets' },
  { id: 'smart', image: '/assets/ecosystem/slide-3-smart.jpg', alt: 'Black Tie Smart — Coming Soon' },
  { id: 'treasury', image: '/assets/ecosystem/slide-4-treasury.jpg', alt: 'Black Tie Treasury — Coming Soon' },
];

// Plain react-slick settings (not the CommonSlider wrapper — that
// component's own defaults are built for horizontal multi-card
// carousels and kept overriding this single-slide vertical slider in
// ways that were hard to fully suppress).
const SLIDER_SETTINGS: Settings = {
  dots: false,
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 4000,
  speed: 800,
  vertical: true,
  verticalSwiping: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  pauseOnHover: false,
  pauseOnFocus: false,
};

// ── Component ────────────────────────────────────────────────
// A vertical, autoplaying slick slider (moves up on each transition —
// slick's own default direction for vertical mode). Each slide is a
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
  return (
    <section className="ecosystem">
      <SectionBackgroundLines />
      <Container>
        <div className="ecosystem__header">
          <h2 className="ecosystem__heading">
            Black Tie Real-World{' '}
            <span className="ecosystem__heading-muted">Asset Infrastructure Ecosystem</span>
          </h2>

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
      </Container>

      <div className="ecosystem__wrap">
        <Slider className="ecosystem__slider" {...SLIDER_SETTINGS}>
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
