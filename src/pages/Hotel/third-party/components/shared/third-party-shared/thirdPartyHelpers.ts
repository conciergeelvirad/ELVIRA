/**
 * Generic Third-Party Helper Utilities
 *
 * These utilities work across all third-party types (restaurants, tours, hotels, spas)
 */

import {
  UtensilsCrossed,
  MapPin,
  Hotel,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ThirdPartyType, PriceData, ThirdPartyData } from "./types";

export type BadgeData = {
  label: string;
  variant:
    | "success"
    | "warning"
    | "error"
    | "info"
    | "neutral"
    | "primary"
    | "default"
    | "outline"
    | "secondary";
  iconName?: "DollarSign" | "Clock" | "Star";
};

/**
 * Get icon component for third-party type
 */
export function getTypeIcon(type: ThirdPartyType): LucideIcon {
  switch (type) {
    case "restaurant":
      return UtensilsCrossed;
    case "tour":
      return MapPin;
    case "hotel":
      return Hotel;
    case "spa":
      return Sparkles;
    default:
      return MapPin;
  }
}

/**
 * Get display label for third-party type
 */
export function getTypeLabel(type: ThirdPartyType): string {
  switch (type) {
    case "restaurant":
      return "Restaurant";
    case "tour":
      return "Tour & Activity";
    case "hotel":
      return "Hotel";
    case "spa":
      return "Spa & Wellness";
    default:
      return "Place";
  }
}

/**
 * Get plural label for third-party type
 */
export function getTypePluralLabel(type: ThirdPartyType): string {
  switch (type) {
    case "restaurant":
      return "Restaurants";
    case "tour":
      return "Tours & Activities";
    case "hotel":
      return "Hotels";
    case "spa":
      return "Spas & Wellness";
    default:
      return "Places";
  }
}

/**
 * Format price based on type
 * - Restaurants: €, €€, €€€, €€€€
 * - Tours/Hotels: $50.00 USD
 */
export function formatPrice(
  price: PriceData | undefined,
  type: ThirdPartyType
): string {
  if (!price) return "N/A";

  // Restaurant price level
  if (type === "restaurant" && price.level) {
    return "€".repeat(Math.min(price.level, 4));
  }

  // Tours/Hotels with amount + currency
  if (price.amount && price.currency) {
    try {
      const amount = parseFloat(price.amount);
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: price.currency,
      }).format(amount);
    } catch {
      return `${price.amount} ${price.currency}`;
    }
  }

  // Price range
  if (price.min && price.max && price.currency) {
    return `${price.min}-${price.max} ${price.currency}`;
  }

  return "N/A";
}

/**
 * Format duration from ISO 8601 format
 * PT2H30M → "2h 30min"
 * PT45M → "45min"
 * P1D → "1 day"
 */
export function formatDuration(duration: string | undefined): string {
  if (!duration) return "N/A";

  const regex = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/;
  const matches = duration.match(regex);

  if (!matches) return duration;

  const [, days, hours, minutes] = matches;
  const parts: string[] = [];

  if (days) parts.push(`${days} day${parseInt(days) > 1 ? "s" : ""}`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}min`);

  return parts.length > 0 ? parts.join(" ") : duration;
}

/**
 * Parse duration to minutes for filtering/sorting
 */
export function parseDurationToMinutes(duration: string | undefined): number {
  if (!duration) return 0;

  const regex = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/;
  const matches = duration.match(regex);

  if (!matches) return 0;

  const [, days, hours, minutes] = matches;
  let total = 0;

  if (days) total += parseInt(days) * 24 * 60;
  if (hours) total += parseInt(hours) * 60;
  if (minutes) total += parseInt(minutes);

  return total;
}

/**
 * Get badge data for card display based on type
 */
export function getTypeBadges(data: ThirdPartyData): BadgeData[] {
  const badges: BadgeData[] = [];

  // Price badge
  if (data.price) {
    const priceLabel = formatPrice(data.price, data.type);
    if (priceLabel !== "N/A") {
      badges.push({
        label: priceLabel,
        variant: "outline",
        iconName: "DollarSign",
      });
    }
  }

  // Duration badge (for tours)
  if (data.type === "tour" && data.metadata?.duration) {
    badges.push({
      label: formatDuration(data.metadata.duration),
      variant: "secondary",
      iconName: "Clock",
    });
  }

  // Rating badge
  if (data.rating) {
    badges.push({
      label: `${data.rating.toFixed(1)}`,
      variant: "default",
      iconName: "Star",
    });
  }

  return badges;
}

/**
 * Format rating display with review count
 */
export function formatRating(
  rating: number | undefined,
  reviewCount: number | undefined
): string {
  if (!rating) return "No rating";

  const ratingStr = rating.toFixed(1);
  if (reviewCount) {
    return `${ratingStr} (${reviewCount.toLocaleString()} reviews)`;
  }

  return ratingStr;
}

/**
 * Get color class for rating
 */
export function getRatingColor(rating: number | undefined): string {
  if (!rating) return "text-gray-400";
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 4.0) return "text-green-500";
  if (rating >= 3.5) return "text-yellow-600";
  if (rating >= 3.0) return "text-yellow-500";
  return "text-orange-500";
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(
  text: string | undefined,
  maxLength: number
): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Format categories for display
 */
export function formatCategories(
  categories: string[] | undefined,
  maxDisplay: number = 3
): {
  visible: string[];
  remaining: number;
} {
  if (!categories || categories.length === 0) {
    return { visible: [], remaining: 0 };
  }

  const visible = categories.slice(0, maxDisplay);
  const remaining = Math.max(0, categories.length - maxDisplay);

  return { visible, remaining };
}

/**
 * Extract primary category (first one)
 */
export function getPrimaryCategory(
  categories: string[] | undefined
): string | undefined {
  return categories?.[0];
}

/**
 * Check if a place is approved
 */
export function isApproved(data: ThirdPartyData): boolean {
  return data.status?.isApproved === true;
}

/**
 * Check if a place is recommended
 */
export function isRecommended(data: ThirdPartyData): boolean {
  return data.status?.isRecommended === true;
}

/**
 * Get status label
 */
export function getStatusLabel(data: ThirdPartyData): string {
  if (data.status?.isApproved) return "Approved";
  if (data.status?.isPending) return "Pending";
  if (data.status?.isRejected) return "Rejected";
  return "Unknown";
}

/**
 * Format address for display
 */
export function formatAddress(location: ThirdPartyData["location"]): string {
  const parts: string[] = [];

  if (location.address) parts.push(location.address);
  if (location.city) parts.push(location.city);
  if (location.country) parts.push(location.country);

  return parts.join(", ") || "Address not available";
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}
