import { forwardRef } from "react";
import type { SelectInputProps } from "./types";

/**
 * SelectInput Component
 *
 * A reusable select dropdown input component with support for:
 * - Placeholder option
 * - Disabled options
 * - Required validation
 * - Read-only state
 * - Forward ref support
 *
 * @example
 * ```tsx
 * <SelectInput
 *   id="country"
 *   name="country"
 *   value={formData.country}
 *   onChange={handleChange}
 *   className="..."
 *   placeholder="Select a country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' }
 *   ]}
 * />
 * ```
 */
export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      id,
      name,
      value,
      onChange,
      className,
      disabled,
      readOnly,
      required,
      placeholder,
      options,
      ...props
    },
    ref
  ) => (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled || readOnly}
      required={required}
      ref={ref}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  )
);

SelectInput.displayName = "SelectInput";
