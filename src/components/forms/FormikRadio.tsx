'use client';

import React from 'react';
import { useField, useFormikContext } from 'formik';
import { AlertCircleIcon } from '@/constants/icons';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormikRadioProps {
  label?: string;
  name: string;
  options: RadioOption[];
  required?: boolean;
  hint?: string;
  /** 'vertical' (default) | 'horizontal' */
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export const FormikRadio: React.FC<FormikRadioProps> = ({
  label,
  name,
  options,
  required = false,
  hint,
  direction = 'vertical',
  className = '',
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const hasError = meta.touched && !!meta.error;

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <span className="form-group__label">
          {label}
          {required && <span className="required" aria-hidden="true">*</span>}
        </span>
      )}

      <div
        className="form-check-group"
        role="radiogroup"
        aria-label={label}
        style={direction === 'horizontal' ? { flexDirection: 'row', flexWrap: 'wrap', gap: '1rem' } : {}}
      >
        {options.map((opt) => (
          <label key={opt.value} className="form-check">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={field.value === opt.value}
              disabled={opt.disabled}
              className="form-check__input"
              onChange={() => {
                setFieldValue(name, opt.value);
                setFieldTouched(name, true, false);
              }}
            />
            <span className="form-check__label">{opt.label}</span>
          </label>
        ))}
      </div>

      {hasError && (
        <span className="form-group__error" role="alert">
          <AlertCircleIcon size={12} aria-hidden="true" />
          {meta.error}
        </span>
      )}

      {hint && !hasError && (
        <span className="form-group__hint">{hint}</span>
      )}
    </div>
  );
};

export default FormikRadio;
