/**
 * Restaurant Coordinates Component
 *
 * Displays the geographic coordinates (latitude/longitude) of the restaurant
 */

import React from "react";

interface Location {
  lat: number;
  lng: number;
}

interface RestaurantCoordinatesProps {
  location: Location;
}

export const RestaurantCoordinates: React.FC<RestaurantCoordinatesProps> = ({
  location,
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Coordinates</h3>
      <p className="text-sm text-gray-600">
        Latitude: {location.lat.toFixed(6)}
      </p>
      <p className="text-sm text-gray-600">
        Longitude: {location.lng.toFixed(6)}
      </p>
    </div>
  );
};
