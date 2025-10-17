import { forwardRef } from "react";
import type { TextareaInputProps } from "./types";

/**
 * TextareaInput Component
 *
 * A reusable multi-line text input component with support for:
 * - Configurable rows
 * - Max length validation
 * - Required validation
 * - Read-only state
 * - Forward ref support
 *
 * @example
 * ```tsx
 * <TextareaInput
 *   id="description"
 *   name="description"
 *   value={formData.description}
 *   onChange={handleChange}
 *   className="..."
 *   placeholder="Enter description"
 *   rows={5}
 *   maxLength={500}
 * />
 * ```
 */
export const TextareaInput = forwardRef<
  HTMLTextAreaElement,
  TextareaInputProps
>(
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
      rows = 3,
      maxLength,
      ...props
    },
    ref
  ) => (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      ref={ref}
      {...props}
    />
  )
);

TextareaInput.displayName = "TextareaInput";
