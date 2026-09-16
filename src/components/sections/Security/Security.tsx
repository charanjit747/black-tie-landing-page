'use client';

import React from 'react';
import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import { CommonButton } from '@/components/common/Button/CommonButton';

// ── Compliance Cards (matches Figma) — the middle card ("Hashlock
// Audited") is the only one with the teal accent treatment and a
// "View Detail" link; the other two are the plain dark card.
//
// The icon+title row is ONE exported image per card (icon and text
// flattened together in Figma, background chroma-keyed out to
// transparent), not a separate icon + live text title — a real text
// title at a fixed narrow card width kept getting clipped by
// overflow: hidden no matter how the CSS was tuned, since some titles
// ("DocuSign Integrated") simply don't fit at every breakpoint. Baking
// it into one image sidesteps that entirely: the whole lockup just
// scales down as a unit like any other image. Each keeps its own
// exported aspect ratio (they're not uniform widths). ────────────────
const CARDS = [
  {
    lockup: '/assets/security/sumsub-lockup.png',
    lockupWidth: 679,
    lockupHeight: 73,
    title: 'Sumsub Verified',
    description: 'Automated KYC, KYB, and AML compliance',
    accent: false,
  },
  {
    lockup: '/assets/security/hashlock-lockup.png',
    lockupWidth: 727,
    lockupHeight: 100,
    title: 'Hashlock Audited',
    description: 'Independent smart contract security audits',
    accent: true,
    cta: 'View Detail',
  },
  {
    lockup: '/assets/security/docusign-lockup-v3.png',
    lockupWidth: 820,
    lockupHeight: 99,
    title: 'DocuSign Integrated',
    description: 'Secure and legally binding digital agreements',
    accent: false,
  },
] as const;

// ── Component ────────────────────────────────────────────────
// Deliberately theme-invariant — Figma has this section render as
// (almost) the same near-black card in both Home-Light and Home-Dark,
// unlike every other section on the page. Colors here are hardcoded
// on purpose rather than pulled from the light/dark tokens (the same
// reasoning as the header's always-dark solid state).
export const Security: React.FC = () => {
  return (
    <section className="security">
      <Container>
        <div className="security__card">
          <div className="security__glow" aria-hidden="true" />

          <h2 className="security__heading">
            Security and Compliance at
            <br />
            <span className="security__heading-muted">Institutional Standards</span>
          </h2>

          <div className="security__row">
            {CARDS.map((card) => (
              <div
                key={card.title}
                className={`security__item${card.accent ? ' security__item--accent' : ''}`}
              >
                <div className="security__item-wave" aria-hidden="true" />

                <Image
                  src={card.lockup}
                  alt={card.title}
                  width={card.lockupWidth}
                  height={card.lockupHeight}
                  className="security__item-lockup"
                />
                <p className="security__item-desc">{card.description}</p>

                {'cta' in card && card.cta && (
                  <CommonButton as="button" variant="ghost" size="sm" className="security__item-cta">
                    {card.cta}
                  </CommonButton>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Security;
