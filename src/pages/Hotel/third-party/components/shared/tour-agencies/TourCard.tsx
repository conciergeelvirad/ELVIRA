/**
 * Tour Card Component
 *
 * Wrapper around ThirdPartyCard that transforms Amadeus Activity data
 * into the generic ThirdPartyData format.
 */

import { ThirdPartyCard } from "../third-party-shared/ThirdPartyCard";
import type { ThirdPartyData } from "../third-party-shared/types";
import type { AmadeusActivity } from "../../../../../../services/amadeus/types";
import type { ApprovalStatus } from "../../../../../../types/approved-third-party-places";

interface TourCardProps {
  tour: AmadeusActivity;
  onView?: (tour: AmadeusActivity) => void;
  onApprove?: (tour: AmadeusActivity) => void;
  onReject?: (tour: AmadeusActivity) => void;
  onToggleRecommended?: (tour: AmadeusActivity) => void;
  currentStatus?: ApprovalStatus | null;
  isRecommended?: boolean;
  isLoading?: boolean;
}

/**
 * Extract activity categories from tour name/description
 */
function extractActivityCategories(tour: AmadeusActivity): string[] {
  const categories: string[] = [];

  // Extract from category field (if present)
  if (tour.category) {
    categories.push(tour.category);
  }

  // Extract from tags (if present)
  if (tour.tags && tour.tags.length > 0) {
    categories.push(...tour.tags);
  }

  // Common activity keywords to extract from name
  const keywords = [
    "walking tour",
    "food tour",
    "bike tour",
    "cultural",
    "adventure",
    "museum",
    "sightseeing",
    "cruise",
    "day trip",
    "excursion",
    "wine tasting",
    "cooking class",
  ];

  const lowerName = tour.name.toLowerCase();
  for (const keyword of keywords) {
    if (lowerName.includes(keyword)) {
      categories.push(
        keyword
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      );
    }
  }

  return [...new Set(categories)]; // Remove duplicates
}

export const TourCard = ({
  tour,
  onView,
  onApprove,
  onReject,
  onToggleRecommended,
  currentStatus,
  isRecommended = false,
}: TourCardProps) => {
  // Transform Amadeus Activity data to generic ThirdPartyData format
  const genericData: ThirdPartyData = {
    id: tour.id,
    name: tour.name,
    type: "tour",
    rating: tour.rating,
    location: {
      address: tour.shortDescription || "Tour activity in your area",
      latitude: tour.geoCode?.latitude || 0,
      longitude: tour.geoCode?.longitude || 0,
      displayText: `${tour.geoCode?.latitude.toFixed(
        4
      )}°N, ${tour.geoCode?.longitude.toFixed(4)}°E`,
    },
    categories: extractActivityCategories(tour),
    images: tour.pictures,
    description: tour.shortDescription,
    shortDescription: tour.shortDescription,
    price: tour.price
      ? {
          amount: String(tour.price.amount),
          currency: tour.price.currency,
        }
      : undefined,
    status: {
      isApproved: currentStatus === "approved",
      isRecommended: isRecommended,
      isPending: currentStatus === "pending",
      isRejected: currentStatus === "rejected",
    },
    metadata: {
      duration: undefined, // Duration not available in new API response
      bookingLink: tour.bookingLink,
      activityType: extractActivityCategories(tour),
    },
    amadeusId: tour.id,
  };

  return (
    <ThirdPartyCard
      {...genericData}
      onView={() => {
        console.log("[TourCard] View clicked for tour:", tour.id);
        onView?.(tour);
      }}
      onApprove={() => {
        console.log("[TourCard] Approve clicked for tour:", tour.id);
        onApprove?.(tour);
      }}
      onReject={() => {
        console.log("[TourCard] Reject clicked for tour:", tour.id);
        onReject?.(tour);
      }}
      onRecommend={() => {
        console.log("[TourCard] Recommend clicked for tour:", tour.id);
        onToggleRecommended?.(tour);
      }}
    />
  );
};
