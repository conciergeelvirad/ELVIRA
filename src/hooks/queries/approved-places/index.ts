/**
 * Approved Places Query and Mutation Hooks
 *
 * Centralized exports for all approved third-party places related hooks.
 * This provides a clean public API for the rest of the application.
 */

// Query Keys
export { approvedPlacesKeys } from "./queryKeys";

// Query Hooks
export {
  useApprovedPlaces,
  useApprovedPlacesByStatus,
  useApprovedPlaceByPlaceId,
} from "./queries";

// Mutation Hooks - Create/Update
export { useUpsertApprovedPlace } from "./useUpsertApprovedPlace";
export { useUpdateApprovalStatus, useToggleRecommended } from "./mutations";

// Mutation Hooks - Delete
export { useDeleteApprovedPlace } from "./useDeleteApprovedPlace";

// Re-export types for convenience
export type {
  ApprovedThirdPartyPlace,
  CreateApprovedPlaceInput,
  UpdateApprovedPlaceInput,
  ApprovalStatus,
} from "../../../types/approved-third-party-places";
