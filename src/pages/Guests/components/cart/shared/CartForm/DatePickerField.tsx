/**
 * DatePickerField Component
 *
 * Reusable date picker with icon, label, and validation
 * Used across all cart forms for delivery/reservation dates
 */

import { Calendar } from "lucide-react";

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
}

export const DatePickerField = ({
  label,
  value,
  onChange,
  required = false,
  minDate,
  maxDate,
  disabled = false,
  placeholder = "Select date",
  helperText,
  error,
}: DatePickerFieldProps) => {
  return (
    <div className="space-y-1">
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Calendar className="w-4 h-4 text-[#8B5CF6]" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input */}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDate}
        max={maxDate}
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
