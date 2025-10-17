/**
 * FormInputTypes
 *
 * This file re-exports all input components from the input-types subfolder
 * for backwards compatibility. All components have been refactored into
 * focused, single-responsibility files.
 *
 * @deprecated Import directly from './input-types' instead
 */

// Re-export all components and types from the input-types subfolder
export {
  SelectInput,
  TextareaInput,
  CheckboxInput,
  RadioInput,
  StandardInput,
  type SelectInputProps,
  type TextareaInputProps,
  type CheckboxInputProps,
  type RadioInputProps,
  type StandardInputProps,
} from "./input-types";
