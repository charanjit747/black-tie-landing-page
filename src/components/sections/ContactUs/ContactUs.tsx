'use client';

import React from 'react';
import { Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import { SectionBackgroundLines } from '@/components/common/SectionBackgroundLines';
import { FormikControl } from '@/components/forms/FormikControl';
import { CommonButton } from '@/components/common/Button/CommonButton';
import { ArrowUpRightIcon } from '@/constants/icons';

// ── Form Shape ───────────────────────────────────────────────
// Figma's field order: full name, company name, mobile number,
// message, budget, email — matched exactly below.
interface ContactFormValues {
  fullName: string;
  companyName: string;
  phone: string;
  message: string;
  budget: string;
  email: string;
}

const INITIAL_VALUES: ContactFormValues = {
  fullName: '',
  companyName: '',
  phone: '',
  message: '',
  budget: '',
  email: '',
};

// Digits only, with the punctuation react-phone-input-2 itself inserts
// (spaces/parens/dashes/leading +) still allowed through.
const PHONE_PATTERN = /^\+?[0-9\s()-]+$/;
// Plain digits with an optional decimal part — no currency symbols or
// letters, since this is typed straight into a text field.
const BUDGET_PATTERN = /^\d+(\.\d+)?$/;
// Letters, spaces, apostrophes and hyphens — covers real names
// ("O'Neil", "Anne-Marie") without allowing digits.
const NAME_PATTERN = /^[A-Za-z\s'-]+$/;

const VALIDATION_SCHEMA = Yup.object({
  fullName: Yup.string()
    .trim()
    .matches(NAME_PATTERN, 'Full name can only contain letters')
    .required('Full name is required'),
  companyName: Yup.string().trim().required('Company name is required'),
  phone: Yup.string()
    .trim()
    .matches(PHONE_PATTERN, 'Mobile number can only contain digits')
    .min(7, 'Enter a valid mobile number')
    .required('Mobile number is required'),
  message: Yup.string().trim().required('Please describe your inquiry'),
  budget: Yup.string()
    .trim()
    .matches(BUDGET_PATTERN, 'Budget can only contain numbers')
    .required('Budget is required'),
  email: Yup.string()
    .trim()
    .email('Enter a valid email address (must include @)')
    .required('Email is required'),
});

// Real-time keystroke guard for the fields above — Yup only reports a
// problem on blur/submit, but "shouldn't be able to enter letters" is
// a typing-time constraint, so this blocks the disallowed character
// before it ever lands in the field. Paste is intentionally left
// alone here; Yup's own matches() above still catches a bad paste on
// submit.
const FIELD_KEY_PATTERNS: Record<string, RegExp> = {
  fullName: /^[A-Za-z\s'-]$/,
  phone: /^[0-9+\s()-]$/,
  budget: /^[0-9.]$/,
};

const NON_PRINTING_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'Enter',
]);

const guardFieldKeystrokes = (e: React.KeyboardEvent<HTMLFormElement>) => {
  const target = e.target as HTMLInputElement;
  const pattern = target?.name ? FIELD_KEY_PATTERNS[target.name] : undefined;
  if (!pattern) return;
  if (e.ctrlKey || e.metaKey || e.altKey || NON_PRINTING_KEYS.has(e.key)) return;
  if (!pattern.test(e.key)) {
    e.preventDefault();
  }
};

// ── Component ────────────────────────────────────────────────
// Figma labels this section "Contact Us" (tag + copy both say so) even
// though it sits in the "Join our community" slot in the page flow —
// reproduced with Figma's own content since that's what's actually
// designed here. The globe/orbit illustration is a ~30-layer masked
// SVG composition; per the Ecosystem slider precedent earlier on this
// page, it's exported as one flattened image per theme rather than
// reconstructed live, and swapped via CSS background-image.
export const ContactUs: React.FC = () => {
  const handleSubmit = (
    values: ContactFormValues,
    { resetForm, setSubmitting }: FormikHelpers<ContactFormValues>
  ) => {
    console.log('Contact form submitted:', values);
    resetForm();
    setSubmitting(false);
  };

  return (
    <section className="contact-us">
      <SectionBackgroundLines />
      <Container>
        <div className="contact-us__card">
          <div className="contact-us__header">
            <span className="contact-us__tag">
              Contact Us
              <ArrowUpRightIcon size={11} />
            </span>
            <h2 className="contact-us__heading">
              Reach out via the contact form on the platform for inquiries related to{' '}
              <span className="contact-us__heading-muted">
                investment opportunities, onboarding, and partnerships.
              </span>
            </h2>
          </div>

          <div className="contact-us__body">
            <div className="contact-us__globe" aria-hidden="true" />

            <Formik
              initialValues={INITIAL_VALUES}
              validationSchema={VALIDATION_SCHEMA}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="contact-us__form" noValidate onKeyDown={guardFieldKeystrokes}>
                  <div className="contact-us__fields">
                    <FormikControl control="input" name="fullName" placeholder="Enter full name" />
                    <FormikControl control="input" name="companyName" placeholder="Enter company name" />
                    <FormikControl control="phone" name="phone" placeholder="Enter mobile number" />
                    <FormikControl control="textarea" name="message" placeholder="Describe here" rows={4} />
                    <FormikControl control="input" name="budget" placeholder="Enter budget" />
                    <FormikControl control="input" name="email" type="email" placeholder="Enter email ID" />
                  </div>

                  <CommonButton
                    as="button"
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="contact-us__submit"
                  >
                    Submit
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

export default ContactUs;
