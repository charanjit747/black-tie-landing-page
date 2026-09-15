import React from 'react';

interface HoverSlideTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * HoverSlideText — wraps inline content (label + any icon) so that on
 * hover it slides up and out while an identical copy slides up into its
 * place, then slides back down when the hover ends. Reused across nav
 * links and CommonButton labels for one consistent premium hover language.
 *
 * The hover trigger comes from the parent interactive element (an `a` or
 * `button` ancestor) via the `.hover-slide` CSS, so this component only
 * needs to be dropped in as the label/content wrapper.
 */
export const HoverSlideText: React.FC<HoverSlideTextProps> = ({ children, className = '' }) => (
  <span className={`hover-slide${className ? ` ${className}` : ''}`}>
    <span className="hover-slide__track">
      <span className="hover-slide__row">{children}</span>
      <span className="hover-slide__row" aria-hidden="true">
        {children}
      </span>
    </span>
  </span>
);

export default HoverSlideText;
