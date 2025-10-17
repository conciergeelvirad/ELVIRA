// Hotel Page Hooks Exports

// Shop hooks - organized in subfolder
export {
  useProductCRUD,
  useShopOrderCRUD,
  useShopPageData,
  useShopPageContent,
} from "./shop";
export type { EnhancedProduct, EnhancedShopOrder } from "./shop";

// Amenities hooks - organized in subfolder
export {
  useAmenityCRUD,
  useAmenityRequestCRUD,
  useAmenitiesPageData,
  useAmenitiesPageContent,
} from "./amenities";
export type { EnhancedAmenity, EnhancedAmenityRequest } from "./amenities";

export { useAnnouncementCRUD } from "./useAnnouncementCRUD";
export type { EnhancedAnnouncement } from "./useAnnouncementCRUD";
export { useGuestCRUD } from "./useGuestCRUD";
export type { EnhancedGuest } from "./useGuestCRUD";
export { useQACRUD } from "./useQACRUD";
export type { EnhancedQA } from "./useQACRUD";
export { useRecommendedPlaceCRUD } from "./useRecommendedPlaceCRUD";
export type { EnhancedRecommendedPlace } from "./useRecommendedPlaceCRUD";
export { useRestaurantCRUD } from "./useRestaurantCRUD";
export { useMenuItemCRUD } from "./useMenuItemCRUD";
export { useDineInOrderCRUD } from "./useDineInOrderCRUD";
export { useStaffCRUD } from "./useStaffCRUD";
export { useTasksCRUD } from "./useTasksCRUD";
export { useAbsenceRequestsCRUD } from "./useAbsenceRequestsCRUD";
