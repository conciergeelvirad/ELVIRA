import { forwardRef } from "react";
import { cn } from "../../../../utils";
import type { CheckboxInputProps } from "./types";

/**
 * CheckboxInput Component
 *
 * A reusable checkbox input component with integrated label.
 * Includes:
 * - Error state styling
 * - Disabled state
 * - Required validation
 * - Forward ref support
 *
 * @example
 * ```tsx
 * <CheckboxInput
 *   id="terms"
 *   name="terms"
 *   checked={formData.acceptTerms}
 *   onChange={handleChange}
 *   label="I accept the terms and conditions"
 *   hasError={!!errors.terms}
 *   required
 * />
 * ```
 */
export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
  (
    {
      id,
      name,
      checked,
      onChange,
      disabled,
      required,
      label,
      hasError,
      ...props
    },
    ref
  ) => (
    <div className="flex items-center">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={cn(
          "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
          hasError ? "border-red-300" : ""
        )}
        ref={ref}
        {...props}
      />
      <label htmlFor={name} className="ml-2 text-sm text-gray-700">
        {label}
      </label>
    </div>
  )
);

CheckboxInput.displayName = "CheckboxInput";
