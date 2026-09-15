'use client';

import React from 'react';
import { useField, useFormikContext } from 'formik';
import ReactSelect, { MultiValue, SingleValue, ActionMeta } from 'react-select';
import { AlertCircleIcon } from '@/constants/icons';

export interface ReactSelectOption {
  value: string | number;
  label: string;
  isDisabled?: boolean;
}

interface FormikReactSelectProps {
  label?: string;
  name: string;
  options: ReactSelectOption[];
  isMulti?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

export const FormikReactSelect: React.FC<FormikReactSelectProps> = ({
  label,
  name,
  options,
  isMulti = false,
  isSearchable = true,
  isClearable = false,
  placeholder = 'Select...',
  required = false,
  disabled = false,
  hint,
  className = '',
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const hasError = meta.touched && !!meta.error;

  const handleChange = (
    newValue: MultiValue<ReactSelectOption> | SingleValue<ReactSelectOption>,
    _actionMeta: ActionMeta<ReactSelectOption>
  ) => {
    if (isMulti) {
      const values = (newValue as MultiValue<ReactSelectOption>).map((o) => o.value);
      setFieldValue(name, values);
    } else {
      setFieldValue(name, (newValue as SingleValue<ReactSelectOption>)?.value ?? '');
    }
  };

  const getValue = () => {
    if (isMulti) {
      return options.filter((o) =>
        Array.isArray(field.value) && field.value.includes(o.value)
      );
    }
    return options.find((o) => o.value === field.value) ?? null;
  };

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={name} className="form-group__label">
          {label}
          {required && <span className="required" aria-hidden="true">*</span>}
        </label>
      )}

      <ReactSelect
        inputId={name}
        options={options}
        isMulti={isMulti}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isDisabled={disabled}
        placeholder={placeholder}
        value={getValue()}
        onChange={handleChange}
        onBlur={() => setFieldTouched(name, true)}
        classNamePrefix="react-select"
        aria-invalid={hasError}
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

export default FormikReactSelect;
