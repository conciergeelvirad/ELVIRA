import { useState } from "react";

interface ToggleProps {
  id?: string;
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle = ({
  id,
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
}: ToggleProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 mr-4">
        <label
          htmlFor={id}
          className={`text-sm font-medium cursor-pointer ${
            disabled ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {label}
        </label>
        {description && (
          <p
            className={`text-sm mt-1 ${
              disabled ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {description}
          </p>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          disabled
            ? "bg-gray-200 cursor-not-allowed"
            : isChecked
            ? "bg-blue-600"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
            isChecked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};
