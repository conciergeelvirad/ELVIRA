/**
 * CartItem Component
 *
 * Single cart item card with image, info, quantity controls, and remove button
 * Reusable across all three cart types (Shop, DineIn, Services)
 */

import { Trash2 } from "lucide-react";
import { CartItemImage } from "./CartItemImage";
import { CartItemInfo } from "./CartItemInfo";
import { QuantityControls } from "./QuantityControls";
import type { CartItem as CartItemType } from "../../../../../contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
  showQuantityControls?: boolean;
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
  disabled?: boolean;
}

export const CartItem = ({
  item,
  showQuantityControls = true,
  onQuantityChange,
  onRemove,
  disabled = false,
}: CartItemProps) => {
  const handleIncrement = () => {
    if (onQuantityChange && !disabled) {
      onQuantityChange(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (onQuantityChange && !disabled) {
      const newQuantity = item.quantity - 1;
      if (newQuantity <= 0) {
        onRemove(item.id);
      } else {
        onQuantityChange(item.id, newQuantity);
      }
    }
  };

  const handleRemove = () => {
    if (!disabled) {
      onRemove(item.id);
    }
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-3
        bg-white rounded-lg
        border border-gray-200
        ${disabled ? "opacity-50" : "hover:shadow-sm"}
        transition-shadow
      `}
    >
      {/* Item Image */}
      <CartItemImage imageUrl={item.image_url} itemName={item.name} size="md" />

      {/* Item Info */}
      <CartItemInfo
        name={item.name}
        description={item.description}
        price={item.price}
        quantity={item.quantity}
        showQuantity={showQuantityControls}
      />

      {/* Actions */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {/* Quantity Controls (if enabled) */}
        {showQuantityControls && onQuantityChange && (
          <QuantityControls
            quantity={item.quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            disabled={disabled}
            size="sm"
          />
        )}

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={disabled}
          type="button"
          className={`
            p-2 rounded-full
            ${
              disabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-500 hover:bg-red-50 active:bg-red-100"
            }
            transition-colors
          `}
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
