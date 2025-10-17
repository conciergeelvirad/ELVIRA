/**
 * Restaurant Food & Beverage Component
 *
 * Displays what meals and beverages the restaurant serves
 */

import React from "react";

interface RestaurantFoodBeverageProps {
  servesBreakfast?: boolean;
  servesLunch?: boolean;
  servesDinner?: boolean;
  servesBeer?: boolean;
  servesWine?: boolean;
  servesVegetarianFood?: boolean;
}

interface ServiceItem {
  label: string;
  available: boolean;
}

export const RestaurantFoodBeverage: React.FC<RestaurantFoodBeverageProps> = ({
  servesBreakfast,
  servesLunch,
  servesDinner,
  servesBeer,
  servesWine,
  servesVegetarianFood,
}) => {
  const services: ServiceItem[] = [
    { label: "Breakfast", available: !!servesBreakfast },
    { label: "Lunch", available: !!servesLunch },
    { label: "Dinner", available: !!servesDinner },
    { label: "Beer", available: !!servesBeer },
    { label: "Wine", available: !!servesWine },
    { label: "Vegetarian Options", available: !!servesVegetarianFood },
  ];

  const availableServices = services.filter((service) => service.available);

  // Only render if at least one service is available
  if (availableServices.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Food & Beverage
      </h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {availableServices.map((service, index) => (
          <div key={index} className="flex items-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            {service.label}
          </div>
        ))}
      </div>
    </div>
  );
};
