/**
 * Custom hook to manage derived state for form fields
 *
 * @example
 * ```tsx
 * const { hasError, hasAddons, hasIcons, baseInputClasses } = useFormFieldState({
 *   error: 'Invalid input',
 *   leftAddon: '$',
 *   size: 'medium'
 * });
 * ```
 */

import { useMemo } from "react";
import { getBaseInputClasses, type FormFieldSize } from "../FormFieldStyles";

export interface UseFormFieldStateParams {
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  size?: FormFieldSize;
  inputClassName?: string;
}

export interface FormFieldState {
  hasError: boolean;
  hasAddons: boolean;
  hasIcons: boolean;
  baseInputClasses: string;
}

/**
 * Hook to compute derived state for form fields
 */
export function useFormFieldState(
  params: UseFormFieldStateParams
): FormFieldState {
  const {
    error,
    disabled,
    readonly,
    leftIcon,
    rightIcon,
    leftAddon,
    rightAddon,
    size,
    inputClassName,
  } = params;

  const hasError = !!error;
  const hasAddons = !!(leftAddon || rightAddon);
  const hasIcons = !!(leftIcon || rightIcon);

  const baseInputClasses = useMemo(
    () =>
      getBaseInputClasses({
        hasError,
        disabled: disabled || false,
        readonly: readonly || false,
        leftIcon: !!leftIcon,
        rightIcon: !!rightIcon,
        leftAddon: !!leftAddon,
        rightAddon: !!rightAddon,
        size: size || "md",
        inputClassName,
      }),
    [
      hasError,
      disabled,
      readonly,
      size,
      inputClassName,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
    ]
  );

  return {
    hasError,
    hasAddons,
    hasIcons,
    baseInputClasses,
  };
}
