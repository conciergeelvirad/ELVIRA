/**
 * Restaurant Service Options Component
 *
 * Displays available service options as badges (dine-in, takeout, delivery, reservations)
 */

import React from "react";
import { InfoSection, Badge } from "../../common";
import { Users, Tag, MapPin, Calendar } from "lucide-react";

interface RestaurantServiceOptionsProps {
  dineIn?: boolean;
  takeout?: boolean;
  delivery?: boolean;
  reservable?: boolean;
}

export const RestaurantServiceOptions: React.FC<
  RestaurantServiceOptionsProps
> = ({ dineIn, takeout, delivery, reservable }) => {
  // Only render if at least one service is available
  if (!dineIn && !takeout && !delivery && !reservable) {
    return null;
  }

  return (
    <InfoSection title="Service Options">
      <div className="flex flex-wrap gap-2">
        {dineIn && (
          <Badge
            variant="success"
            icon={<Users className="w-4 h-4" />}
            rounded="full"
          >
            Dine-in
          </Badge>
        )}
        {takeout && (
          <Badge
            variant="info"
            icon={<Tag className="w-4 h-4" />}
            rounded="full"
          >
            Takeout
          </Badge>
        )}
        {delivery && (
          <Badge
            variant="primary"
            icon={<MapPin className="w-4 h-4" />}
            rounded="full"
            className="bg-purple-100 text-purple-700 border-purple-200"
          >
            Delivery
          </Badge>
        )}
        {reservable && (
          <Badge
            variant="warning"
            icon={<Calendar className="w-4 h-4" />}
            rounded="full"
            className="bg-orange-100 text-orange-700 border-orange-200"
          >
            Reservations
          </Badge>
        )}
      </div>
    </InfoSection>
  );
};
