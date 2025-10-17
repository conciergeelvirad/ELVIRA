// Hotel components main barrel export

// Emergency Contacts
export {
  EmergencyContactsDataView,
  EmergencyContactDetail,
  getTableColumns as getEmergencyContactTableColumns,
  getGridColumns as getEmergencyContactGridColumns,
  enhanceContact,
  FORM_FIELDS as EMERGENCY_CONTACT_FORM_FIELDS,
  getDetailFields as getEmergencyContactDetailFields,
} from "./emergency-contacts";

// Staff
export { StaffDetail, STAFF_FORM_FIELDS } from "./staff";

// Template
export {
  TemplateDataView,
  TemplateDetail,
  getTableColumns as getTemplateTableColumns,
  getGridColumns as getTemplateGridColumns,
  enhanceTemplate,
  TEMPLATE_FORM_FIELDS,
} from "./template";

// Page-specific component folders
// Note: Each page will have its own components subfolder
// Import from these folders as components are created:

// Shop
export {
  ProductsDataView,
  ProductDetail,
  getProductTableColumns,
  getProductGridColumns,
  enhanceProduct,
  PRODUCT_FORM_FIELDS,
  getProductDetailFields,
  ShopOrdersDataView,
  ShopOrderDetail,
  getShopOrderTableColumns,
  getShopOrderGridColumns,
  enhanceShopOrder,
  SHOP_ORDER_FORM_FIELDS,
  getShopOrderDetailFields,
} from "./shop";

// Amenities
export {
  AmenitiesDataView,
  AmenityDetail,
  getAmenityTableColumns,
  getAmenityGridColumns,
  enhanceAmenity,
  AMENITY_FORM_FIELDS,
  getAmenityDetailFields,
  AmenityRequestsDataView,
  AmenityRequestDetail,
  getAmenityRequestTableColumns,
  getAmenityRequestGridColumns,
  enhanceAmenityRequest,
  AMENITY_REQUEST_FORM_FIELDS,
  getAmenityRequestDetailFields,
  AmenitiesTab,
  RequestsTab,
} from "./amenities";

// Announcements
export {
  AnnouncementsDataView,
  AnnouncementDetail,
  getAnnouncementTableColumns,
  getAnnouncementGridColumns,
  enhanceAnnouncement,
  ANNOUNCEMENT_FORM_FIELDS,
  getAnnouncementDetailFields,
} from "./announcements";

// Guests
export {
  GuestsDataView,
  GuestDetail,
  guestTableColumns,
  guestGridColumns,
  guestDetailFields,
  GUEST_FORM_FIELDS,
} from "./guests";

// Q&A
export {
  QAsDataView,
  QADetail,
  qaTableColumns,
  qaGridColumns,
  qaDetailFields,
  QA_FORM_FIELDS,
} from "./qa";

// Recommended Places
export {
  RecommendedPlacesDataView,
  RecommendedPlaceDetail,
  recommendedPlaceTableColumns,
  recommendedPlaceGridColumns,
  recommendedPlaceDetailFields,
  RECOMMENDED_PLACE_FORM_FIELDS,
} from "./recommended-places";

// export * from "./chat-management";
// export * from "./dashboard";
// export * from "./restaurant";
// export * from "./settings";
// export * from "./third-party";
// export * from "./ai-support";
