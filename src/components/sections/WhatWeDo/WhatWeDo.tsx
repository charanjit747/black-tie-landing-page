'use client';

import React, { useEffect, useRef } from 'react';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { CommonButton } from '@/components/common/Button/CommonButton';
import { ArrowUpRightIcon, ArrowNextIcon } from '@/constants/icons';
import { ASSETS_BASE_URL } from '@/constants/cdn';
import { ConcentricRingsIcon, VerticalLinesSphereIcon, GridSphereIcon } from './WhatWeDoIcons';
import { initWhatWeDoAnimation } from '@/utils/gsapAnimations';

// ── Features (matches Figma) ─────────────────────────────────
const FEATURES = [
  {
    Icon: ConcentricRingsIcon,
    text: 'One platform for issuing, managing, and investing in tokenized property funds and precious metal opportunities',
  },
  {
    Icon: VerticalLinesSphereIcon,
    text: 'BT Asset Hub, developed by Black Tie Digital Group, connects asset managers and investors through secure, compliant, and transparent digital investment infrastructure.',
  },
  {
    Icon: GridSphereIcon,
    text: 'Our mission is simple: make real-world asset investing more accessible, efficient, and scalable through tokenization.',
  },
] as const;

// ── Component ────────────────────────────────────────────────
// The right-side globe panel is a looping video (autoplay/muted/
// playsInline, same as any other silent looping background clip —
// browsers block autoplay otherwise) rather than a static image, and
// is theme-invariant like the "Get a free quote" pill, which keeps its
// dark #1d1d1d/white styling in both themes rather than following the
// light/dark button tokens.
export const WhatWeDo: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ctaWrapRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    return initWhatWeDoAnimation({
      section: sectionRef.current,
      intro: introRef.current,
      features: featureRefs.current,
      cta: ctaWrapRef.current,
      visual: visualRef.current,
    });
  }, []);

  return (
    <section className="what-we-do" ref={sectionRef}>
      <SectionBackgroundLines />
      <div className="what-we-do__row">
        <div className="what-we-do__content">
          <div className="what-we-do__intro" ref={introRef}>
            <span className="what-we-do__tag">
              WHAT WE DO
              <ArrowUpRightIcon size={11} />
            </span>
            <h2 className="what-we-do__heading">
              Bringing Real-World{' '}
              <span className="what-we-do__heading-muted">Assets On-Chain</span>
            </h2>
          </div>

          <div className="what-we-do__features">
            {FEATURES.map(({ Icon, text }, index) => (
              <div
                key={index}
                className="what-we-do__feature"
                ref={(el) => {
                  featureRefs.current[index] = el;
                }}
              >
                <span className="what-we-do__feature-icon">
                  <Icon />
                </span>
                <p className="what-we-do__feature-text">{text}</p>
              </div>
            ))}
          </div>

          {/* Plain wrapper just to give the CTA a ref — CommonButton
              itself doesn't forward one. Not display:contents: GSAP
              needs a real box to animate opacity/transform on, which
              a contents-display element doesn't paint at all. */}
          <div ref={ctaWrapRef} className="what-we-do__cta-wrap">
            <CommonButton
              as="link"
              href="/get-started"
              variant="primary"
              size="lg"
              attachedIcon
              rightIcon={<ArrowNextIcon size={16} />}
              className="what-we-do__cta"
            >
              Get a free quote
            </CommonButton>
          </div>
        </div>

        <video
          className="what-we-do__visual"
          ref={visualRef}
          src={`${ASSETS_BASE_URL}/what-we-do/what-we-do.mp4`}
          poster={`${ASSETS_BASE_URL}/what-we-do/globe.jpg`}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

export default WhatWeDo;
