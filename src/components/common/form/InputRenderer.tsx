import React, { forwardRef } from "react";
import { FormFieldOption } from "./FormField";
import {
  SelectInput,
  TextareaInput,
  CheckboxInput,
  RadioInput,
  StandardInput,
} from "./FormInputTypes";

interface InputRendererProps {
  type: string;
  name: string;
  value: string | number | boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  className: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  label: string;
  hasError: boolean;
}

export const InputRenderer = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  InputRendererProps
>(
  (
    {
      type,
      name,
      value,
      onChange,
      className,
      disabled,
      readonly,
      required,
      placeholder,
      options = [],
      rows,
      min,
      max,
      step,
      maxLength,
      label,
      hasError,
      ...props
    },
    ref
  ) => {
    const commonProps = {
      id: name,
      name,
      disabled,
      required,
      className,
      onChange,
      ...props,
    };

    switch (type) {
      case "select":
        return (
          <SelectInput
            {...commonProps}
            value={value as string}
            onChange={
              onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void
            }
            readOnly={readonly}
            placeholder={placeholder}
            options={options}
            ref={ref as React.Ref<HTMLSelectElement>}
          />
        );

      case "textarea":
        return (
          <TextareaInput
            {...commonProps}
            value={value as string}
            onChange={
              onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void
            }
            readOnly={readonly}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        );

      case "checkbox":
        return (
          <CheckboxInput
            {...commonProps}
            checked={value as boolean}
            onChange={
              onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
            }
            label={label}
            hasError={hasError}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        );

      case "radio":
        return (
          <RadioInput
            name={name}
            value={value}
            onChange={
              onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
            }
            disabled={disabled}
            options={options}
            hasError={hasError}
          />
        );

      default:
        return (
          <StandardInput
            {...commonProps}
            type={type}
            value={value as string | number}
            onChange={
              onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
            }
            readOnly={readonly}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            maxLength={maxLength}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        );
    }
  }
);

InputRenderer.displayName = "InputRenderer";
