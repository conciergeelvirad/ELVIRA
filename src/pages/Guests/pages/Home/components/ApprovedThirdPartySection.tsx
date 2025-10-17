/**
 * Approved Third Party Section Component
 *
 * Displays approved restaurants and tour agencies in the Experiences category
 * 
 * Refactored to use:
 * - useApprovedRestaurants: Fetch and filter approved restaurants
 * - useApprovedTours: Fetch and filter approved tours
 * - useThirdPartyModal: Manage modal state
 * - SectionCarousel: Reusable horizontal scroll component
 * - SectionStates: Loading, error, and empty states
 */

import { useApprovedRestaurants, useApprovedTours, useThirdPartyModal } from "./ApprovedThirdPartySection/hooks";
import { SectionCarousel } from "../../../components/common/SectionCarousel";
import { SectionLoading, SectionError, SectionEmpty } from "./ApprovedThirdPartySection/components/SectionStates";
import { transformRestaurantToCard, transformTourToCard } from "./ApprovedThirdPartySection/utils/transformers";
import { RecommendedItemCard } from "./RecommendedSection/RecommendedItemCard";
import { RecommendedItemModal } from "./RecommendedSection/RecommendedItemModal";
import type { Restaurant } from "../../../../../services/googlePlaces.service";
import type { AmadeusActivity } from "../../../../../services/amadeus/types";

interface ApprovedThirdPartySectionProps {
  hotelId: string;
}

export function ApprovedThirdPartySection({ hotelId }: ApprovedThirdPartySectionProps) {
  // Fetch approved restaurants and tours
  const {
    restaurants: approvedRestaurants,
    isLoading: loadingRestaurants,
    isError: errorRestaurants,
  } = useApprovedRestaurants(hotelId);

  const {
    tours: approvedTours,
    isLoading: loadingTours,
    isError: errorTours,
  } = useApprovedTours(hotelId);

  // Modal state management
  const {
    selectedItem,
    selectedRestaurant,
    selectedTour,
    isModalOpen,
    handleRestaurantClick,
    handleTourClick,
    handleCloseModal,
  } = useThirdPartyModal();

  // Calculate totals
  const totalApprovedItems = approvedRestaurants.length + approvedTours.length;
  const isLoading = loadingRestaurants || loadingTours;
  const hasError = errorRestaurants || errorTours;

  // Loading state
  if (isLoading) {
    return <SectionLoading title="Recommended for You" count={3} />;
  }

  // Error state
  if (hasError) {
    return <SectionError message="Error loading recommendations. Please try again later." />;
  }

  // Empty state
  if (totalApprovedItems === 0) {
    return <SectionEmpty title="Recommended for You" message="No recommendations available yet" />;
  }

  return (
    <>
      <SectionCarousel
        title={
          <>
            <span className="text-blue-600">Recommended</span> for You
          </>
        }
        showScrollHint={true}
        autoScroll={true}
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
      </SectionCarousel>

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
