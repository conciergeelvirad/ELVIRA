/**
 * Amenities Hooks Module
 *
 * Centralized exports for all amenities-related hooks:
 * - CRUD operations for amenities and requests
 * - Page data fetching and subscriptions
 * - Page content generation
 */

export { useAmenityCRUD } from "./useAmenityCRUD";
export type { EnhancedAmenity } from "./useAmenityCRUD";

export { useAmenityRequestCRUD } from "./useAmenityRequestCRUD";
export type { EnhancedAmenityRequest } from "./useAmenityRequestCRUD";

export { useAmenitiesPageData } from "./useAmenitiesPageData";
export { useAmenitiesPageContent } from "./useAmenitiesPageContent";
