# Google Places Query Hooks - Refactored Structure

This directory contains React Query hooks for interacting with the Google Places API, refactored for better maintainability and scalability.

## 📁 File Structure

```
google-places/
├── index.ts                      # Main export file
├── queryKeys.ts                  # Centralized query keys factory
├── useGooglePlacesApiKey.ts     # API key management hook
├── useHotelLocation.ts          # Hotel location fetching hook
├── useNearbyRestaurants.ts      # Nearby restaurants hooks
├── usePlaceDetails.ts           # Place details hook
├── useGooglePlacesQueries.ts    # (DEPRECATED) Legacy file for backward compatibility
└── README.md                     # This file
```

## 🎯 Purpose

This refactoring breaks down a large monolithic query file into smaller, focused modules:

- **Better maintainability**: Each hook has its own file with clear responsibility
- **Improved scalability**: Easy to add new hooks without cluttering existing files
- **Better documentation**: Each file has detailed JSDoc comments
- **Centralized query keys**: Query keys are now in a single location for consistency
- **Backward compatibility**: Old imports still work via re-exports

## 📦 Usage

### New Way (Recommended)

```typescript
// Import from the main index
import {
  useNearbyRestaurants,
  usePlaceDetails,
  googlePlacesKeys,
} from "@/hooks/queries/google-places";

// Or import specific hooks directly
import { useNearbyRestaurants } from "@/hooks/queries/google-places/useNearbyRestaurants";
```

### Old Way (Still Supported)

```typescript
// This still works for backward compatibility
import { useNearbyRestaurants } from "@/hooks/queries/google-places/useGooglePlacesQueries";
```

## 🔑 Query Keys

All query keys are now centralized in `queryKeys.ts`:

```typescript
import { googlePlacesKeys } from "@/hooks/queries/google-places";

// Examples:
googlePlacesKeys.apiKey(); // API key
googlePlacesKeys.hotelLocation(hotelId); // Hotel location
googlePlacesKeys.nearbyRestaurantsList(hotelId, radius); // Restaurants list
googlePlacesKeys.placeDetail(placeId); // Place details
```

## 📚 Available Hooks

### `useGooglePlacesApiKey()`

Fetches the Google Places API key from environment variables or Supabase secrets.

**Example:**

```typescript
const { data: apiKey, isLoading } = useGooglePlacesApiKey();
```

### `useHotelLocation(hotelId)`

Fetches the geographic location (lat/lng) of a hotel from the database.

**Example:**

```typescript
const { data: location, isLoading } = useHotelLocation("hotel-123");
// location: { lat: 40.7128, lng: -74.0060 }
```

### `useNearbyRestaurants({ hotelId, radius? })`

Fetches nearby restaurants based on hotel location using Google Places API.

**Example:**

```typescript
const { data: restaurants, isLoading } = useNearbyRestaurants({
  hotelId: "hotel-123",
  radius: 3000, // 3km (default: 5000)
});
```

### `useNearbyRestaurantsWithStatus(params)`

Combined query that returns restaurants with unified loading/error states for all dependencies (location + API key + restaurants).

**Example:**

```typescript
const { restaurants, isLoading, isError, error, location, refetch } =
  useNearbyRestaurantsWithStatus({ hotelId: "hotel-123" });
```

### `usePlaceDetails(placeId)`

Fetches detailed information for a specific place (reviews, contact info, hours, etc.).

**Example:**

```typescript
const { data: details, isLoading } = usePlaceDetails("ChIJ...");
// Lazy loading - pass null to disable
const { data: details } = usePlaceDetails(null); // Won't fetch
```

## 🏗️ Architecture Decisions

### Why Split the File?

The original `useGooglePlacesQueries.ts` had:

- 206 lines of code
- 5 different hooks
- Mixed concerns (API key, location, restaurants, details)

After refactoring:

- Each hook in its own file (~30-60 lines)
- Clear separation of concerns
- Easier to test and maintain
- Better documentation per hook

### Why Keep the Old File?

The `useGooglePlacesQueries.ts` file is kept as a re-export for backward compatibility. This ensures that existing code doesn't break while allowing gradual migration to the new structure.

### Query Key Factory Pattern

Following the pattern in `queryUtils.ts`, all query keys are now centralized in `queryKeys.ts`. This:

- Prevents typos in query keys
- Makes cache invalidation easier
- Provides a clear hierarchy of cached data

## 🔄 Migration Guide

To migrate existing code to the new structure:

**Before:**

```typescript
import { useNearbyRestaurants } from "./useGooglePlacesQueries";
```

**After:**

```typescript
import { useNearbyRestaurants } from "./google-places";
// or
import { useNearbyRestaurants } from "./google-places/useNearbyRestaurants";
```

No functional changes are needed - just update the import paths when convenient.

## 📝 Best Practices

1. **Use the index exports**: Import from `'./google-places'` for cleaner imports
2. **Leverage query keys**: Use `googlePlacesKeys` for cache invalidation
3. **Use combined hooks**: `useNearbyRestaurantsWithStatus` provides better UX with unified loading states
4. **Enable lazy loading**: Pass `null` to `usePlaceDetails` to prevent fetching until needed

## 🧪 Testing

Each hook can now be tested independently:

```typescript
// Test useHotelLocation in isolation
import { useHotelLocation } from "./useHotelLocation";

// Test useNearbyRestaurants (mocking its dependencies)
import { useNearbyRestaurants } from "./useNearbyRestaurants";
```

## 🔮 Future Enhancements

Potential improvements:

- [ ] Add `useSearchPlaces` for text-based search
- [ ] Add `useAutocomplete` for place autocomplete
- [ ] Add `useRouteDistance` for calculating distances
- [ ] Add query cancellation support
- [ ] Add optimistic updates for write operations
