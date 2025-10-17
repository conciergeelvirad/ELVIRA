/**
 * Service Type Badge
 *
 * Displays the detected service type (restaurant_booking or room_service)
 * Shows appropriate icon and description
 */

import { UtensilsCrossed, MapPin } from "lucide-react";

interface ServiceTypeBadgeProps {
  serviceType: "restaurant_booking" | "room_service";
}

export const ServiceTypeBadge = ({ serviceType }: ServiceTypeBadgeProps) => {
  const isRestaurant = serviceType === "restaurant_booking";

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
      {isRestaurant ? (
        <>
          <UtensilsCrossed className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900">
              Restaurant Reservation
            </p>
            <p className="text-xs text-gray-600">
              Booking a table at our restaurant
            </p>
          </div>
        </>
      ) : (
        <>
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900">Room Service</p>
            <p className="text-xs text-gray-600">Delivery to your room</p>
          </div>
        </>
      )}
    </div>
  );
};
