/**
 * Restaurant Address Section Component
 *
 * Displays address with MapPin icon
 */

import { MapPin } from "lucide-react";

export const createRestaurantAddressSection = (address: string) => ({
  icon: <MapPin className="w-4 h-4 text-gray-500" />,
  content: <p className="text-xs text-gray-600 line-clamp-2">{address}</p>,
});
