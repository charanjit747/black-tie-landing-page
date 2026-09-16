'use client';

import React, { useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import { initStatsCounterAnimation } from '@/utils/gsapAnimations';

// ── Stats Config (matches Figma: Asset Offerings / Target Asset Value /
// KYC-KYB Verified Participation / Supported Asset Classes) — each
// `format` renders the counted value exactly as Figma has it at 0 and at
// its final value (a leading-zero pad for "03", a "$"/"M+" wrap for
// "$5M+", etc.) ──────────────────────────────────────────────────────
const STATS = [
  {
    value: 10,
    label: 'Asset Offerings',
    format: (n: number) => `${Math.round(n)}+`,
  },
  {
    value: 5,
    label: 'Target Asset Value',
    format: (n: number) => `$${Math.round(n)}M+`,
  },
  {
    value: 100,
    label: 'KYC/KYB Verified Participation',
    format: (n: number) => `${Math.round(n)}%`,
  },
  {
    value: 3,
    label: 'Supported Asset Classe',
    format: (n: number) => String(Math.round(n)).padStart(2, '0'),
  },
] as const;

// ── Component ────────────────────────────────────────────────
// A trust bar: each number counts up from 0 to its real value once the
// card scrolls into view, then never repeats (see
// initStatsCounterAnimation in utils/gsapAnimations.ts — it writes
// straight to the DOM node's textContent on every tick rather than
// through React state, since a 60fps count-up has no business
// re-rendering a component on every frame). The glow background swaps
// per theme in pure CSS (see .stats__glow) rather than two <Image>
// elements, so only the active theme's file is ever requested.
export const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const items: Array<{ el: HTMLParagraphElement; value: number; format: (n: number) => string }> = [];
    STATS.forEach((stat, index) => {
      const el = numberRefs.current[index];
      if (el) items.push({ el, value: stat.value, format: stat.format });
    });

    if (items.length === 0) return;

    const cleanup = initStatsCounterAnimation({ section: sectionRef.current, items });

    return cleanup;
  }, []);

  return (
    <section className="stats" ref={sectionRef}>
      <div className="stats__wrap">
        <div className="stats__card">
          <div className="stats__glow" aria-hidden="true" />
          <Container>
            <div className="stats__row">
              {STATS.map((stat, index) => (
                <div key={stat.label} className="stats__item">
                  <p
                    className="stats__number"
                    ref={(el) => {
                      numberRefs.current[index] = el;
                    }}
                  >
                    {stat.format(0)}
                  </p>
                  <p className="stats__label">{stat.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
};

export default Stats;
