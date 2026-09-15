'use client';

import React from 'react';
import { useField } from 'formik';
import { AlertCircleIcon } from '@/constants/icons';

interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormikCheckboxProps {
  label?: string;
  name: string;
  options?: CheckboxOption[];
  /** For a single boolean checkbox, pass this instead of options */
  singleLabel?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}

export const FormikCheckbox: React.FC<FormikCheckboxProps> = ({
  label,
  name,
  options,
  singleLabel,
  required = false,
  hint,
  className = '',
}) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  // ── Single boolean checkbox ──────────────────────────────
  if (singleLabel) {
    return (
      <div className={`form-group ${className}`.trim()}>
        <label className="form-check">
          <input
            type="checkbox"
            id={name}
            className="form-check__input"
            checked={!!field.value}
            onChange={(e) => helpers.setValue(e.target.checked)}
            onBlur={field.onBlur}
            name={name}
          />
          <span className="form-check__label">
            {singleLabel}
            {required && <span className="required" aria-hidden="true">*</span>}
          </span>
        </label>

        {hasError && (
          <span className="form-group__error" role="alert">
            <AlertCircleIcon size={12} aria-hidden="true" />
            {meta.error}
          </span>
        )}
      </div>
    );
  }

  // ── Multiple checkbox group ──────────────────────────────
  const values: string[] = Array.isArray(field.value) ? field.value : [];

  const handleChange = (optValue: string, checked: boolean) => {
    const next = checked
      ? [...values, optValue]
      : values.filter((v) => v !== optValue);
    helpers.setValue(next);
    helpers.setTouched(true);
  };

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <span className="form-group__label" role="group" aria-label={label}>
          {label}
          {required && <span className="required" aria-hidden="true">*</span>}
        </span>
      )}

      <div className="form-check-group" role="group">
        {options?.map((opt) => (
          <label key={opt.value} className="form-check">
            <input
              type="checkbox"
              className="form-check__input"
              value={opt.value}
              checked={values.includes(opt.value)}
              disabled={opt.disabled}
              onChange={(e) => handleChange(opt.value, e.target.checked)}
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

export default FormikCheckbox;
