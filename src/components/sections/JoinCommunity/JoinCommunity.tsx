'use client';

import React from 'react';
import { Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { FormikControl } from '@/components/forms/FormikControl';
import { CommonButton } from '@/components/common/Button/CommonButton';

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
  const handleSubmit = (
    values: SubscribeFormValues,
    { resetForm, setSubmitting }: FormikHelpers<SubscribeFormValues>
  ) => {
    console.log('Newsletter subscribe:', values);
    resetForm();
    setSubmitting(false);
  };

  return (
    <section className="join-community">
      <SectionBackgroundLines />
      <Container>
        <div className="join-community__inner">
          <h2 className="join-community__heading">Join Our Community</h2>

          <div className="join-community__subhead">
            <p className="join-community__tagline">
              Where Real Assets <span className="join-community__tagline-muted">Meet Digital Markets</span>
            </p>
            <p className="join-community__desc">
              Stay informed on new investment opportunities, platform updates, and the future of
              tokenized real-world assets.
            </p>
          </div>

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
      </Container>
    </section>
  );
};

export default JoinCommunity;
