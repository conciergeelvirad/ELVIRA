import { SettingsState } from "../../types";

/**
 * Mapping between settings toggles and navigation item IDs
 *
 * This controls which sidebar menu items are visible based on hotel settings.
 * - If a navigation item has a mapping, it will only show when the toggle is ON
 * - If no mapping exists (null), the item always shows (core features)
 */
export const SETTINGS_TO_NAVIGATION_MAP: Record<
  keyof SettingsState,
  string | null
> = {
  // Layout & Content - These don't control navigation items
  aboutSection: null, // Part of hotel info/settings, not a menu item
  doNotDisturb: null, // Guest feature, not a navigation item
  hotelPhotoGallery: null, // Part of settings, not a menu item

  // Guest Services - These control menu visibility
  hotelAmenities: "amenities", // Controls "AMENITIES" menu item
  hotelShop: "hotel-shop", // Controls "HOTEL SHOP" menu item
  toursExcursions: "third-party-management", // Controls "THIRD PARTY MANAGEMENT"
  roomServiceRestaurant: "hotel-restaurant", // Controls "HOTEL RESTAURANT" menu item
  localRestaurants: null, // Sub-feature, doesn't have its own menu
  liveChatSupport: "chat-management", // Controls "CHAT MANAGEMENT" menu item

  // Information & Communication - These control menu visibility
  hotelAnnouncements: "announcements", // Controls "ANNOUNCEMENTS" menu item
  qaRecommendations: "qa-recommendations", // Controls "Q&A + RECOMMENDATIONS" menu item
  emergencyContacts: "emergency-contacts", // Controls "EMERGENCY CONTACTS" menu item
  publicTransport: null, // Sub-feature, doesn't have its own menu
};

/**
 * Helper function to check if a navigation item should be visible
 *
 * Core navigation items (overview, staff, guests, AI, settings) always show.
 * Feature-based items show/hide based on hotel settings toggles.
 */
export const shouldShowNavigationItem = (
  navigationId: string,
  settings: SettingsState
): boolean => {
  // Find the setting key that controls this navigation item
  const settingKey = Object.entries(SETTINGS_TO_NAVIGATION_MAP).find(
    ([, navId]) => navId === navigationId
  )?.[0] as keyof SettingsState;

  // If no setting controls this nav item, always show it (core features)
  if (!settingKey) {
    console.log(
      `🔓 [Navigation] "${navigationId}" - Always visible (no toggle control)`
    );
    return true;
  }

  // Get the setting value (true = show, false = hide)
  const shouldShow = settings[settingKey];

  console.log(
    shouldShow ? "✅" : "❌",
    `[Navigation] "${navigationId}" controlled by "${settingKey}": ${
      shouldShow ? "VISIBLE" : "HIDDEN"
    }`
  );

  return shouldShow;
};
