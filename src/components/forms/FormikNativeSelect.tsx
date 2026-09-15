'use client';

import React from 'react';
import { useField } from 'formik';
import { AlertCircleIcon } from '@/constants/icons';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FormikNativeSelectProps {
  label?: string;
  name: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

export const FormikNativeSelect: React.FC<FormikNativeSelectProps> = ({
  label,
  name,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
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

      <select
        id={name}
        disabled={disabled}
        aria-invalid={hasError}
        className={`form-select${hasError ? ' form-select--error' : ''}`}
        {...field}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

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

export default FormikNativeSelect;
