'use client';

import React, { useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { CommonButton } from '@/components/common/Button/CommonButton';
import { HoverSlideText } from '@/components/common/HoverSlideText';
import { ArrowNextIcon, ArrowUpRightIcon } from '@/constants/icons';
import { ASSETS_BASE_URL } from '@/constants/cdn';
import { initHeroAnimation } from '@/utils/gsapAnimations';

// ── Ticker Config (matches Figma marquee row) ──────────────────
// Each item opens its own product site in a new tab.
// TODO: swap in the real destination URLs once they're available.
const TICKER_ITEMS = [
  { label: 'BT Asset Hub',        href: '/asset-hub' },
  { label: 'BT Treasury',         href: '/treasury' },
  { label: 'BTX Markets',         href: '/markets' },
  { label: 'BTSmart (BT Smart)',  href: '/smart' },
] as const;

// ── Component ────────────────────────────────────────────────
// Full-bleed rounded hero card with the brand background video, headline,
// CTA and a product ticker row — reused as-is across the homepage.

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  // Animation itself lives in utils/gsapAnimations.ts (initHeroAnimation) —
  // this just wires this section's own refs into it and cleans up on unmount.
  useEffect(() => {
    if (!heroRef.current || !line1Ref.current || !line2Ref.current) return;

    const cleanup = initHeroAnimation({
      scope: heroRef.current,
      line1: line1Ref.current,
      line2: line2Ref.current,
    });

    return cleanup;
  }, []);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero__card">
        <video
          className="hero__bg-video"
          poster={`${ASSETS_BASE_URL}/hero/hero-bg.jpg`}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="auto"
          aria-hidden="true"
        >
          <source src={`${ASSETS_BASE_URL}/hero/hero-slide1.mp4`} type="video/mp4" />
        </video>

        <div className="hero__body">
          <Container>
          <div className="hero__content">
            <span className="hero__tag">
              Tokenize. Invest. Own. Unlock access to real-world tokenized assets.
            </span>

            <h1 className="hero__title">
              <span className="hero__title-line" ref={line1Ref}>
                Democratizing Investment
              </span>
              <span className="hero__title-line hero__title-line--muted" ref={line2Ref}>
                Delivering Institutional Standards.
              </span>
            </h1>

            <div className="hero__cta">
              <CommonButton
                as="link"
                href="/get-started"
                variant="secondary"
                size="lg"
                attachedIcon
                rightIcon={<ArrowNextIcon size={16} />}
              >
                Get Started
              </CommonButton>
            </div>
          </div>
          </Container>

          <Container>
          <div className="hero__ticker" aria-label="Black Tie product suite">
            {TICKER_ITEMS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hero__ticker-item hover-slide-trigger"
              >
                <HoverSlideText>
                  <span>{label}</span>
                  <ArrowUpRightIcon size={14} />
                </HoverSlideText>
              </a>
            ))}
          </div>
          </Container>
        </div>
      </div>
    </section>
  );
};

export default Hero;
