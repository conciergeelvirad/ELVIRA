/**
 * TimePickerField Component
 *
 * Reusable time picker with icon, label, and validation
 * Used across all cart forms for delivery/reservation times
 */

import { Clock } from "lucide-react";

interface TimePickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minTime?: string;
  maxTime?: string;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
}

export const TimePickerField = ({
  label,
  value,
  onChange,
  required = false,
  minTime,
  maxTime,
  disabled = false,
  placeholder = "Select time",
  helperText,
  error,
}: TimePickerFieldProps) => {
  return (
    <div className="space-y-1">
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Clock className="w-4 h-4 text-[#8B5CF6]" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input */}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minTime}
        max={maxTime}
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
