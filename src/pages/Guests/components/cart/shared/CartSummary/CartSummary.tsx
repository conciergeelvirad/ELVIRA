/**
 * CartSummary Component
 *
 * Displays cart total with item count
 * Consistent pricing display across all carts
 */

interface CartSummaryProps {
  itemCount: number;
  totalPrice: number;
  currency?: string;
  showItemCount?: boolean;
}

export const CartSummary = ({
  itemCount,
  totalPrice,
  currency = "$",
  showItemCount = true,
}: CartSummaryProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      {/* Item Count */}
      {showItemCount && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
      )}

      {/* Divider */}
      {showItemCount && <div className="border-t border-gray-200" />}

      {/* Total Price */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-[#8B5CF6]">
          {currency}
          {totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
