/**
 * Product Constants
 *
 * Query keys and constants for product management.
 */

// Default hotel ID
export const DEFAULT_HOTEL_ID = "086e11e4-4775-4327-8448-3fa0ee7be0a5";

// Query key factory for products
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), { ...filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  categories: (hotelId: string) =>
    [...productKeys.all, "categories", hotelId] as const,
  miniBar: (hotelId: string) =>
    [...productKeys.all, "mini-bar", hotelId] as const,
};
