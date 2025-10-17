/**
 * Restaurant Table Component
 *
 * Displays restaurants in a table format with sorting, filtering, and detail view
 * Refactored to use smaller, modular components
 */

import React from "react";
import {
  RestaurantTableHeader,
  RestaurantTableRow,
  RestaurantEmptyState,
} from "./restaurant-table";

export interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  business_status?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now?: boolean;
  };
  types?: string[];
}

interface RestaurantTableProps {
  restaurants: Restaurant[];
  onRowClick?: (restaurant: Restaurant) => void;
}

const TABLE_HEADERS = [
  { key: "name", label: "Restaurant Name", sortable: true },
  { key: "vicinity", label: "Address", sortable: false },
  { key: "rating", label: "Rating", sortable: true },
  { key: "price_level", label: "Price", sortable: true },
  { key: "status", label: "Status", sortable: false },
  { key: "actions", label: "Actions", sortable: false },
];

export const RestaurantTable: React.FC<RestaurantTableProps> = ({
  restaurants,
  onRowClick,
}) => {
  const [sortKey, setSortKey] = React.useState<string>("rating");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "desc"
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const sortedRestaurants = React.useMemo(() => {
    const sorted = [...restaurants];
    sorted.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortKey) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "rating":
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case "price_level":
          aValue = a.price_level || 0;
          bValue = b.price_level || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [restaurants, sortKey, sortDirection]);

  const openInGoogleMaps = (restaurant: Restaurant) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      restaurant.name
    )}&query_place_id=${restaurant.place_id}`;
    window.open(url, "_blank");
  };

  if (restaurants.length === 0) {
    return <RestaurantEmptyState />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <RestaurantTableHeader
            headers={TABLE_HEADERS}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRestaurants.map((restaurant) => (
              <RestaurantTableRow
                key={restaurant.place_id}
                restaurant={restaurant}
                onRowClick={onRowClick}
                onViewInMaps={openInGoogleMaps}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
