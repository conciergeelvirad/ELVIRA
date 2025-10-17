import React from "react";
import { Dices } from "lucide-react";
import { cn, generateAccessCode } from "../../../utils";
import { FormFieldConfig } from "../../../hooks";
import { ImageUploadField } from "../form/ImageUploadField";

interface DynamicFormFieldProps {
  field: FormFieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
  className,
}) => {
  const baseInputClasses = cn(
    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
    error
      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
    disabled && "bg-gray-50 cursor-not-allowed",
    field.showGenerateButton && "pr-12", // Add padding for the button
    className
  );

  const handleGenerateCode = () => {
    const code = generateAccessCode();
    onChange(code);
  };
  const stringValue = (value ?? "") as string;

  const renderField = () => {
    switch (field.type) {
      case "file":
        return (
          <ImageUploadField
            label=""
            value={stringValue}
            onChange={onChange}
            error={error}
            disabled={disabled}
            required={field.required}
            storageFolder={field.storageFolder || "PRODUCTS"}
          />
        );

      case "select":
        return (
          <select
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={field.required}
            className={baseInputClasses}
          >
            <option value="">
              {field.placeholder || `Select ${field.label}`}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            required={field.required}
            rows={4}
            className={cn(baseInputClasses, "resize-vertical")}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={stringValue}
            onChange={(e) => onChange(e.target.valueAsNumber || e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            required={field.required}
            className={baseInputClasses}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={field.required}
            className={baseInputClasses}
          />
        );

      default:
        return (
          <div className="relative">
            <input
              type={field.type}
              value={stringValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
              required={field.required}
              maxLength={field.maxLength}
              className={baseInputClasses}
            />
            {field.showGenerateButton && (
              <button
                type="button"
                onClick={handleGenerateCode}
                disabled={disabled}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Generate random code"
              >
                <Dices className="w-4 h-4" />
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-1">
      {/* Only show label if not a file field (file field has its own label) */}
      {field.type !== "file" && (
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
      {/* Error is shown within ImageUploadField for file type */}
      {error && field.type !== "file" && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
