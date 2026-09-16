'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { ArrowUpRightIcon } from '@/constants/icons';
import { initPartnersMarqueeAnimation } from '@/utils/gsapAnimations';

// ── Partner Logos (matches Figma marquee order) — each is trimmed to
// its own bounding box then normalized to a 70px (2x) display height,
// so widths vary by logo instead of being stretched to match. Arizore
// is the one exception: its source is a pre-colored white silhouette
// (Figma builds it via a CSS mask, recoloring per theme), not a
// naturally-colored logo, so it alone gets the `--mono` treatment —
// see .partners__logo--mono in _partners.scss. ──────────────────────
const PARTNERS = [
  { name: 'Blockly', src: '/assets/partners/blockly.png', width: 256, height: 70 },
  { name: 'Architect', src: '/assets/partners/architect.png', width: 287, height: 70 },
  { name: 'Techlify', src: '/assets/partners/techlify.png', width: 284, height: 70 },
  { name: 'Cloudly', src: '/assets/partners/cloudly.png', width: 344, height: 70 },
  { name: 'Logo', src: '/assets/partners/placeholder-logo.png', width: 306, height: 70 },
  { name: 'Sisyphus', src: '/assets/partners/sisyphus.png', width: 246, height: 70 },
  { name: 'Hashlock', src: '/assets/partners/hashlock.png', width: 354, height: 70 },
  { name: 'Zendesk', src: '/assets/partners/zendesk.png', width: 323, height: 70 },
  { name: 'Kokoda Holdings', src: '/assets/partners/kokoda.png', width: 356, height: 70 },
  { name: 'Antier', src: '/assets/partners/antier.png', width: 209, height: 70 },
  { name: 'Docusign', src: '/assets/partners/docusign.png', width: 347, height: 70 },
  { name: 'Sumsub', src: '/assets/partners/sumsub.png', width: 300, height: 70 },
  { name: 'Arizore', src: '/assets/partners/arizore.png', width: 440, height: 70, mono: true },
] as const;

// ── Component ────────────────────────────────────────────────
// The track renders the 13 logos twice back to back, then GSAP loops
// it from xPercent 0 to -50 forever (see initPartnersMarqueeAnimation
// in utils/gsapAnimations.ts) — since the two halves are identical,
// -50% lands exactly back on the start of the second half, which is
// pixel-identical to the first, so the loop point is invisible: no
// jump, no flicker, no reset. xPercent (not a pixel translateX) is
// relative to the track's own rendered width, so it stays correct at
// every breakpoint with no resize handling needed.
export const Partners: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    return initPartnersMarqueeAnimation(trackRef.current);
  }, []);

  return (
    <section className="partners">
      <SectionBackgroundLines />
      <Container>
        <div className="partners__header">
          <span className="partners__tag">
            OUR PARTNERS
            <ArrowUpRightIcon size={14} />
          </span>
          <h2 className="partners__heading">
            Trusted by Industry-
            <span className="partners__heading-muted">Leading Partners</span>
          </h2>
          <p className="partners__desc">
            BlackTie collaborates with leading organizations across security, compliance,
            technology, and capital markets to support the tokenization and distribution of
            real-world assets.
          </p>
        </div>

        <div className="partners__marquee">
          <div className="partners__track" ref={trackRef}>
            {[0, 1].map((copy) => (
              <div className="partners__set" aria-hidden={copy === 1} key={copy}>
                {PARTNERS.map((partner) => (
                  <div key={`${copy}-${partner.name}`} className="partners__logo-wrap">
                    <Image
                      src={partner.src}
                      alt={copy === 0 ? partner.name : ''}
                      width={partner.width}
                      height={partner.height}
                      className={`partners__logo${'mono' in partner && partner.mono ? ' partners__logo--mono' : ''}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Partners;
