'use client';

import React, { useState } from 'react';
import type { FaqItem } from '@/constants/faqs';

interface FaqListProps {
  items: readonly FaqItem[];
  /** Index open on first render; `null` starts with everything collapsed. */
  defaultOpenIndex?: number | null;
  /** Optional, filled with each item's element (e.g. for a reveal animation). */
  itemRefs?: React.MutableRefObject<Array<HTMLDivElement | null>>;
}

// Single-open accordion. Expand/collapse uses a CSS grid-rows 0fr→1fr
// transition rather than a measured height — see _faq.scss.
export const FaqList: React.FC<FaqListProps> = ({ items, defaultOpenIndex = 0, itemRefs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="faq__list">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className={`faq__item${isOpen ? ' faq__item--open' : ''}`}
            ref={(el) => {
              if (itemRefs) itemRefs.current[index] = el;
            }}
          >
            <button
              type="button"
              className="faq__question"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="faq__question-text">{faq.question}</span>
              <span className="faq__toggle" aria-hidden="true">
                <span className="faq__toggle-bar faq__toggle-bar--h" />
                <span className="faq__toggle-bar faq__toggle-bar--v" />
              </span>
            </button>

            <div className="faq__answer-rows">
              <div className="faq__answer-inner">
                <div className="faq__answer">
                  {faq.answer.split('\n').map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqList;
