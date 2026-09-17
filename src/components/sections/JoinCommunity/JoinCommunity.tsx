'use client';

import React, { useEffect, useRef } from 'react';
import { Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { FormikControl } from '@/components/forms/FormikControl';
import { CommonButton } from '@/components/common/Button/CommonButton';
import { initJoinCommunityAnimation } from '@/utils/gsapAnimations';

// ── Form Shape ───────────────────────────────────────────────
interface SubscribeFormValues {
  email: string;
}

const INITIAL_VALUES: SubscribeFormValues = { email: '' };

const VALIDATION_SCHEMA = Yup.object({
  email: Yup.string()
    .trim()
    .email('Enter a valid email address (must include @)')
    .required('Email is required'),
});

// ── Component ────────────────────────────────────────────────
// The section right above Contact Us — a single-field newsletter
// signup. Figma's own heading/copy ("Join Our Community") both match
// the page-flow slot, unlike Contact Us a section down, so it's used
// verbatim here with no naming ambiguity.
export const JoinCommunity: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLDivElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    return initJoinCommunityAnimation({
      section: sectionRef.current,
      heading: headingRef.current,
      subhead: subheadRef.current,
      form: formWrapRef.current,
    });
  }, []);

  const handleSubmit = (
    values: SubscribeFormValues,
    { resetForm, setSubmitting }: FormikHelpers<SubscribeFormValues>
  ) => {
    console.log('Newsletter subscribe:', values);
    resetForm();
    setSubmitting(false);
  };

  return (
    <section className="join-community" ref={sectionRef}>
      <SectionBackgroundLines />
      <Container>
        <div className="join-community__inner">
          <h2 className="join-community__heading" ref={headingRef}>Join Our Community</h2>

          <div className="join-community__subhead" ref={subheadRef}>
            <p className="join-community__tagline">
              Where Real Assets <span className="join-community__tagline-muted">Meet Digital Markets</span>
            </p>
            <p className="join-community__desc">
              Stay informed on new investment opportunities, platform updates, and the future of
              tokenized real-world assets.
            </p>
          </div>

          <div ref={formWrapRef} className="join-community__form-wrap">
          <Formik initialValues={INITIAL_VALUES} validationSchema={VALIDATION_SCHEMA} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="join-community__form" noValidate>
                <FormikControl
                  control="input"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="join-community__input"
                />
                <CommonButton
                  as="button"
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="join-community__submit"
                >
                  Subscribe Now
                </CommonButton>
              </Form>
            )}
          </Formik>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default JoinCommunity;
