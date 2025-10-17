/**
 * Amenity Transformer Utilities
 *
 * Utility functions for transforming, filtering, sorting, and formatting amenity data.
 */

import type { Amenity } from "./amenity.types";

// ============================================================================
// Filtering Utilities
// ============================================================================

/**
 * Filters amenities by active status
 */
export const filterActiveAmenities = (amenities: Amenity[]): Amenity[] => {
  return amenities.filter((amenity) => amenity.is_active);
};

/**
 * Filters amenities by category
 */
export const filterByCategory = (
  amenities: Amenity[],
  category: string
): Amenity[] => {
  return amenities.filter((amenity) => amenity.category === category);
};

/**
 * Filters amenities by hotel recommendation status
 */
export const filterRecommendedAmenities = (amenities: Amenity[]): Amenity[] => {
  return amenities.filter((amenity) => amenity.hotel_recommended);
};

/**
 * Filters free amenities
 */
export const filterFreeAmenities = (amenities: Amenity[]): Amenity[] => {
  return amenities.filter((amenity) => !amenity.price || amenity.price === 0);
};

/**
 * Filters paid amenities
 */
export const filterPaidAmenities = (amenities: Amenity[]): Amenity[] => {
  return amenities.filter((amenity) => amenity.price && amenity.price > 0);
};

/**
 * Searches amenities by name or description
 */
export const searchAmenities = (
  amenities: Amenity[],
  searchTerm: string
): Amenity[] => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return amenities;

  return amenities.filter((amenity) => {
    const name = amenity.name?.toLowerCase() || "";
    const description = amenity.description?.toLowerCase() || "";
    const category = amenity.category?.toLowerCase() || "";

    return (
      name.includes(term) ||
      description.includes(term) ||
      category.includes(term)
    );
  });
};

// ============================================================================
// Sorting Utilities
// ============================================================================

/**
 * Sorts amenities by name (ascending)
 */
export const sortAmenitiesByName = (amenities: Amenity[]): Amenity[] => {
  return [...amenities].sort((a, b) => {
    const nameA = a.name?.toLowerCase() || "";
    const nameB = b.name?.toLowerCase() || "";
    return nameA.localeCompare(nameB);
  });
};

/**
 * Sorts amenities by category
 */
export const sortAmenitiesByCategory = (amenities: Amenity[]): Amenity[] => {
  return [...amenities].sort((a, b) => {
    const catA = a.category?.toLowerCase() || "";
    const catB = b.category?.toLowerCase() || "";
    return catA.localeCompare(catB);
  });
};

/**
 * Sorts amenities by price (ascending)
 */
export const sortAmenitiesByPrice = (amenities: Amenity[]): Amenity[] => {
  return [...amenities].sort((a, b) => {
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    return priceA - priceB;
  });
};

/**
 * Sorts amenities by recommendation status (recommended first)
 */
export const sortAmenitiesByRecommendation = (
  amenities: Amenity[]
): Amenity[] => {
  return [...amenities].sort((a, b) => {
    if (a.hotel_recommended === b.hotel_recommended) return 0;
    return a.hotel_recommended ? -1 : 1;
  });
};

// ============================================================================
// Grouping Utilities
// ============================================================================

/**
 * Groups amenities by category
 */
export const groupAmenitiesByCategory = (
  amenities: Amenity[]
): Record<string, Amenity[]> => {
  return amenities.reduce((acc, amenity) => {
    const category = amenity.category || "other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);
};

/**
 * Groups amenities by price type (free vs paid)
 */
export const groupAmenitiesByPriceType = (
  amenities: Amenity[]
): { free: Amenity[]; paid: Amenity[] } => {
  return amenities.reduce(
    (acc, amenity) => {
      if (!amenity.price || amenity.price === 0) {
        acc.free.push(amenity);
      } else {
        acc.paid.push(amenity);
      }
      return acc;
    },
    { free: [], paid: [] } as { free: Amenity[]; paid: Amenity[] }
  );
};

/**
 * Groups amenities by active status
 */
export const groupAmenitiesByActiveStatus = (
  amenities: Amenity[]
): { active: Amenity[]; inactive: Amenity[] } => {
  return amenities.reduce(
    (acc, amenity) => {
      if (amenity.is_active) {
        acc.active.push(amenity);
      } else {
        acc.inactive.push(amenity);
      }
      return acc;
    },
    { active: [], inactive: [] } as {
      active: Amenity[];
      inactive: Amenity[];
    }
  );
};

// ============================================================================
// Data Extraction Utilities
// ============================================================================

/**
 * Extracts unique categories from amenities
 */
export const getUniqueCategories = (amenities: Amenity[]): string[] => {
  const categories = new Set(
    amenities
      .map((amenity) => amenity.category)
      .filter((category): category is string => !!category)
  );
  return Array.from(categories).sort();
};

/**
 * Gets active amenities only
 */
export const getActiveAmenities = (amenities: Amenity[]): Amenity[] => {
  return amenities.filter((amenity) => amenity.is_active);
};

/**
 * Calculates total cost of selected amenities
 */
export const calculateTotalCost = (amenities: Amenity[]): number => {
  return amenities.reduce((total, amenity) => {
    return total + (amenity.price || 0);
  }, 0);
};

/**
 * Gets amenities within a price range
 */
export const getAmenitiesInPriceRange = (
  amenities: Amenity[],
  minPrice: number,
  maxPrice: number
): Amenity[] => {
  return amenities.filter((amenity) => {
    const price = amenity.price || 0;
    return price >= minPrice && price <= maxPrice;
  });
};

// ============================================================================
// Status Utilities
// ============================================================================

/**
 * Checks if an amenity is available (active)
 */
export const isAmenityAvailable = (amenity: Amenity): boolean => {
  return amenity.is_active;
};

/**
 * Gets amenity status text
 */
export const getAmenityStatus = (amenity: Amenity): string => {
  return amenity.is_active ? "Active" : "Inactive";
};

/**
 * Gets amenity status color for badges
 */
export const getAmenityStatusColor = (amenity: Amenity): string => {
  return amenity.is_active ? "green" : "gray";
};

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Formats amenity price
 */
export const formatAmenityPrice = (amenity: Amenity): string => {
  if (!amenity.price || amenity.price === 0) {
    return "Free";
  }
  return `$${amenity.price.toFixed(2)}`;
};

/**
 * Formats amenity summary
 */
export const formatAmenitySummary = (amenity: Amenity): string => {
  const name = amenity.name || "Unknown Amenity";
  const price = formatAmenityPrice(amenity);
  const status = getAmenityStatus(amenity);
  return `${name} - ${price} (${status})`;
};

/**
 * Formats category name for display
 */
export const formatCategoryName = (category: string): string => {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
