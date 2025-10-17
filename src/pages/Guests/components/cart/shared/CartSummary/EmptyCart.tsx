import { ShoppingBag } from "lucide-react";

/**
 * EmptyCart Component
 *
 * Displayed when cart is empty
 * Reusable across all cart types
 */

interface EmptyCartProps {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  message?: string;
}

export const EmptyCart = ({
  icon: Icon = ShoppingBag,
  title = "Your cart is empty",
  message = "Add items to get started",
}: EmptyCartProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      <div className="mb-4 text-gray-300">
        <Icon className="w-16 h-16" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Message */}
      <p className="text-sm text-gray-500 max-w-sm">{message}</p>
    </div>
  );
};
