'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import { ArrowUpRightIcon } from '@/constants/icons';
import {
  createHowItWorksInteraction,
  createHowItWorksHoverStripe,
  type HowItWorksInteraction,
  type HowItWorksHoverStripe,
} from '@/utils/gsapAnimations';

// ── Steps Config (matches Figma: How It Works? For Investors) ──────────
// Each step's thumbnail is also the big cursor-follow preview image —
// same asset, just shown larger — exported straight from Figma. `desc`
// is the real hidden description line, pulled from each row's own
// "hover" component variant in Figma (Property 1=Frame 22..28).
const STEPS = [
  {
    index: '01',
    title: 'Register & Complete KYC/KYB',
    desc: 'Create your investor account and complete the verification process.',
    image: '/assets/how-it-works/step-1.png',
  },
  {
    index: '02',
    title: 'Admin Review & Approval',
    desc: 'Our Admin team reviews your application and activates your account upon approval.',
    image: '/assets/how-it-works/step-2.png',
  },
  {
    index: '03',
    title: 'Explore Tokenized Offerings',
    desc: 'Explore tokenized offerings and review their details before investing.',
    image: '/assets/how-it-works/step-3.png',
  },
  {
    index: '04',
    title: 'Subscribe to an Offering',
    desc: 'Choose an offering and submit your investment interest through the platform.',
    image: '/assets/how-it-works/step-4.png',
  },
  {
    index: '05',
    title: 'Wallet Whitelisting',
    desc: 'The Investment Manager reviews your request and whitelists your wallet address on-chain.',
    image: '/assets/how-it-works/step-5.png',
  },
  {
    index: '06',
    title: 'Make Your Investment',
    desc: 'Invest using the supported payment methods after confirming the investment details.',
    image: '/assets/how-it-works/step-6.png',
  },
  {
    index: '07',
    title: 'Token Issuance & Portfolio Management',
    desc: 'Tokens are issued to your approved wallet address, and your investor dashboard is updated in real time.',
    image: '/assets/how-it-works/step-7.png',
  },
] as const;

// Must stay in sync with $bp-desktop-sm in _variables.scss — the width
// below which the whole hover/popout interaction switches off.
const DESKTOP_INTERACTION_BREAKPOINT = 1280;

// ── Component ────────────────────────────────────────────────
// FAQ-style step list — each row's own small thumbnail hides on hover
// while a single shared "big preview" fades in and follows the cursor
// (see createHowItWorksInteraction in utils/gsapAnimations.ts for the
// actual GSAP motion; this component only wires up the DOM refs/events).
export const HowItWorks: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const interactionRef = useRef<HowItWorksInteraction | null>(null);
  const stripeInteractionRef = useRef<HowItWorksHoverStripe | null>(null);
  // Which row is currently "active" (preview showing), and where the
  // cursor actually was the last time it genuinely moved (viewport
  // coordinates) — both read by the scroll check below, which needs
  // them without relying on any further mouse event (see that effect).
  const activeRowIndexRef = useRef<number | null>(null);
  const lastClientPosRef = useRef({ x: 0, y: 0 });
  const [activeImage, setActiveImage] = useState<string | null>(null);
  // The whole hover/popout/scroll-tracking interaction is desktop-only —
  // see $bp-desktop-sm in _variables.scss. Below it the CSS side already
  // hides the thumb/preview/stripe and shows the description permanently
  // (a plain, always-visible layout, per the request), but the JS side
  // still needs its own gate: without it, resizing a desktop window
  // narrower would leave stale mouse handlers armed even though nothing
  // for them to animate is visible any more. `isInteractive` starts true
  // (matches the default/SSR-safe desktop assumption) and is corrected
  // by the matchMedia listener below on mount and on resize.
  const isInteractiveRef = useRef(true);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_INTERACTION_BREAKPOINT}px)`);
    const update = () => {
      isInteractiveRef.current = mql.matches;
    };
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!previewRef.current) return;
    interactionRef.current = createHowItWorksInteraction(previewRef.current);
    return () => interactionRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (!stripeRef.current) return;
    stripeInteractionRef.current = createHowItWorksHoverStripe(stripeRef.current);
    return () => stripeInteractionRef.current?.destroy();
  }, []);

  // Browsers only recompute which element is "hovered" on an actual mouse
  // event — scrolling the content under a completely stationary cursor
  // does not, by itself, fire mouseleave on the row that's no longer
  // there. So without this, the preview just stays visible (scrolling
  // away naturally with the list, per its `position: absolute`) until
  // the next real mouse movement finally tells the browser the hover
  // target changed.
  //
  // This runs every animation frame — not gated on the 'scroll' event —
  // and checks whether the active row's *current* rect still actually
  // contains the last real cursor position. Two earlier versions of this
  // both listened for 'scroll' instead (one checking only "is the row
  // generically visible", one checking this same cursor-containment
  // condition) and neither held up under a fast/flung scroll — however
  // the browser ends up batching or coalescing 'scroll' dispatch during
  // that kind of gesture, tying the check to it inherited that same
  // uncertainty. A plain rAF loop has no such dependency: it runs at
  // display refresh rate unconditionally, so this is checked continuously
  // regardless of how any scroll library or the browser itself schedules
  // scroll notifications. It's cheap (two ref reads + a rect calc, and
  // only while a row is actually active) and never touches any
  // mouse-event handler, so it can't interfere with the cursor-follow.
  useEffect(() => {
    let rafId: number;

    const tick = () => {
      // Covers resizing the window from desktop-width down past the
      // interaction breakpoint while a row happened to be mid-hover —
      // clears it immediately rather than leaving it tracked against a
      // row the CSS side has since display:none'd.
      if (!isInteractiveRef.current) {
        const index = activeRowIndexRef.current;
        const row = index === null ? null : rowRefs.current[index];
        if (row) interactionRef.current?.deactivate(row);
        activeRowIndexRef.current = null;
        rafId = requestAnimationFrame(tick);
        return;
      }

      const index = activeRowIndexRef.current;
      const row = index === null ? null : rowRefs.current[index];

      if (row) {
        const rect = row.getBoundingClientRect();
        const { x, y } = lastClientPosRef.current;
        const stillUnderCursor =
          x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

        if (!stillUnderCursor) {
          interactionRef.current?.deactivate(row);
          activeRowIndexRef.current = null;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Coordinates relative to .how-it-works__list, not the viewport — the
  // preview is `position: absolute` inside it (see _how-it-works.scss),
  // which is what lets it scroll away naturally with the rest of the
  // list instead of needing any manual scroll-tracking to keep it from
  // floating over unrelated sections.
  const toListCoords = (e: React.MouseEvent) => {
    const listRect = listRef.current?.getBoundingClientRect();
    if (!listRect) return { x: e.clientX, y: e.clientY };
    return { x: e.clientX - listRect.left, y: e.clientY - listRect.top };
  };

  const handleMouseEnter = (index: number, image: string) => (e: React.MouseEvent) => {
    if (!isInteractiveRef.current) return;
    setActiveImage(image);
    activeRowIndexRef.current = index;
    lastClientPosRef.current = { x: e.clientX, y: e.clientY };
    const { x, y } = toListCoords(e);
    interactionRef.current?.moveTo(x, y);
    const row = rowRefs.current[index];
    if (row) interactionRef.current?.activate(row);
    if (row && listRef.current) stripeInteractionRef.current?.moveToRow(row, listRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isInteractiveRef.current) return;
    lastClientPosRef.current = { x: e.clientX, y: e.clientY };
    const { x, y } = toListCoords(e);
    interactionRef.current?.moveTo(x, y);
  };

  const handleMouseLeave = (index: number) => () => {
    if (!isInteractiveRef.current) return;
    if (activeRowIndexRef.current === index) activeRowIndexRef.current = null;
    const row = rowRefs.current[index];
    if (row) interactionRef.current?.deactivate(row);
  };

  // Only fades the stripe out once the cursor leaves the whole list —
  // moving between adjacent rows re-targets it instead (see
  // handleMouseEnter), which is what makes it glide rather than flicker.
  const handleListMouseLeave = () => {
    if (!isInteractiveRef.current) return;
    stripeInteractionRef.current?.hide();
  };

  return (
    <section className="how-it-works">
      <Container>
        <div className="how-it-works__header">
          <span className="how-it-works__tag">
            Investor
            <ArrowUpRightIcon size={11} />
          </span>
          <h2 className="how-it-works__heading">
            How It Works?{' '}
            <span className="how-it-works__heading-muted">For Investors</span>
          </h2>
          <p className="how-it-works__subtitle">
            Access verified tokenized opportunities in property, precious metals, private
            markets and alternative investments through a secure primary investment platform
          </p>
        </div>
      </Container>

      <Container>
        <div className="how-it-works__list" ref={listRef} onMouseLeave={handleListMouseLeave}>
          {/* Moving highlight — see createHowItWorksHoverStripe. Sits behind
              the rows (z-index in _how-it-works.scss handles the stacking). */}
          <div className="how-it-works__hover-stripe" ref={stripeRef} aria-hidden="true" />

          {STEPS.map((step, index) => (
            <div
              key={step.index}
              className="how-it-works__row"
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              onMouseEnter={handleMouseEnter(index, step.image)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave(index)}
            >
              <div className="how-it-works__row-text">
                <span className="how-it-works__row-index">[{step.index}]</span>
                <div className="how-it-works__row-copy">
                  <p className="how-it-works__row-title">{step.title}</p>
                  {/* Hidden at rest — GSAP (see createHowItWorksInteraction)
                      reveals it alongside the big preview on hover. */}
                  <p className="how-it-works__row-desc">{step.desc}</p>
                </div>
              </div>

              <div className="how-it-works__row-thumb">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="130px"
                  className="how-it-works__row-thumb-img"
                />
              </div>
            </div>
          ))}

          {/* Shared big preview — one element reused for every row, position
              driven entirely by GSAP; only its image swaps via React state.
              Lives inside .how-it-works__list (not a page-level sibling) so
              its `position: absolute` is anchored to the list, not the
              viewport — that's what lets it scroll away naturally with the
              rest of the list instead of ever floating over another section. */}
          <div className="how-it-works__preview" ref={previewRef} aria-hidden="true">
            {activeImage && (
              <Image
                src={activeImage}
                alt=""
                fill
                sizes="400px"
                className="how-it-works__preview-img"
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
