import React, { forwardRef } from "react";
import { cn } from "../../../utils";
import { sizeStyles } from "./FormFieldStyles";
import { handleFormFieldChange } from "./FormFieldUtils";
import {
  FormFieldLabel,
  FormFieldDescription,
  FormFieldError,
} from "./FormFieldHelpers";
import { InputWrapper } from "./InputWrapper";
import { InputRenderer } from "./InputRenderer";
import { type FormFieldProps, useFormFieldState } from "./form-field";

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormFieldProps
>(
  (
    {
      name,
      label,
      type = "text",
      value,
      onChange,
      required = false,
      error,
      disabled = false,
      readonly = false,
      placeholder,
      description,
      size = "md",
      options = [],
      rows = 3,
      min,
      max,
      step,
      maxLength,
      className,
      inputClassName,
      labelClassName,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      ...props
    },
    ref
  ) => {
    // Use hook for derived state
    const { hasError, hasAddons, hasIcons, baseInputClasses } =
      useFormFieldState({
        error,
        disabled,
        readonly,
        leftIcon,
        rightIcon,
        leftAddon,
        rightAddon,
        size,
        inputClassName,
      });

    const handleInputChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const newValue = handleFormFieldChange(e, type);
      onChange(newValue, name);
    };

    const renderInput = () => (
      <InputRenderer
        type={type}
        name={name}
        value={value || ""}
        onChange={handleInputChange}
        className={baseInputClasses}
        disabled={disabled}
        readonly={readonly}
        required={required}
        placeholder={placeholder}
        options={options}
        rows={rows}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        label={label}
        hasError={hasError}
        ref={ref}
        {...props}
      />
    );

    // Special handling for checkbox (different layout)
    if (type === "checkbox") {
      return (
        <div className={cn("space-y-1", className)}>
          <InputWrapper
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            leftAddon={leftAddon}
            rightAddon={rightAddon}
            hasAddons={hasAddons}
            hasIcons={hasIcons}
          >
            {renderInput()}
          </InputWrapper>
          {description && (
            <FormFieldDescription description={description} size={size} />
          )}
          {error && <FormFieldError error={error} size={size} />}
        </div>
      );
    }

    // Standard layout for other field types
    return (
      <div className={cn("space-y-1", className)}>
        {type !== "radio" && (
          <FormFieldLabel
            name={name}
            label={label}
            required={required}
            size={size}
            className={labelClassName}
          />
        )}
        {type === "radio" && (
          <div
            className={cn(
              "block font-medium text-gray-700 mb-2",
              sizeStyles[size].label,
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </div>
        )}
        <InputWrapper
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          leftAddon={leftAddon}
          rightAddon={rightAddon}
          hasAddons={hasAddons}
          hasIcons={hasIcons}
        >
          {renderInput()}
        </InputWrapper>
        {description && (
          <FormFieldDescription description={description} size={size} />
        )}
        {error && <FormFieldError error={error} size={size} />}
      </div>
    );
  }
);

FormField.displayName = "FormField";
