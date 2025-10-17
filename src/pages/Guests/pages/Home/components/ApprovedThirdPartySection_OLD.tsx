/**
 * Approved Third Party Section Component
 *
 * Displays approved restaurants and tour agencies in the Experiences category
 * Reuses existing infrastructure from ThirdPartyManagementPage:
 * - useApprovedPlaces to get approved items from approved_third_party_places table
 * - useNearbyRestaurantsWithStatus for fetching restaurants with photos
 * - useNearbyToursWithStatus for fetching tours with photos
 * - Filters to show only approved items
 */

import { useRef, useEffect, useMemo, useState } from "react";
import { useApprovedPlaces } from "../../../../../hooks/queries/approved-places/useApprovedPlacesQueries";
import { useNearbyRestaurantsWithStatus } from "../../../../../hooks/queries/google-places/useNearbyRestaurants";
import { useNearbyToursWithStatus } from "../../../../../hooks/queries/amadeus";
import { RecommendedItemCard } from "./RecommendedSection/RecommendedItemCard";
import { RecommendedItemModal } from "./RecommendedSection/RecommendedItemModal";
import type { Restaurant } from "../../../../../services/googlePlaces.service";
import type { AmadeusActivity } from "../../../../../services/amadeus/types";
import type { RecommendedItem } from "../../../../../hooks/queries";

interface ApprovedThirdPartySectionProps {
  hotelId: string;
}

// Helper function to transform restaurant data to RecommendedItemCard format
const transformRestaurantToCard = (restaurant: Restaurant) => ({
  id: restaurant.place_id,
  type: "menu_item" as const,
  title: restaurant.name,
  description: restaurant.vicinity || restaurant.formatted_address || "",
  price: undefined, // Price level is not a monetary price, so we skip it
  imageUrl: restaurant.photo_url || "",
  category: "Restaurant",
});

// Helper function to transform tour data to RecommendedItemCard format
const transformTourToCard = (tour: AmadeusActivity) => {
  // Safely parse price to number
  const priceAmount = tour.price?.amount;
  const priceNumber = priceAmount ? Number(priceAmount) : undefined;
  const validPrice =
    priceNumber && !isNaN(priceNumber) ? priceNumber : undefined;

  return {
    id: tour.id,
    type: "amenity" as const,
    title: tour.name,
    description: tour.shortDescription || "",
    price: validPrice,
    imageUrl: tour.pictures?.[0] || "",
    category: "Tour",
  };
};

export function ApprovedThirdPartySection({
  hotelId,
}: ApprovedThirdPartySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Modal state - store both the card data and the full source data
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

  // Fetch approved places from the correct table (approved_third_party_places)
  const { data: approvedPlaces = [], isLoading: loadingApproved } =
    useApprovedPlaces(hotelId);

  // Filter only approved items (not rejected or pending)
  const approvedOnly = useMemo(
    () => approvedPlaces.filter((p) => p.status === "approved"),
    [approvedPlaces]
  );

  // Fetch all nearby restaurants with photos
  const {
    restaurants,
    isLoading: loadingRestaurants,
    isError: errorRestaurants,
  } = useNearbyRestaurantsWithStatus({
    hotelId,
    radius: 5000, // 5km radius
  });

  // Fetch all nearby tours with photos
  const {
    tours,
    isLoading: loadingTours,
    isError: errorTours,
  } = useNearbyToursWithStatus({
    hotelId,
    radius: 10, // 10km radius for tours
  });

  // Filter to get only approved restaurants
  const approvedRestaurants = useMemo(() => {
    const approvedPlaceIds = approvedOnly.map((p) => p.place_id);

    const filtered = restaurants.filter((restaurant) =>
      approvedPlaceIds.includes(restaurant.place_id)
    );

    return filtered;
  }, [approvedOnly, restaurants]);

  // Filter to get only approved tours
  const approvedTours = useMemo(() => {
    const approvedTourIds = approvedOnly.map((p) => p.place_id);

    const filtered = tours.filter((tour) => approvedTourIds.includes(tour.id));

    return filtered;
  }, [approvedOnly, tours]);

  // Combine approved items for display
  const totalApprovedItems = approvedRestaurants.length + approvedTours.length;

  // Auto-scroll effect
  useEffect(() => {
    if (!scrollContainerRef.current || totalApprovedItems === 0) return;

    const container = scrollContainerRef.current;
    let scrollPosition = 0;
    let animationFrameId: number;

    const scroll = () => {
      scrollPosition += 0.5;
      if (scrollPosition >= container.scrollWidth / 2) {
        scrollPosition = 0;
      }
      container.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scroll);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [totalApprovedItems]);

  // Loading state
  if (loadingApproved || loadingRestaurants || loadingTours) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 px-4">
          <span className="text-blue-600">Recommended</span> for You
        </h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] h-[320px] bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (errorRestaurants || errorTours) {
    return (
      <div className="mb-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 text-sm">
            Error loading recommendations. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (totalApprovedItems === 0) {
    return (
      <div className="mb-8 px-4">
        <h2 className="text-xl font-bold mb-4">
          <span className="text-blue-600">Recommended</span> for You
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-sm">
            No recommendations available yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        {/* Section Header */}
        <h2 className="text-xl font-bold mb-4 px-4">
          <span className="text-blue-600">Recommended</span> for You
        </h2>

        {/* Scrolling Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4"
        >
          {/* Render Approved Restaurants */}
          {approvedRestaurants.map((restaurant: Restaurant) => {
            const cardData = transformRestaurantToCard(restaurant);
            return (
              <RecommendedItemCard
                key={cardData.id}
                {...cardData}
                onClick={() => handleRestaurantClick(cardData, restaurant)}
              />
            );
          })}

          {/* Render Approved Tours */}
          {approvedTours.map((tour: AmadeusActivity) => {
            const cardData = transformTourToCard(tour);
            return (
              <RecommendedItemCard
                key={cardData.id}
                {...cardData}
                onClick={() => handleTourClick(cardData, tour)}
              />
            );
          })}
        </div>

        {/* Scroll Hint */}
        <div className="px-4 mt-2">
          <p className="text-xs text-gray-400 text-center">
            Swipe to see more recommendations →
          </p>
        </div>
      </div>

      {/* Modal for item details */}
      <RecommendedItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        hideActionButtons={true}
        restaurant={selectedRestaurant}
        tour={selectedTour}
      />
    </>
  );
}
