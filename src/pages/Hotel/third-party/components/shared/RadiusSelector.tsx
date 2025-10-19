/**
 * Radius Selector Component
 *
 * Component for selecting search radius for nearby places.
 * Allows users to choose how far to search from the hotel location.
 */

import React from "react";
import { MapPin } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface RadiusSelectorProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  onRefetch?: () => void;
  location?: PlaceLocation | null;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PRESET_RADII = [
  { value: 1000, label: "1 km" },
  { value: 2000, label: "2 km" },
  { value: 5000, label: "5 km" },
  { value: 10000, label: "10 km" },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format radius value for display
 */
const formatRadius = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Radius selector with slider and preset buttons
 *
 * @example
 * <RadiusSelector
 *   radius={5000}
 *   onRadiusChange={setRadius}
 *   onRefetch={refetchPlaces}
 *   location={hotelLocation}
 * />
 */
export const RadiusSelector: React.FC<RadiusSelectorProps> = ({
  radius,
  onRadiusChange,
  onRefetch,
  location,
  className = "",
}) => {
  const handlePresetClick = (presetRadius: number) => {
    onRadiusChange(presetRadius);
    if (onRefetch) {
      onRefetch();
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 ${className}`}
    >
      {/* Compact inline layout */}
      <div className="flex items-center justify-between gap-4">
        {/* Label and current radius */}
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
            Search Radius:
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {formatRadius(radius)}
          </span>
        </div>

        {/* Preset Buttons - inline */}
        <div className="flex items-center gap-1.5">
          {PRESET_RADII.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                radius === preset.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Refetch Button (if provided) - compact */}
        {onRefetch && (
          <button
            onClick={onRefetch}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
          >
            Update
          </button>
        )}
      </div>

      {/* Location info - very compact */}
      {location && (
        <p className="text-[10px] text-gray-400 mt-2">
          Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
};
