'use client';

import React from 'react';
import { useField } from 'formik';
import { AlertCircleIcon } from '@/constants/icons';

interface FormikInputProps {
  label?: string;
  name: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  /** Icon rendered on the left inside the input */
  leftIcon?: React.ReactNode;
  /** Element rendered on the right inside the input (e.g. eye toggle) */
  rightElement?: React.ReactNode;
  className?: string;
}

export const FormikInput: React.FC<FormikInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  hint,
  leftIcon,
  rightElement,
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
        {leftIcon && (
          <span className="input-wrapper__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${name}-error` : hint ? `${name}-hint` : undefined
          }
          className={[
            'form-input',
            leftIcon  ? 'form-input--with-icon' : '',
            hasError  ? 'form-input--error'     : '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...field}
        />

        {rightElement && (
          <span className="input-wrapper__suffix">
            {rightElement}
          </span>
        )}
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

export default FormikInput;
