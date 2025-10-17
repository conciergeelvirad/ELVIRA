// Common types and interfaces
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Export all type modules
export * from "./navigation";
export * from "./table";
export * from "./search";

// Hotel and Settings Types
export interface HotelBranding {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export interface SettingsState {
  // Layout & Content
  aboutSection: boolean;
  doNotDisturb: boolean;
  hotelPhotoGallery: boolean;

  // Guest Services
  hotelAmenities: boolean;
  hotelShop: boolean;
  toursExcursions: boolean;
  roomServiceRestaurant: boolean;
  localRestaurants: boolean;
  liveChatSupport: boolean;

  // Information & Communication
  hotelAnnouncements: boolean;
  qaRecommendations: boolean;
  emergencyContacts: boolean;
  publicTransport: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  initials: string;
  settings: SettingsState;
  branding?: HotelBranding;
}

// Add your application-specific types here

// Table and Grid View Types
export * from "./table";
export * from "./chat";
