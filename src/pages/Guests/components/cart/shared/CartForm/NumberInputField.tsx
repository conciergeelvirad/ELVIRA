/**
 * NumberInputField Component
 *
 * Reusable number input with icon, label, and validation
 * Used for number of guests, quantity, etc.
 */

import { Users } from "lucide-react";

interface NumberInputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const NumberInputField = ({
  label,
  value,
  onChange,
  required = false,
  min = 1,
  max,
  step = 1,
  disabled = false,
  placeholder = "Enter number",
  helperText,
  error,
  icon = <Users className="w-4 h-4 text-[#8B5CF6]" />,
}: NumberInputFieldProps) => {
  return (
    <div className="space-y-1">
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input */}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 text-sm
          border rounded-lg
          ${error ? "border-red-500" : "border-gray-300"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          focus:outline-none focus:ring-2 
          ${error ? "focus:ring-red-500" : "focus:ring-[#8B5CF6]"}
          transition-colors
        `}
      />

      {/* Helper Text or Error */}
      {(helperText || error) && (
        <p className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
