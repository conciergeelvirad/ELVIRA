/**
 * CartItemsList Component
 *
 * Renders a scrollable list of cart items
 * Includes empty state handling
 */

import { ShoppingBag } from "lucide-react";
import { CartItem } from "./CartItem";
import type { CartItem as CartItemType } from "../../../../../contexts/CartContext";

interface CartItemsListProps {
  items: CartItemType[];
  showQuantityControls?: boolean;
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
  emptyMessage?: string;
  disabled?: boolean;
  maxHeight?: string;
}

export const CartItemsList = ({
  items,
  showQuantityControls = true,
  onQuantityChange,
  onRemove,
  emptyMessage = "Your cart is empty",
  disabled = false,
  maxHeight = "max-h-[400px]",
}: CartItemsListProps) => {
  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-center">{emptyMessage}</p>
      </div>
    );
  }

  // Items list
  return (
    <div className={`${maxHeight} overflow-y-auto space-y-2 pr-1`}>
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          showQuantityControls={showQuantityControls}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
          disabled={disabled}
        />
      ))}
    </div>
  );
};
