/**
 * TextAreaField Component
 *
 * Reusable textarea with label and character count
 * Used for special instructions, notes, and comments
 */

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

export const TextAreaField = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "Enter your text...",
  helperText,
  error,
  rows = 3,
  maxLength,
  showCharCount = false,
}: TextAreaFieldProps) => {
  return (
    <div className="space-y-1">
      {/* Label */}
      <label className="flex items-center justify-between text-sm font-medium text-gray-700">
        <span>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {showCharCount && maxLength && (
          <span className="text-xs text-gray-500">
            {value.length}/{maxLength}
          </span>
        )}
      </label>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2 text-sm
          border rounded-lg
          ${error ? "border-red-500" : "border-gray-300"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          focus:outline-none focus:ring-2 
          ${error ? "focus:ring-red-500" : "focus:ring-[#8B5CF6]"}
          transition-colors
          resize-none
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
