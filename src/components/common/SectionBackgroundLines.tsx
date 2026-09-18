'use client';

// ============================================================
// SectionBackgroundLines — shared decorative column-grid backdrop
//
// Figma renders this as a literal stack of 7 divider <div>s repeated
// down one very tall layer spanning several sections at once (#1d1d1d
// borders at 10% opacity, ~1/7-width columns). Reproduced here as 7
// real line elements (see _background-lines.scss) rather than a single
// CSS background-image — each one grows top-to-bottom, left to right,
// as the section scrolls into view (see
// initSectionBackgroundLinesAnimation in utils/gsapAnimations.ts).
// Every section using this component shares the same fractional column
// width against the same full-bleed page width, so the vertical lines
// still land at identical x-positions in every section, reading as one
// continuous grid running down the page exactly like Figma's.
//
// Usage: render as the FIRST child inside any section that needs this
// backdrop, and give that section's own root `position: relative` —
// see .launch-scale for the pattern. Per Figma, this backdrop starts
// right where How It Works ends (not behind it), so LaunchScale is the
// first section that actually uses it.
// ============================================================

import React, { useEffect, useRef } from 'react';
import { initSectionBackgroundLinesAnimation } from '@/utils/gsapAnimations';

const LINE_COUNT = 7;

export const SectionBackgroundLines: React.FC = () => {
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const lines = lineRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (lines.length === 0) return;
    return initSectionBackgroundLinesAnimation(lines);
  }, []);

  return (
    <div className="section-bg-lines" aria-hidden="true">
      {Array.from({ length: LINE_COUNT }).map((_, i) => (
        <div
          key={i}
          className="section-bg-lines__line"
          ref={(el) => {
            lineRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
};

export default SectionBackgroundLines;
