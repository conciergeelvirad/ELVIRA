import React from "react";
import { cn } from "../../../../utils";
import type { RadioInputProps } from "./types";

/**
 * RadioInput Component
 *
 * A reusable radio button group component that renders multiple options.
 * Includes:
 * - Multiple radio options from an array
 * - Error state styling
 * - Disabled options
 * - Controlled value selection
 *
 * @example
 * ```tsx
 * <RadioInput
 *   name="paymentMethod"
 *   value={formData.paymentMethod}
 *   onChange={handleChange}
 *   hasError={!!errors.paymentMethod}
 *   options={[
 *     { value: 'credit', label: 'Credit Card' },
 *     { value: 'debit', label: 'Debit Card' },
 *     { value: 'cash', label: 'Cash' }
 *   ]}
 * />
 * ```
 */
export const RadioInput: React.FC<RadioInputProps> = ({
  name,
  value,
  onChange,
  disabled,
  options,
  hasError,
}) => (
  <div className="space-y-2">
    {options.map((option) => (
      <div key={option.value} className="flex items-center">
        <input
          id={`${name}-${option.value}`}
          name={name}
          type="radio"
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          disabled={disabled || option.disabled}
          className={cn(
            "w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500",
            hasError ? "border-red-300" : ""
          )}
        />
        <label
          htmlFor={`${name}-${option.value}`}
          className="ml-2 text-sm text-gray-700"
        >
          {option.label}
        </label>
      </div>
    ))}
  </div>
);
