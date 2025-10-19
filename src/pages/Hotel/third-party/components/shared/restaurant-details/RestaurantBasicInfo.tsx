/**
 * Restaurant Basic Info Component
 *
 * Displays core restaurant information including address, phone, website,
 * price level, opening hours, and business status
 */

import React from "react";
import { InfoSection, InfoRow } from "../../../../../../components/common";
import {
  MapPin,
  Phone,
  Globe,
  DollarSign,
  Clock,
  Calendar,
} from "lucide-react";

interface OpeningHours {
  open_now?: boolean;
  weekday_text?: string[];
}

interface RestaurantBasicInfoProps {
  formattedAddress?: string;
  vicinity?: string;
  formattedPhoneNumber?: string;
  internationalPhoneNumber?: string;
  website?: string;
  priceLevel?: number;
  openingHours?: OpeningHours;
  businessStatus?: string;
}

export const RestaurantBasicInfo: React.FC<RestaurantBasicInfoProps> = ({
  formattedAddress,
  vicinity,
  formattedPhoneNumber,
  internationalPhoneNumber,
  website,
  priceLevel,
  openingHours,
  businessStatus,
}) => {
  const priceDisplay = priceLevel ? "€".repeat(priceLevel) : "N/A";
  const isCurrentlyOpen = openingHours?.open_now;
  const statusDisplay = businessStatus || "Unknown";

  return (
    <InfoSection title="Information">
      {/* Address */}
      {(formattedAddress || vicinity) && (
        <InfoRow
          label="Address"
          value={formattedAddress || vicinity}
          icon={<MapPin className="w-4 h-4" />}
          vertical
        />
      )}

      {/* Phone Number */}
      {(formattedPhoneNumber || internationalPhoneNumber) && (
        <InfoRow
          label="Phone"
          value={
            <a
              href={`tel:${formattedPhoneNumber || internationalPhoneNumber}`}
              className="text-blue-600 hover:underline"
            >
              {formattedPhoneNumber || internationalPhoneNumber}
            </a>
          }
          icon={<Phone className="w-4 h-4" />}
        />
      )}

      {/* Website */}
      {website && (
        <InfoRow
          label="Website"
          value={
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {website}
            </a>
          }
          icon={<Globe className="w-4 h-4" />}
          vertical
        />
      )}

      {/* Price Level */}
      {priceLevel && (
        <InfoRow
          label="Price Level"
          value={priceDisplay}
          icon={<DollarSign className="w-4 h-4" />}
        />
      )}

      {/* Opening Hours */}
      {isCurrentlyOpen !== undefined && (
        <InfoRow
          label="Hours"
          value={
            <div className="space-y-2">
              <span
                className={`font-medium ${
                  isCurrentlyOpen ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCurrentlyOpen ? "Open Now" : "Closed"}
              </span>
              {openingHours?.weekday_text && (
                <div className="space-y-1 text-sm text-gray-600">
                  {openingHours.weekday_text.map((day, index) => (
                    <p key={index}>{day}</p>
                  ))}
                </div>
              )}
            </div>
          }
          icon={<Clock className="w-4 h-4" />}
          vertical
        />
      )}

      {/* Business Status */}
      {statusDisplay && (
        <InfoRow
          label="Business Status"
          value={statusDisplay}
          icon={<Calendar className="w-4 h-4" />}
        />
      )}
    </InfoSection>
  );
};
