/**
 * Third Party Actions Hook
 *
 * Custom hook that encapsulates all action handlers for third-party places management.
 * Handles approve, reject, toggle recommended, and view details actions.
 */

import { useState } from "react";
import {
  useUpsertApprovedPlace,
  useToggleRecommended,
} from "../queries/approved-places";
import type { Restaurant } from "../../services/googlePlaces.service";
import type { ApprovedThirdPartyPlace } from "../../types/approved-third-party-places";
import { getPlaceType } from "../../utils/domain/third-party";

// ============================================================================
// TYPES
// ============================================================================

export interface UseThirdPartyActionsParams {
  hotelId: string;
  approvedPlaces: ApprovedThirdPartyPlace[];
}

export interface UseThirdPartyActionsReturn {
  // Actions
  handleApprove: (restaurant: Restaurant) => Promise<void>;
  handleReject: (restaurant: Restaurant) => Promise<void>;
  handleToggleRecommended: (restaurant: Restaurant) => Promise<void>;
  handleViewDetails: (restaurant: Restaurant) => void;
  handleCloseDetails: () => void;

  // State
  selectedPlaceId: string | null;
  isDetailsModalOpen: boolean;
  isActionLoading: boolean;

  // Helpers
  getRecommendedStatus: (placeId: string) => boolean;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for managing third-party place actions
 *
 * @param params - Hook parameters
 * @returns Action handlers and state
 *
 * @example
 * const {
 *   handleApprove,
 *   handleReject,
 *   handleToggleRecommended,
 *   handleViewDetails,
 *   selectedPlaceId,
 *   isActionLoading
 * } = useThirdPartyActions({ hotelId, approvedPlaces });
 */
export const useThirdPartyActions = ({
  hotelId,
  approvedPlaces,
}: UseThirdPartyActionsParams): UseThirdPartyActionsReturn => {
  // State
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Mutations
  const upsertApprovedPlace = useUpsertApprovedPlace();
  const toggleRecommended = useToggleRecommended();

  const isActionLoading =
    upsertApprovedPlace.isPending || toggleRecommended.isPending;

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get recommended status for a place
   */
  const getRecommendedStatus = (placeId: string): boolean => {
    const place = approvedPlaces.find(
      (ap) => ap.place_id === placeId && ap.status === "approved"
    );
    return place?.recommended || false;
  };

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  /**
   * Approve a restaurant
   */
  const handleApprove = async (restaurant: Restaurant): Promise<void> => {
    try {
      console.log("[handleApprove] Incoming data:", restaurant);
      const placeType = getPlaceType(restaurant.types);
      console.log("[handleApprove] Detected place type:", placeType);

      const payload = {
        hotel_id: hotelId,
        place_id: restaurant.place_id,
        name: restaurant.name,
        // For tours, always use "restaurant" as type since that's what the schema allows
        type: restaurant.types.includes("travel_agency")
          ? "restaurant"
          : (placeType as "restaurant" | "bar" | "cafe" | "night_club"),
        status: "approved",
        google_data: restaurant,
        recommended: false,
      };

      console.log("[handleApprove] Sending payload:", payload);
      await upsertApprovedPlace.mutateAsync(payload);
    } catch (error) {
      console.error("Error approving place:", error);
      throw error;
    }
  };

  /**
   * Reject a restaurant
   */
  const handleReject = async (restaurant: Restaurant): Promise<void> => {
    try {
      await upsertApprovedPlace.mutateAsync({
        hotel_id: hotelId,
        place_id: restaurant.place_id,
        name: restaurant.name,
        type: getPlaceType(restaurant.types) as
          | "restaurant"
          | "bar"
          | "cafe"
          | "night_club",
        status: "rejected",
        google_data: restaurant,
      });
    } catch (error) {
      console.error("Error rejecting place:", error);
      throw error;
    }
  };

  /**
   * Toggle recommended status for a restaurant
   */
  const handleToggleRecommended = async (
    restaurant: Restaurant
  ): Promise<void> => {
    try {
      const currentStatus = getRecommendedStatus(restaurant.place_id);

      await toggleRecommended.mutateAsync({
        placeId: restaurant.place_id,
        hotelId: hotelId,
        currentStatus: currentStatus,
      });
    } catch (error) {
      console.error("Error toggling recommended status:", error);
      throw error;
    }
  };

  /**
   * View restaurant details
   */
  const handleViewDetails = (restaurant: Restaurant): void => {
    setSelectedPlaceId(restaurant.place_id);
    setIsDetailsModalOpen(true);
  };

  /**
   * Close details modal
   */
  const handleCloseDetails = (): void => {
    setSelectedPlaceId(null);
    setIsDetailsModalOpen(false);
  };

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Actions
    handleApprove,
    handleReject,
    handleToggleRecommended,
    handleViewDetails,
    handleCloseDetails,

    // State
    selectedPlaceId,
    isDetailsModalOpen,
    isActionLoading,

    // Helpers
    getRecommendedStatus,
  };
};
