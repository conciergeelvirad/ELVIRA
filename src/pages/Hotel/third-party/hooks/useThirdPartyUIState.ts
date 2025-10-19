/**
 * Custom hook for managing third-party page UI state
 *
 * Centralizes all UI state management for the third-party page:
 * - Search queries
 * - View modes
 * - Radius settings
 * - Selected items
 */

import { useState } from "react";
import type { Restaurant } from "../../../../services/googlePlaces.service";

export const useThirdPartyUIState = () => {
  // Restaurant UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [radius, setRadius] = useState(5000); // Default 5km in meters
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  // Tour UI state
  const [tourSearchQuery, setTourSearchQuery] = useState("");
  const [tourViewMode, setTourViewMode] = useState<"grid" | "list">("grid");
  const [tourRadius, setTourRadius] = useState(10); // Default 10km

  return {
    // Restaurant state
    restaurantSearchQuery: searchQuery,
    setRestaurantSearchQuery: setSearchQuery,
    restaurantViewMode: viewMode,
    setRestaurantViewMode: setViewMode,
    restaurantRadius: radius,
    setRestaurantRadius: setRadius,
    selectedRestaurant,
    setSelectedRestaurant,

    // Tour state
    tourSearchQuery,
    setTourSearchQuery,
    tourViewMode,
    setTourViewMode,
    tourRadius,
    setTourRadius,
  };
};
