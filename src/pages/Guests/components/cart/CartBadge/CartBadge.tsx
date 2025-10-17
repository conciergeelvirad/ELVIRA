/**
 * Cart Badge Component
 *
 * Displays the number of items in the cart
 * Shows a pulsing animation when items are added
 * Can be placed on navigation items or floating buttons
 */

import { ShoppingBag } from "lucide-react";
import { useCart } from "../../../../../contexts/CartContext";
import { useEffect, useState } from "react";

interface CartBadgeProps {
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  onClick?: () => void;
}

export const CartBadge = ({
  size = "md",
  showIcon = true,
  onClick,
}: CartBadgeProps) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [isPulsing, setIsPulsing] = useState(false);

  // Trigger pulse animation when items change
  useEffect(() => {
    if (totalItems > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  // Don't render if cart is empty and no icon
  if (totalItems === 0 && !showIcon) {
    return null;
  }

  const sizeClasses = {
    sm: {
      container: "w-8 h-8",
      icon: "w-4 h-4",
      badge: "w-4 h-4 text-[10px]",
      badgeOffset: "-top-1 -right-1",
    },
    md: {
      container: "w-10 h-10",
      icon: "w-5 h-5",
      badge: "w-5 h-5 text-xs",
      badgeOffset: "-top-1.5 -right-1.5",
    },
    lg: {
      container: "w-12 h-12",
      icon: "w-6 h-6",
      badge: "w-6 h-6 text-sm",
      badgeOffset: "-top-2 -right-2",
    },
  };

  const classes = sizeClasses[size];

  return (
    <button
      onClick={onClick}
      className={`
        relative
        ${classes.container}
        flex items-center justify-center
        ${onClick ? "cursor-pointer hover:opacity-80" : ""}
        transition-opacity duration-200
      `}
    >
      {showIcon && (
        <ShoppingBag
          className={`${classes.icon} ${
            totalItems > 0 ? "text-[#8B5CF6]" : "text-gray-600"
          }`}
        />
      )}

      {totalItems > 0 && (
        <div
          className={`
            absolute ${classes.badgeOffset}
            ${classes.badge}
            bg-gradient-to-r from-red-500 to-red-600
            text-white
            rounded-full
            flex items-center justify-center
            font-bold
            shadow-lg
            ${isPulsing ? "animate-pulse scale-110" : ""}
            transition-transform duration-300
          `}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </div>
      )}
    </button>
  );
};
