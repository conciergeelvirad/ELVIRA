import React from "react";
import { AmenityRequest } from "../../../../../hooks/queries/hotel-management/amenity-requests";
import { getDetailFields } from "./AmenityRequestColumns";

interface AmenityRequestDetailProps {
  item: AmenityRequest | Record<string, unknown>;
}

export const AmenityRequestDetail: React.FC<AmenityRequestDetailProps> = ({
  item,
}) => {
  const request = item as unknown as AmenityRequest;

  return (
    <div className="space-y-2">
      {/* Request Details */}
      {getDetailFields(request).map((field, index) => (
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
