/**
 * Generic Price Section Component
 *
 * Displays price with currency (for tours, tickets, etc.)
 */

import { DollarSign } from "lucide-react";
import type { PriceData } from "../types";
import { formatPrice } from "../thirdPartyHelpers";

export const createPriceSection = (
  price: PriceData,
  type: "restaurant" | "tour" | "hotel" | "spa"
) => {
  const priceLabel = formatPrice(price, type);

  if (priceLabel === "N/A") return null;

  return {
    icon: <DollarSign className="w-4 h-4 text-green-500" />,
    content: (
      <span className="text-sm font-medium text-green-600">{priceLabel}</span>
    ),
  };
};
