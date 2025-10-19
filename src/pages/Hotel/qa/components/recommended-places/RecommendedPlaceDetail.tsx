/**
 * Recommended Place Detail Modal Component
 *
 * Displays detailed information about a recommended place.
 */

import { recommendedPlaceDetailFields } from "./RecommendedPlaceColumns";
import type { RecommendedPlace } from "../../../../../hooks/queries/hotel-management/recommended-places";

interface RecommendedPlaceDetailProps {
  place: RecommendedPlace;
}

/**
 * Recommended Place detail modal content
 */
export const RecommendedPlaceDetail = ({
  place,
}: RecommendedPlaceDetailProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {recommendedPlaceDetailFields.map((field) => {
        const Icon = field.icon;
        const value =
          typeof field.accessor === "function"
            ? field.accessor(place)
            : place[field.key as keyof RecommendedPlace];

        return (
          <div key={field.key} className="flex items-start space-x-3">
            {Icon && (
              <div className="mt-1">
                <Icon className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">{field.label}</p>
              <p className="mt-1 text-sm text-gray-900 break-words whitespace-pre-wrap">
                {typeof value === "string" || typeof value === "number"
                  ? value
                  : value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
