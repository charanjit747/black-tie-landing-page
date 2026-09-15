'use client';

import React from 'react';

// ── Individual Controls ───────────────────────────────────────
import { FormikInput }         from './FormikInput';
import { FormikTextarea }      from './FormikTextarea';
import { FormikNativeSelect }  from './FormikNativeSelect';
import { FormikReactSelect }   from './FormikReactSelect';
import type { ReactSelectOption } from './FormikReactSelect';
import { FormikCheckbox }      from './FormikCheckbox';
import { FormikRadio }         from './FormikRadio';
import { FormikDatePicker }    from './FormikDatePicker';
import { FormikPhoneInput }    from './FormikPhoneInput';

// ── Control Types ─────────────────────────────────────────────

export type FormControlType =
  | 'input'
  | 'textarea'
  | 'select'           // native <select>
  | 'react-select'     // react-select (single or multi)
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'phone';

// ── Option Types ──────────────────────────────────────────────

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ── FormikControl Props ───────────────────────────────────────

interface FormikControlBaseProps {
  control: FormControlType;
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

// Input
interface InputProps extends FormikControlBaseProps {
  control: 'input';
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

// Textarea
interface TextareaProps extends FormikControlBaseProps {
  control: 'textarea';
  placeholder?: string;
  rows?: number;
}

// Native Select
interface NativeSelectProps extends FormikControlBaseProps {
  control: 'select';
  options: SelectOption[];
  placeholder?: string;
}

// React Select
interface ReactSelectProps extends FormikControlBaseProps {
  control: 'react-select';
  options: ReactSelectOption[];
  isMulti?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  placeholder?: string;
}

// Checkbox
interface CheckboxProps extends FormikControlBaseProps {
  control: 'checkbox';
  options?: CheckboxOption[];
  singleLabel?: string;
}

// Radio
interface RadioProps extends FormikControlBaseProps {
  control: 'radio';
  options: RadioOption[];
  direction?: 'vertical' | 'horizontal';
}

// Date
interface DateProps extends FormikControlBaseProps {
  control: 'date';
  min?: string;
  max?: string;
}

// Phone
interface PhoneProps extends FormikControlBaseProps {
  control: 'phone';
  defaultCountry?: string;
  placeholder?: string;
}

export type FormikControlProps =
  | InputProps
  | TextareaProps
  | NativeSelectProps
  | ReactSelectProps
  | CheckboxProps
  | RadioProps
  | DateProps
  | PhoneProps;

// ── Switch-Case Dispatcher ────────────────────────────────────

/**
 * FormikControl — Single entry point for all form controls.
 *
 * @example
 * <FormikControl control="input"        name="email"    label="Email" type="email" />
 * <FormikControl control="textarea"     name="message"  label="Message" rows={5} />
 * <FormikControl control="select"       name="country"  label="Country" options={[...]} />
 * <FormikControl control="react-select" name="tags"     label="Tags" options={[...]} isMulti />
 * <FormikControl control="checkbox"     name="agree"    singleLabel="I agree to the terms" />
 * <FormikControl control="radio"        name="gender"   label="Gender" options={[...]} />
 * <FormikControl control="date"         name="dob"      label="Date of Birth" />
 * <FormikControl control="phone"        name="phone"    label="Phone Number" />
 */
export const FormikControl: React.FC<FormikControlProps> = (props) => {
  switch (props.control) {

    case 'input':
      return (
        <FormikInput
          name={props.name}
          label={props.label}
          type={(props as InputProps).type}
          placeholder={(props as InputProps).placeholder}
          required={props.required}
          disabled={props.disabled}
          hint={props.hint}
          leftIcon={(props as InputProps).leftIcon}
          rightElement={(props as InputProps).rightElement}
          className={props.className}
        />
      );

    case 'textarea':
      return (
        <FormikTextarea
          name={props.name}
          label={props.label}
          placeholder={(props as TextareaProps).placeholder}
          rows={(props as TextareaProps).rows}
          required={props.required}
          disabled={props.disabled}
          hint={props.hint}
          className={props.className}
        />
      );

    case 'select':
      return (
        <FormikNativeSelect
          name={props.name}
          label={props.label}
          options={(props as NativeSelectProps).options}
          placeholder={(props as NativeSelectProps).placeholder}
          required={props.required}
          disabled={props.disabled}
          hint={props.hint}
          className={props.className}
        />
      );

    case 'react-select':
      return (
        <FormikReactSelect
          name={props.name}
          label={props.label}
          options={(props as ReactSelectProps).options}
          isMulti={(props as ReactSelectProps).isMulti}
          isSearchable={(props as ReactSelectProps).isSearchable}
          isClearable={(props as ReactSelectProps).isClearable}
          placeholder={(props as ReactSelectProps).placeholder}
          required={props.required}
          disabled={props.disabled}
          hint={props.hint}
          className={props.className}
        />
      );

    case 'checkbox':
      return (
        <FormikCheckbox
          name={props.name}
          label={props.label}
          options={(props as CheckboxProps).options}
          singleLabel={(props as CheckboxProps).singleLabel}
          required={props.required}
          hint={props.hint}
          className={props.className}
        />
      );

    case 'radio':
      return (
        <FormikRadio
          name={props.name}
          label={props.label}
          options={(props as RadioProps).options}
          direction={(props as RadioProps).direction}
          required={props.required}
          hint={props.hint}
          className={props.className}
        />
      );

    case 'date':
      return (
        <FormikDatePicker
          name={props.name}
          label={props.label}
          min={(props as DateProps).min}
          max={(props as DateProps).max}
          required={props.required}
          disabled={props.disabled}
          hint={props.hint}
          className={props.className}
        />
      );

    case 'phone':
      return (
        <FormikPhoneInput
          name={props.name}
          label={props.label}
          defaultCountry={(props as PhoneProps).defaultCountry}
          placeholder={(props as PhoneProps).placeholder}
          required={props.required}
          disabled={props.disabled}
          hint={props.hint}
          className={props.className}
        />
      );

    default:
      // TypeScript exhaustive check
      const _exhaustive: never = props;
      console.warn('FormikControl: Unknown control type', _exhaustive);
      return null;
  }
};

export default FormikControl;
