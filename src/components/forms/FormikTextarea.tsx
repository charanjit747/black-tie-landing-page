'use client';

import React from 'react';
import { useField } from 'formik';
import { AlertCircleIcon } from '@/constants/icons';

interface FormikTextareaProps {
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  hint?: string;
  className?: string;
}

export const FormikTextarea: React.FC<FormikTextareaProps> = ({
  label,
  name,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
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

      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${name}-error` : hint ? `${name}-hint` : undefined
        }
        className={`form-textarea${hasError ? ' form-textarea--error' : ''}`}
        {...field}
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

export default FormikTextarea;
