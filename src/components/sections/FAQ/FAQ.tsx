'use client';

import React, { useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { CommonButton } from '@/components/common/Button/CommonButton';
import { FaqList } from '@/components/common/FaqList/FaqList';
import { ArrowUpRightIcon } from '@/constants/icons';
import { FAQS } from '@/constants/faqs';
import { initFAQAnimation } from '@/utils/gsapAnimations';

interface FAQProps {
  /** Show only the first N questions (e.g. the homepage teaser). Default: all. */
  limit?: number;
  /** When set, a "Read More" button linking here is shown below the list. */
  readMoreHref?: string;
  /** When set, a "Return to Home" button linking here is shown below the list. */
  returnHomeHref?: string;
  /** Index open on first render; `null` starts with everything collapsed. */
  defaultOpenIndex?: number | null;
  /** Render the shared column-line backdrop. Default: true. */
  showBackgroundLines?: boolean;
  className?: string;
}

// ── Component ────────────────────────────────────────────────
// The questions themselves live in constants/faqs.ts and the accordion
// in common/FaqList, so any page can reuse them. Homepage: the first 4
// plus a "Read More" button to /faq; the /faq page renders all of them.
export const FAQ: React.FC<FAQProps> = ({
  limit,
  readMoreHref,
  returnHomeHref,
  defaultOpenIndex = 1,
  showBackgroundLines = true,
  className = '',
}) => {
  const items = limit ? FAQS.slice(0, limit) : FAQS;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    return initFAQAnimation({
      section: sectionRef.current,
      header: headerRef.current,
      items: itemRefs.current,
    });
  }, []);

  return (
    <section id="faq" className={`faq${className ? ` ${className}` : ''}`} ref={sectionRef}>
      {showBackgroundLines && <SectionBackgroundLines />}
      <Container>
        <div className="faq__header" ref={headerRef}>
          <span className="faq__tag">
            FAQ<span className="faq__tag-lower">s</span>
            <ArrowUpRightIcon size={11} />
          </span>
          <h2 className="faq__heading">
            Frequently <span className="faq__heading-muted">Asked Questions?</span>
          </h2>
        </div>

        <FaqList items={items} defaultOpenIndex={defaultOpenIndex} itemRefs={itemRefs} />

        {(readMoreHref || returnHomeHref) && (
          <div className="faq__more">
            {readMoreHref && (
              <CommonButton as="link" href={readMoreHref} variant="primary" size="lg">
                Read More
              </CommonButton>
            )}
            {returnHomeHref && (
              <CommonButton as="link" href={returnHomeHref} variant="primary" size="lg">
                Return to Home
              </CommonButton>
            )}
          </div>
        )}
      </Container>
    </section>
  );
};

export default FAQ;
