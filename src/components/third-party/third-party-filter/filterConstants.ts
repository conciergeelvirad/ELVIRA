/**
 * Filter Constants for Third-Party Places
 *
 * Centralized configuration for filter options
 */

import type { ApprovalStatus } from "../../../types/approved-third-party-places";

export const PLACE_TYPES = [
  { value: "restaurant", label: "🍽️ Restaurant", icon: "🍽️" },
  { value: "bar", label: "🍺 Bar", icon: "🍺" },
  { value: "cafe", label: "☕ Cafe", icon: "☕" },
  { value: "night_club", label: "🎵 Night Club", icon: "🎵" },
] as const;

export const APPROVAL_STATUSES: {
  value: ApprovalStatus;
  label: string;
  icon: string;
}[] = [
  { value: "pending", label: "⏳ Pending", icon: "⏳" },
  { value: "approved", label: "✅ Approved", icon: "✅" },
  { value: "rejected", label: "❌ Rejected", icon: "❌" },
];

export const PRICE_LEVELS = [
  { value: 1, label: "€ - Inexpensive" },
  { value: 2, label: "€€ - Moderate" },
  { value: 3, label: "€€€ - Expensive" },
  { value: 4, label: "€€€€ - Very Expensive" },
] as const;

export const formatRating = (rating: number): string => {
  if (rating === 0) return "Any";
  return `${rating}+ ⭐`;
};
