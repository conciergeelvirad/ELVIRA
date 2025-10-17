import React from "react";
import { cn } from "../../../utils";
import { sizeStyles, FormFieldSize } from "./FormFieldStyles";

interface FormFieldLabelProps {
  name: string;
  label: string;
  required?: boolean;
  size: FormFieldSize;
  className?: string;
}

export const FormFieldLabel: React.FC<FormFieldLabelProps> = ({
  name,
  label,
  required = false,
  size,
  className,
}) => (
  <label
    htmlFor={name}
    className={cn(
      "block font-medium text-gray-700 mb-1",
      sizeStyles[size].label,
      className
    )}
  >
    {label}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

interface FormFieldDescriptionProps {
  description: string;
  size: FormFieldSize;
}

export const FormFieldDescription: React.FC<FormFieldDescriptionProps> = ({
  description,
  size,
}) => (
  <p className={cn("text-gray-500 mt-1", sizeStyles[size].description)}>
    {description}
  </p>
);

interface FormFieldErrorProps {
  error: string;
  size: FormFieldSize;
}

export const FormFieldError: React.FC<FormFieldErrorProps> = ({
  error,
  size,
}) => (
  <p className={cn("text-red-600 mt-1", sizeStyles[size].description)}>
    {error}
  </p>
);
