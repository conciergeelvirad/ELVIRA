/**
 * Add to Cart Button Component
 *
 * Delivery app-style +/- button for adding/removing items from cart
 * Features:
 * - Shows "Add" button when quantity is 0
 * - Shows +/- buttons with quantity when item is in cart
 * - Smooth animations and transitions
 * - Prevents click propagation (won't trigger parent click events)
 * - Three size variants: sm, md, lg
 *
 * Design inspired by: Uber Eats, DoorDash, Deliveroo
 */

import { Minus, Plus } from "lucide-react";
import { useCart } from "../../../../../contexts/CartContext";

interface AddToCartButtonProps {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemImage?: string | null;
  itemType: "food" | "product" | "service";
  itemDescription?: string | null;
  itemCategory?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  serviceType?: "restaurant_booking" | "room_service"; // For food items only
  restaurantId?: string; // Restaurant ID for food items
}

export const AddToCartButton = ({
  itemId,
  itemName,
  itemPrice,
  itemImage,
  itemType,
  itemDescription,
  itemCategory,
  size = "md",
  disabled = false,
  serviceType,
  restaurantId,
}: AddToCartButtonProps) => {
  const {
    addItem,
    updateQuantity,
    getItemQuantity,
    removeItem,
    canAddFoodItem,
  } = useCart();
  const quantity = getItemQuantity(itemId);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (disabled) return;

    // Validate service type for food items
    if (itemType === "food" && serviceType && quantity === 0) {
      const validation = canAddFoodItem(serviceType);

      if (!validation.canAdd) {
        // Visual warning is already shown in the card, just prevent adding
        return;
      }
    }

    if (quantity === 0) {
      addItem({
        id: itemId,
        name: itemName,
        price: itemPrice,
        image_url: itemImage,
        type: itemType,
        description: itemDescription,
        category: itemCategory,
        serviceType: itemType === "food" ? serviceType : undefined,
        restaurantId: itemType === "food" ? restaurantId : undefined,
      });
    } else {
      updateQuantity(itemId, quantity + 1);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (disabled) return;

    updateQuantity(itemId, quantity - 1);
  };

  // Size configurations
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
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

  const counterSizeClasses = {
    sm: "min-w-[70px]",
    md: "min-w-[80px]",
    lg: "min-w-[90px]",
  };

  // For service items, show simple circular "+" button (same as food/product when quantity is 0)
  // Services don't have quantity controls, just add/remove
  if (itemType === "service") {
    const isAdded = quantity > 0;

    return (
      <button
        onClick={isAdded ? () => removeItem(itemId) : handleAdd}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          ${
            disabled
              ? "bg-gray-300 cursor-not-allowed"
              : isAdded
              ? "bg-green-500 hover:bg-red-500"
              : "bg-white hover:bg-[#8B5CF6]"
          }
          ${isAdded ? "text-white" : "text-[#8B5CF6] hover:text-white"}
          rounded-full
          font-semibold
          transition-all duration-200
          shadow-lg hover:shadow-xl
          transform ${disabled ? "" : "hover:scale-110 active:scale-95"}
          flex items-center justify-center
          border ${
            isAdded
              ? "border-green-600"
              : "border-gray-200 hover:border-[#8B5CF6]"
          }
        `}
      >
        {isAdded ? (
          <svg
            className={iconSizeClasses[size]}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <Plus className={iconSizeClasses[size]} strokeWidth={2.5} />
        )}
      </button>
    );
  }

  // If quantity is 0, show compact "+" button
  if (quantity === 0) {
    return (
      <button
        onClick={handleAdd}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          ${
            disabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-white hover:bg-[#8B5CF6]"
          }
          text-[#8B5CF6] hover:text-white
          rounded-full
          font-semibold
          transition-all duration-200
          shadow-lg hover:shadow-xl
          transform ${disabled ? "" : "hover:scale-110 active:scale-95"}
          flex items-center justify-center
          border border-gray-200 hover:border-[#8B5CF6]
        `}
      >
        <Plus className={iconSizeClasses[size]} strokeWidth={2.5} />
      </button>
    );
  }

  // If quantity > 0, show compact quantity controls
  return (
    <div
      className={`
        ${counterSizeClasses[size]} h-auto
        bg-white
        border border-gray-200
        rounded-full
        flex items-center justify-between gap-0.5
        shadow-lg
        overflow-hidden
        px-0.5
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {/* Minus Button */}
      <button
        onClick={handleRemove}
        disabled={disabled}
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
        onClick={handleAdd}
        disabled={disabled}
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
