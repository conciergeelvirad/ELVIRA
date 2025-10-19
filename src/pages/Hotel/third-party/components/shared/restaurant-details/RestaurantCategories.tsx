/**
 * Restaurant Categories Component
 *
 * Displays restaurant types/categories as badges
 */

import React from "react";
import { Badge } from "../../../../../../components/common";

interface RestaurantCategoriesProps {
  types: string[];
}

export const RestaurantCategories: React.FC<RestaurantCategoriesProps> = ({
  types,
}) => {
  if (!types || types.length === 0) return null;

  // Filter out generic types that don't provide meaningful information
  const meaningfulTypes = types.filter(
    (t) => !t.includes("point_of_interest") && !t.includes("establishment")
  );

  if (meaningfulTypes.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {meaningfulTypes.map((type, index) => (
          <Badge key={index} variant="info" size="sm">
            {type.replace(/_/g, " ")}
          </Badge>
        ))}
      </div>
    </div>
  );
};
