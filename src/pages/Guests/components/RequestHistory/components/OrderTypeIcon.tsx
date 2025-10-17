/**
 * Order Type Icon
 *
 * Displays appropriate icon based on order type
 */

import { ShoppingBag, UtensilsCrossed, Sparkles } from "lucide-react";
import type { OrderType } from "../types";

interface OrderTypeIconProps {
  type: OrderType;
  className?: string;
}

export const OrderTypeIcon = ({
  type,
  className = "w-5 h-5",
}: OrderTypeIconProps) => {
  switch (type) {
    case "shop":
      return <ShoppingBag className={className} />;
    case "dine_in":
      return <UtensilsCrossed className={className} />;
    case "amenity":
      return <Sparkles className={className} />;
    default:
      return <ShoppingBag className={className} />;
  }
};
