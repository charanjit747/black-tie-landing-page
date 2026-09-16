'use client';

import React from 'react';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { CommonButton } from '@/components/common/Button/CommonButton';
import { ArrowUpRightIcon, ArrowNextIcon } from '@/constants/icons';
import { ConcentricRingsIcon, VerticalLinesSphereIcon, GridSphereIcon } from './WhatWeDoIcons';

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
  return (
    <section className="what-we-do">
      <SectionBackgroundLines />
      <div className="what-we-do__row">
        <div className="what-we-do__content">
          <div className="what-we-do__intro">
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
              <div key={index} className="what-we-do__feature">
                <span className="what-we-do__feature-icon">
                  <Icon />
                </span>
                <p className="what-we-do__feature-text">{text}</p>
              </div>
            ))}
          </div>

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

        <video
          className="what-we-do__visual"
          src="/assets/what-we-do/what-we-do.mp4"
          poster="/assets/what-we-do/globe.jpg"
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
