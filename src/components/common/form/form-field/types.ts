/**
 * Shared types for FormField components
 *
 * This file contains all TypeScript interfaces and types used by
 * the form field components.
 */

import type { ReactNode } from "react";
import type { FormFieldSize } from "../FormFieldStyles";

/**
 * Option for select and radio inputs
 */
export interface FormFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Props for the FormField component
 */
export interface FormFieldProps {
  // Base props
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "password"
    | "number"
    | "url"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio";
  value?: string | number | boolean;
  onChange: (value: string | number | boolean, name: string) => void;

  // Validation
  required?: boolean;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;

  // Display
  placeholder?: string;
  description?: string;
  size?: FormFieldSize;

  // Select/Radio specific
  options?: FormFieldOption[];

  // Textarea specific
  rows?: number;

  // Input specific
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;

  // Styling
  className?: string;
  inputClassName?: string;
  labelClassName?: string;

  // Icons and addons
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}
