// Form field size configurations and style utilities
import { cn } from "../../../utils";

export const sizeStyles = {
  sm: {
    input: "px-3 py-1.5 text-sm",
    label: "text-sm",
    description: "text-xs",
  },
  md: {
    input: "px-4 py-2 text-sm",
    label: "text-sm",
    description: "text-sm",
  },
  lg: {
    input: "px-4 py-3 text-base",
    label: "text-base",
    description: "text-sm",
  },
};

export type FormFieldSize = keyof typeof sizeStyles;

export interface StyleConfig {
  hasError: boolean;
  disabled: boolean;
  readonly: boolean;
  leftIcon?: boolean;
  rightIcon?: boolean;
  leftAddon?: boolean;
  rightAddon?: boolean;
  size: FormFieldSize;
  inputClassName?: string;
}

export const getBaseInputClasses = ({
  hasError,
  disabled,
  readonly,
  leftIcon,
  rightIcon,
  leftAddon,
  rightAddon,
  size,
  inputClassName,
}: StyleConfig): string => {
  const sizeClasses = sizeStyles[size];

  return cn(
    "w-full border rounded-lg transition-colors focus:outline-none focus:ring-2",
    sizeClasses.input,
    hasError ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "",
    !hasError && !disabled
      ? "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
      : "",
    disabled
      ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
      : "",
    readonly && !disabled ? "bg-gray-50 border-gray-200" : "",
    leftIcon && !leftAddon ? "pl-10" : "",
    rightIcon && !rightAddon ? "pr-10" : "",
    leftAddon ? "rounded-l-none" : "",
    rightAddon ? "rounded-r-none" : "",
    inputClassName
  );
};
