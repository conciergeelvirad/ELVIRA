/**
 * Restaurant Name Cell Component
 *
 * Displays restaurant name with photo or placeholder icon
 */

import React from "react";
import { MapPin } from "lucide-react";

interface RestaurantNameCellProps {
  name: string;
  photoUrl?: string;
  category?: string;
}

export const RestaurantNameCell: React.FC<RestaurantNameCellProps> = ({
  name,
  photoUrl,
  category,
}) => {
  return (
    <div className="flex items-center">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className="w-12 h-12 rounded-lg object-cover mr-3"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
          <MapPin className="w-6 h-6 text-gray-400" />
        </div>
      )}
      <div>
        <div className="font-medium text-gray-900">{name}</div>
        {category && (
          <div className="text-xs text-gray-500 capitalize">{category}</div>
        )}
      </div>
    </div>
  );
};
