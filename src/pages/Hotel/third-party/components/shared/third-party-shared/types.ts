/**
 * Generic Third-Party Place Types
 *
 * Unified interface for all third-party integrations (restaurants, tours, hotels, spas, etc.)
 * This allows components to be reusable across different third-party types.
 */

export type ThirdPartyType = "restaurant" | "tour" | "hotel" | "spa";

/**
 * Generic location data
 */
export interface LocationData {
  address?: string;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  displayText?: string;
}

/**
 * Generic price data
 * - For restaurants: price_level (1-4)
 * - For tours: amount + currency
 * - For hotels: price range
 */
export interface PriceData {
  level?: number; // 1-4 for restaurants (€, €€, €€€, €€€€)
  amount?: string; // Numeric amount for tours/hotels
  currency?: string; // Currency code (EUR, USD, etc.)
  min?: string; // Minimum price for ranges
  max?: string; // Maximum price for ranges
}

/**
 * Generic status data
 */
export interface StatusData {
  isApproved?: boolean;
  isRecommended?: boolean;
  isPending?: boolean;
  isRejected?: boolean;
}

/**
 * Type-specific metadata
 * Contains fields that are unique to specific third-party types
 */
export interface ThirdPartyMetadata {
  // Restaurant-specific
  openingHours?: string[];
  cuisine?: string[];
  phone?: string;
  website?: string;

  // Tour-specific
  duration?: string; // ISO 8601 duration (PT2H30M)
  bookingLink?: string;
  activityType?: string[];

  // Hotel-specific
  starRating?: number;
  amenities?: string[];
  checkIn?: string;
  checkOut?: string;

  // Spa-specific
  services?: string[];
  treatments?: string[];
}

/**
 * Generic Third-Party Place Data
 *
 * This is the unified interface that all third-party types must conform to.
 * Type-specific wrappers (RestaurantCard, TourCard, etc.) transform their
 * API data into this format.
 */
export interface ThirdPartyData {
  // Core fields (required)
  id: string;
  name: string;
  type: ThirdPartyType;

  // Common optional fields
  rating?: number;
  reviewCount?: number;
  location: LocationData;
  categories?: string[];
  images?: string[];
  description?: string;
  shortDescription?: string;

  // Price information
  price?: PriceData;

  // Status information
  status?: StatusData;

  // Type-specific metadata
  metadata?: ThirdPartyMetadata;

  // Google Places specific (for backward compatibility)
  googlePlaceId?: string;

  // Amadeus specific (for backward compatibility)
  amadeusId?: string;
}

/**
 * Props for generic third-party components
 */
export interface ThirdPartyCardProps extends ThirdPartyData {
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onRecommend?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface ThirdPartyListProps {
  items: ThirdPartyData[];
  type: ThirdPartyType;
  loading?: boolean;
  onView?: (item: ThirdPartyData) => void;
  onApprove?: (item: ThirdPartyData) => void;
  onReject?: (item: ThirdPartyData) => void;
  onRecommend?: (item: ThirdPartyData) => void;
}

export interface ThirdPartyDetailsModalProps {
  item: ThirdPartyData | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onRecommend?: () => void;
}

/**
 * Section data for generic card rendering
 */
export interface CardSection {
  id: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}
