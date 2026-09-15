'use client';

import React from 'react';
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

  return (
    <div className={`form-group ${className}`.trim()}>
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
