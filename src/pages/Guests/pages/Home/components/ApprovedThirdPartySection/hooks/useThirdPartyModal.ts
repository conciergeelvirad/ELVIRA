/**
 * useThirdPartyModal Hook
 *
 * Manages modal state for displaying restaurant and tour details
 */

import { useState } from "react";
import type { Restaurant } from "../../../../../../../services/googlePlaces.service";
import type { AmadeusActivity } from "../../../../../../../services/amadeus/types";
import type { RecommendedItem } from "../../../../../../../hooks/queries";

export const useThirdPartyModal = () => {
  const [selectedItem, setSelectedItem] = useState<RecommendedItem | null>(
    null
  );
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [selectedTour, setSelectedTour] = useState<AmadeusActivity | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle restaurant click
  const handleRestaurantClick = (
    cardData: RecommendedItem,
    restaurant: Restaurant
  ) => {
    setSelectedItem(cardData);
    setSelectedRestaurant(restaurant);
    setSelectedTour(null);
    setIsModalOpen(true);
  };

  // Handle tour click
  const handleTourClick = (
    cardData: RecommendedItem,
    tour: AmadeusActivity
  ) => {
    setSelectedItem(cardData);
    setSelectedTour(tour);
    setSelectedRestaurant(null);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedItem(null);
      setSelectedRestaurant(null);
      setSelectedTour(null);
    }, 300); // Clear after animation
  };

  return {
    selectedItem,
    selectedRestaurant,
    selectedTour,
    isModalOpen,
    handleRestaurantClick,
    handleTourClick,
    handleCloseModal,
  };
};
