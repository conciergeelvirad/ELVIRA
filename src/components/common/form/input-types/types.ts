/**
 * Shared types for form input components
 *
 * This file contains all the TypeScript interfaces and types used by
 * the input components in the input-types folder.
 */

import { FormFieldOption } from "../FormField";

/**
 * Props for the SelectInput component
 */
export interface SelectInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  options: FormFieldOption[];
}

/**
 * Props for the TextareaInput component
 */
export interface TextareaInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

/**
 * Props for the CheckboxInput component
 */
export interface CheckboxInputProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  label: string;
  hasError: boolean;
}

/**
 * Props for the RadioInput component
 */
export interface RadioInputProps {
  name: string;
  value: string | number | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  options: FormFieldOption[];
  hasError: boolean;
}

/**
 * Props for the StandardInput component (text, number, date, etc.)
 */
export interface StandardInputProps {
  id: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
}
