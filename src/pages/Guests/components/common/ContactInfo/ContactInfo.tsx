/**
 * Contact Info Component
 *
 * Reusable component for displaying contact information (address, phone, website)
 * with icons and proper formatting
 */

import { MapPin, Phone, Globe, ExternalLink } from "lucide-react";

interface ContactInfoProps {
  address?: string;
  phone?: string;
  website?: string;
  name?: string;
  placeId?: string;
  className?: string;
}

export const ContactInfo = ({
  address,
  phone,
  website,
  name,
  placeId,
  className = "",
}: ContactInfoProps) => {
  if (!address && !phone && !website) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Address with Google Maps Link */}
      {address && (
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 flex items-start justify-between gap-2">
            <span className="text-sm text-gray-700">{address}</span>
            {name && placeId && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  name + " " + address
                )}&query_place_id=${placeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                title="Open in Google Maps"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Phone Number */}
      {phone && (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <a
            href={`tel:${phone}`}
            className="text-sm text-blue-600 hover:underline"
          >
            {phone}
          </a>
        </div>
      )}

      {/* Website */}
      {website && (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline truncate"
          >
            Visit Website
          </a>
        </div>
      )}
    </div>
  );
};
