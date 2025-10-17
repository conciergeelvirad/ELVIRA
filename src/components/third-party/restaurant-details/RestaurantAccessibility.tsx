/**
 * Restaurant Accessibility Component
 *
 * Displays accessibility information for wheelchair users
 */

import React from "react";

interface RestaurantAccessibilityProps {
  wheelchairAccessibleEntrance?: boolean;
}

export const RestaurantAccessibility: React.FC<
  RestaurantAccessibilityProps
> = ({ wheelchairAccessibleEntrance }) => {
  if (wheelchairAccessibleEntrance === undefined) return null;

  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-sm text-blue-900">
        <span className="font-semibold">Accessibility:</span>{" "}
        {wheelchairAccessibleEntrance
          ? "♿ Wheelchair accessible entrance"
          : "Wheelchair accessibility information not available"}
      </p>
    </div>
  );
};
