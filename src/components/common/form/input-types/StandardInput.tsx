import { forwardRef } from "react";
import type { StandardInputProps } from "./types";

/**
 * StandardInput Component
 *
 * A reusable input component for standard HTML input types:
 * - text, email, password, url, tel
 * - number (with min, max, step)
 * - date, time, datetime-local
 * - color, file, etc.
 *
 * Includes support for:
 * - All standard HTML input attributes
 * - Required validation
 * - Read-only state
 * - Max length
 * - Forward ref support
 *
 * @example
 * ```tsx
 * <StandardInput
 *   id="email"
 *   name="email"
 *   type="email"
 *   value={formData.email}
 *   onChange={handleChange}
 *   className="..."
 *   placeholder="Enter your email"
 *   required
 * />
 * ```
 *
 * @example
 * ```tsx
 * <StandardInput
 *   id="age"
 *   name="age"
 *   type="number"
 *   value={formData.age}
 *   onChange={handleChange}
 *   className="..."
 *   min={18}
 *   max={120}
 *   step={1}
 * />
 * ```
 */
export const StandardInput = forwardRef<HTMLInputElement, StandardInputProps>(
  (
    {
      id,
      name,
      type,
      value,
      onChange,
      className,
      disabled,
      readOnly,
      required,
      placeholder,
      min,
      max,
      step,
      maxLength,
      ...props
    },
    ref
  ) => (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      maxLength={maxLength}
      ref={ref}
      {...props}
    />
  )
);

StandardInput.displayName = "StandardInput";
