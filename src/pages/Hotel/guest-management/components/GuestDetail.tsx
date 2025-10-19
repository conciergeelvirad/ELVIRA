/**
 * Guest Detail Modal Component
 *
 * Displays detailed information about a guest including personal data.
 */

import { guestDetailFields } from "./GuestColumns";
import type { GuestWithPersonalData } from "../../../../hooks/queries/hotel-management/guests";

interface GuestDetailProps {
  guest: GuestWithPersonalData;
}

/**
 * Guest detail modal content
 */
export const GuestDetail = ({ guest }: GuestDetailProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {guestDetailFields.map((field) => {
        const Icon = field.icon;
        const value =
          typeof field.accessor === "function"
            ? field.accessor(guest)
            : guest[field.key as keyof GuestWithPersonalData];

        return (
          <div key={field.key} className="flex items-start space-x-3">
            {Icon && (
              <div className="mt-1">
                <Icon className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">{field.label}</p>
              <p className="mt-1 text-sm text-gray-900 break-words">
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
