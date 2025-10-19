/**
 * Generic Location Section Component
 *
 * Displays address/location with MapPin icon for any third-party type
 */

import { MapPin } from "lucide-react";
import type { LocationData } from "../types";

export const createLocationSection = (location: LocationData) => ({
  icon: <MapPin className="w-4 h-4 text-gray-500" />,
  content: (
    <div className="space-y-1">
      {location.address && (
        <p className="text-xs text-gray-600 line-clamp-2">{location.address}</p>
      )}
      {location.displayText && (
        <p className="text-xs text-gray-400">{location.displayText}</p>
      )}
    </div>
  ),
});
