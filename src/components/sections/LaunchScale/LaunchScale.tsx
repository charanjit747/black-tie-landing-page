'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import { ArrowUpRightIcon } from '@/constants/icons';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { initLaunchScaleAnimation } from '@/utils/gsapAnimations';
import {
  RegisterKybIcon,
  AdminReviewIcon,
  CreateOfferingIcon,
  SmartContractIcon,
  PrimaryListingIcon,
} from './LaunchScaleIcons';

// ── Steps Config (matches Figma: Launch and Scale Real World Asset
// Tokenized Offerings — the Asset Manager card list) ────────────────
const STEPS = [
  {
    title: 'Register & Complete KYB',
    desc: 'Create your account and complete the KYB verification process.',
    Icon: RegisterKybIcon,
  },
  {
    title: 'Admin Review & Approval',
    desc: 'Our Admin team reviews your application and grants access to the offering module upon approval.',
    Icon: AdminReviewIcon,
  },
  {
    title: 'Create & Submit Offering',
    desc: 'Provide the details of the asset you wish to tokenize and submit the offering request.',
    Icon: CreateOfferingIcon,
  },
  {
    title: 'Smart Contract Deployment',
    desc: 'Following approval, the Admin deploys the token smart contract on-chain and token address gets generated after successful completion.',
    Icon: SmartContractIcon,
  },
  {
    title: 'Primary Issuance Listing',
    desc: 'Your offering is listed on the Primary Issuance Platform for eligible investors to discover and invest in.',
    Icon: PrimaryListingIcon,
  },
] as const;

// ── Component ────────────────────────────────────────────────
// Theme-invariant dark panel on the left (identical in Home-Light and
// Home-Dark per Figma — same treatment as the Hero card) alongside a
// theme-reactive 5-step card list on the right (see
// initLaunchScaleAnimation in utils/gsapAnimations.ts for the actual
// GSAP scroll-reveal; this component only wires up the DOM refs).
export const LaunchScale: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!sectionRef.current || !panelRef.current) return;

    const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    const cleanup = initLaunchScaleAnimation({
      section: sectionRef.current,
      panel: panelRef.current,
      cards,
    });

    return cleanup;
  }, []);

  return (
    <section className="launch-scale" ref={sectionRef}>
      <SectionBackgroundLines />
      <Container>
        <div className="launch-scale__grid">
          <div className="launch-scale__panel" ref={panelRef}>
            <div className="launch-scale__panel-bg">
              <Image
                src="/assets/launch-scale/bg-graphic.jpg"
                alt=""
                fill
                sizes="(min-width: 992px) 41vw, 100vw"
              />
            </div>

            <div className="launch-scale__panel-copy">
              <span className="launch-scale__tag">
                Asset Manager Section
                <ArrowUpRightIcon size={11} />
              </span>
              <h2 className="launch-scale__heading">
                Launch and Scale Real World Asset{' '}
                <span className="launch-scale__heading-muted">Tokenized Offerings</span>
              </h2>
              <p className="launch-scale__subtitle">
                Tokenize your assets, streamline fundraising, and connect with verified global
                investors through a compliant issuance platform.
              </p>
            </div>
          </div>

          <div className="launch-scale__list">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="launch-scale__card"
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
              >
                <div className="launch-scale__card-icon">
                  <step.Icon />
                </div>
                <div className="launch-scale__card-copy">
                  <h3 className="launch-scale__card-title">{step.title}</h3>
                  <p className="launch-scale__card-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LaunchScale;
