/**
 * CartItemInfo Component
 *
 * Displays cart item name, description, and price
 * Consistent typography and layout
 */

interface CartItemInfoProps {
  name: string;
  description?: string | null;
  price: number;
  quantity?: number;
  showQuantity?: boolean;
}

export const CartItemInfo = ({
  name,
  description,
  price,
  quantity,
  showQuantity = false,
}: CartItemInfoProps) => {
  const totalPrice = quantity ? price * quantity : price;

  return (
    <div className="flex-1 min-w-0">
      {/* Item Name */}
      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
        {name}
      </h3>

      {/* Item Description */}
      {description && (
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
          {description}
        </p>
      )}

      {/* Price and Quantity */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm font-bold text-[#8B5CF6]">
          ${totalPrice.toFixed(2)}
        </span>
        {showQuantity && quantity && quantity > 1 && (
          <span className="text-xs text-gray-500">
            (${price.toFixed(2)} × {quantity})
          </span>
        )}
      </div>
    </div>
  );
};
