import { useEffect, useState } from "react";

interface UnifiedToggleProps {
  // Toggle functionality
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;

  // Label/description (optional - for full toggle with text)
  id?: string;
  label?: string;
  description?: string;

  // Styling variants
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact";
}

export const UnifiedToggle = ({
  id,
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  variant = "default",
}: UnifiedToggleProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  // Sync with external checked prop changes
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  // Size configurations
  const sizeConfig = {
    sm: { button: "h-4 w-7", thumb: "h-3 w-3", translate: "translate-x-3" },
    md: { button: "h-6 w-11", thumb: "h-4 w-4", translate: "translate-x-6" },
    lg: { button: "h-8 w-14", thumb: "h-6 w-6", translate: "translate-x-7" },
  };

  const { button: buttonSize, thumb: thumbSize, translate } = sizeConfig[size];

  const ToggleButton = () => (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={handleToggle}
      disabled={disabled}
      className={`relative inline-flex ${buttonSize} items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        disabled
          ? "bg-gray-200 cursor-not-allowed"
          : isChecked
          ? "bg-blue-600"
          : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block ${thumbSize} transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
          isChecked ? translate : "translate-x-1"
        }`}
      />
    </button>
  );

  // Compact variant (just the toggle button)
  if (variant === "compact" || !label) {
    return <ToggleButton />;
  }

  // Full variant (with label and description)
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
      <ToggleButton />
    </div>
  );
};
