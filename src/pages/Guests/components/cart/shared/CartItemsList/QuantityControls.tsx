/**
 * QuantityControls Component
 *
 * Reusable +/- quantity controls for cart items
 * Matches AddToCartButton styling
 */

import { Minus, Plus } from "lucide-react";

interface QuantityControlsProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const QuantityControls = ({
  quantity,
  onIncrement,
  onDecrement,
  disabled = false,
  size = "sm",
}: QuantityControlsProps) => {
  const containerSizeClasses = {
    sm: "min-w-[70px]",
    md: "min-w-[80px]",
    lg: "min-w-[90px]",
  };

  const buttonSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const iconSizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div
      className={`
        ${containerSizeClasses[size]} h-auto
        bg-white
        border border-gray-200
        rounded-full
        flex items-center justify-between gap-0.5
        shadow-sm
        overflow-hidden
        px-0.5
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {/* Minus Button */}
      <button
        onClick={onDecrement}
        disabled={disabled}
        type="button"
        className={`
          ${buttonSizeClasses[size]}
          flex items-center justify-center
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white hover:bg-red-50 active:bg-red-100"
          }
          text-red-500
          transition-colors duration-150
          rounded-full
        `}
      >
        <Minus className={iconSizeClasses[size]} strokeWidth={2.5} />
      </button>

      {/* Quantity Display */}
      <span
        className={`
          ${textSizeClasses[size]}
          font-bold text-gray-900
          min-w-[18px] text-center
          select-none
          px-0.5
        `}
      >
        {quantity}
      </span>

      {/* Plus Button */}
      <button
        onClick={onIncrement}
        disabled={disabled}
        type="button"
        className={`
          ${buttonSizeClasses[size]}
          flex items-center justify-center
          ${
            disabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9]"
          }
          text-white
          transition-colors duration-150
          rounded-full
        `}
      >
        <Plus className={iconSizeClasses[size]} strokeWidth={2.5} />
      </button>
    </div>
  );
};
