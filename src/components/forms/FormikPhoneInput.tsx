'use client';

import React, { useEffect, useRef } from 'react';
import { useField, useFormikContext } from 'formik';
import PhoneInput from 'react-phone-input-2';
import { AlertCircleIcon } from '@/constants/icons';

interface FormikPhoneInputProps {
  label?: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  defaultCountry?: string;
  placeholder?: string;
  hint?: string;
  className?: string;
}

export const FormikPhoneInput: React.FC<FormikPhoneInputProps> = ({
  label,
  name,
  required = false,
  disabled = false,
  defaultCountry = 'us',
  placeholder = 'Enter mobile number',
  hint,
  className = '',
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const hasError = meta.touched && !!meta.error;
  const containerRef = useRef<HTMLDivElement>(null);

  // react-phone-input-2 renders the country `.country-list` (and its
  // search box) straight into the DOM only while open — there's no prop
  // to attach an arbitrary data-attribute to it directly, so a
  // MutationObserver catches it the moment it's added. `data-lenis-
  // prevent` is Lenis's own opt-out attribute (see LenisProvider) —
  // without it, Lenis's global wheel/touch handling was capturing
  // scroll gestures meant for this dropdown and scrolling the page
  // behind it instead, even though the list itself has real
  // `overflow-y: scroll` (its default height already fits ~5 rows,
  // scrolling is the whole point of the long country list).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const markPrevent = () => {
      const list = container.querySelector('.country-list');
      list?.setAttribute('data-lenis-prevent', 'true');
    };

    markPrevent();
    const observer = new MutationObserver(markPrevent);
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`form-group ${className}`.trim()} ref={containerRef}>
      {label && (
        <label htmlFor={name} className="form-group__label">
          {label}
          {required && <span className="required" aria-hidden="true">*</span>}
        </label>
      )}

      <PhoneInput
        country={defaultCountry}
        value={field.value}
        onChange={(phone) => setFieldValue(name, `+${phone}`)}
        onBlur={() => setFieldTouched(name, true)}
        disabled={disabled}
        placeholder={placeholder}
        inputProps={{
          id: name,
          name,
          placeholder,
          'aria-invalid': hasError,
          'aria-describedby': hasError ? `${name}-error` : undefined,
        }}
        containerClass={`react-tel-input${hasError ? ' react-tel-input--error' : ''}`}
        enableSearch
        searchPlaceholder="Search country"
        disableSearchIcon
      />

      {hasError && (
        <span id={`${name}-error`} className="form-group__error" role="alert">
          <AlertCircleIcon size={12} aria-hidden="true" />
          {meta.error}
        </span>
      )}

      {hint && !hasError && (
        <span id={`${name}-hint`} className="form-group__hint">
          {hint}
        </span>
      )}
    </div>
  );
};

export default FormikPhoneInput;
