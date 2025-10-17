import React from "react";
import { Amenity } from "../../../../../hooks/queries/hotel-management/amenities";
import { getDetailFields } from "./AmenityColumns";

interface AmenityDetailProps {
  item: Amenity | Record<string, unknown>;
}

export const AmenityDetail: React.FC<AmenityDetailProps> = ({ item }) => {
  const amenity = item as unknown as Amenity;

  return (
    <div className="space-y-2">
      {/* Amenity Image */}
      {amenity.image_url && (
        <div className="mb-4">
          <img
            src={amenity.image_url}
            alt={amenity.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Amenity Details */}
      {getDetailFields(amenity).map((field, index) => (
        <div
          key={index}
          className="py-2 border-b border-gray-100 last:border-b-0"
        >
          <div className="grid grid-cols-2 items-center">
            <div>
              <span className="text-sm font-medium text-gray-500 uppercase">
                {field.label}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">
                {field.value?.toString() || "-"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
