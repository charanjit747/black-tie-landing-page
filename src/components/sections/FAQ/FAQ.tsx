'use client';

import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { ArrowUpRightIcon } from '@/constants/icons';

// ── Questions (matches Figma exactly) ─────────────────────────
// Figma only has real answer copy authored for the 2nd question (the
// one left open by default) — the other 3 are question-only rows with
// no answer container at all in the file, not just a hidden/collapsed
// one. Rather than fabricate specific claims about a live investment
// platform's payment methods/asset eligibility, those three use the
// same "Coming Soon" placeholder convention already established
// elsewhere on this page (see the Ecosystem slider's Smart/Treasury
// slides) until real copy is provided.
const FAQS = [
  {
    question: 'What is the BT Asset Hub?',
    answer: 'Content for this answer is coming soon.',
  },
  {
    question: 'Who can invest in the BT Asset Hub?',
    answer:
      "Retail, wholesale, and institutional investors can invest, each fund has its own approved investor qualification which can be found in the fund's detail page.  Retail Investor - An individual investing their own funds without meeting specific wealth or income thresholds. Wholesale Investor - An individual or entity that meets certain financial thresholds, such as having net assets of over AUD 2.5 million or a gross income of at least AUD 250,000 per annum.",
  },
  {
    question: 'What types of assets can be tokenized on the BT Asset Hub?',
    answer: 'Content for this answer is coming soon.',
  },
  {
    question: 'What payment methods are accepted for investments?',
    answer: 'Content for this answer is coming soon.',
  },
] as const;

// ── Component ────────────────────────────────────────────────
// A single-open accordion (matches Figma's default state — the 2nd
// item open, the rest collapsed). Expand/collapse uses a CSS grid-rows
// 0fr→1fr transition rather than a measured/animated height (see the
// react-slick height saga a few sections up — anything that needs a
// pixel height measured in JS is fragile across breakpoints); grid-rows
// animates to "however tall the content actually is" with no
// measurement step at all.
export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  return (
    <section className="faq">
      <SectionBackgroundLines />
      <Container>
        <div className="faq__header">
          <span className="faq__tag">
            FAQ<span className="faq__tag-lower">s</span>
            <ArrowUpRightIcon size={11} />
          </span>
          <h2 className="faq__heading">
            Frequently <span className="faq__heading-muted">Asked Questions?</span>
          </h2>
        </div>

        <div className="faq__list">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className={`faq__item${isOpen ? ' faq__item--open' : ''}`}>
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
                    <p className="faq__answer">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default FAQ;
