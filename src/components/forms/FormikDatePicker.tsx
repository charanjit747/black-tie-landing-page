'use client';

import React from 'react';
import { useField } from 'formik';
import { AlertCircleIcon, CalendarIcon } from '@/constants/icons';

interface FormikDatePickerProps {
  label?: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  hint?: string;
  className?: string;
}

/**
 * FormikDatePicker — uses native <input type="date">.
 * Replace with a library like react-datepicker if richer UX is needed.
 */
export const FormikDatePicker: React.FC<FormikDatePickerProps> = ({
  label,
  name,
  required = false,
  disabled = false,
  min,
  max,
  hint,
  className = '',
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={name} className="form-group__label">
          {label}
          {required && <span className="required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        <span className="input-wrapper__icon" aria-hidden="true">
          <CalendarIcon size={16} />
        </span>

        <input
          id={name}
          type="date"
          min={min}
          max={max}
          disabled={disabled}
          aria-invalid={hasError}
          className={[
            'form-input',
            'form-input--with-icon',
            hasError ? 'form-input--error' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...field}
        />
      </div>

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

export default FormikDatePicker;
