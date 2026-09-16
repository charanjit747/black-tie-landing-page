// ============================================================
// SectionBackgroundLines — shared decorative column-grid backdrop
//
// Figma renders this as a literal stack of 7 divider <div>s repeated
// down one very tall layer spanning several sections at once (#1d1d1d
// borders at 10% opacity, ~1/7-width columns). Reproduced here as a
// single CSS background-image per section instead (see
// _background-lines.scss) — zero extra DOM nodes, and because every
// section using this component shares the same fractional column width
// against the same full-bleed page width, the vertical lines land at
// identical x-positions in every section, so they read as one
// continuous grid running down the page exactly like Figma's, without
// needing one giant cross-section element.
//
// Usage: render as the FIRST child inside any section that needs this
// backdrop, and give that section's own root `position: relative` —
// see .launch-scale for the pattern. Per Figma, this backdrop starts
// right where How It Works ends (not behind it), so LaunchScale is the
// first section that actually uses it.
// ============================================================

import React from 'react';

export const SectionBackgroundLines: React.FC = () => (
  <div className="section-bg-lines" aria-hidden="true" />
);

export default SectionBackgroundLines;
