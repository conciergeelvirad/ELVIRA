# Approved Places Query Hooks - Refactored Structure

This directory contains React Query hooks for managing approved third-party places (restaurants, bars, cafes, etc.), refactored for better maintainability and scalability.

## 📁 File Structure

```
approved-places/
├── index.ts                       # Main export file
├── queryKeys.ts                   # Centralized query keys factory
├── queries.ts                     # Query hooks (read operations)
├── useUpsertApprovedPlace.ts     # Create/update mutation
├── mutations.ts                   # Update mutations (status, recommended)
├── useDeleteApprovedPlace.ts     # Delete mutation
├── useApprovedPlacesQueries.ts   # (DEPRECATED) Legacy file for backward compatibility
└── README.md                      # This file
```

## 🎯 Purpose

This refactoring breaks down a large monolithic query file into smaller, focused modules:

- **Better maintainability**: Each hook type has its own file with clear responsibility
- **Improved scalability**: Easy to add new hooks without cluttering existing files
- **Better documentation**: Each file has detailed JSDoc comments with examples
- **Centralized query keys**: Query keys are now in a single location for consistency
- **Backward compatibility**: Old imports still work via re-exports

## 📦 Usage

### New Way (Recommended)

```typescript
// Import from the main index
import {
  useApprovedPlaces,
  useUpsertApprovedPlace,
  useToggleRecommended,
  approvedPlacesKeys,
} from "@/hooks/queries/approved-places";

// Or import specific files directly
import { useApprovedPlaces } from "@/hooks/queries/approved-places/queries";
import { useToggleRecommended } from "@/hooks/queries/approved-places/mutations";
```

### Old Way (Still Supported)

```typescript
// This still works for backward compatibility
import {
  useApprovedPlaces,
  useUpsertApprovedPlace,
} from "@/hooks/queries/approved-places/useApprovedPlacesQueries";
```

## 🔑 Query Keys

All query keys are now centralized in `queryKeys.ts`:

```typescript
import { approvedPlacesKeys } from "@/hooks/queries/approved-places";

// Examples:
approvedPlacesKeys.all; // All places
approvedPlacesKeys.byHotel(hotelId); // All places for a hotel
approvedPlacesKeys.byHotelAndStatus(hotelId, "approved"); // Filtered by status
approvedPlacesKeys.byPlaceId(hotelId, placeId); // Specific place check
```

## 📚 Available Hooks

### Query Hooks (Read Operations)

#### `useApprovedPlaces(hotelId)`

Fetch all approved places for a hotel (regardless of status).

**Example:**

```typescript
const { data: places, isLoading } = useApprovedPlaces(hotelId);
// Returns: all pending, approved, and rejected places
```

#### `useApprovedPlacesByStatus(hotelId, status)`

Fetch approved places filtered by status.

**Example:**

```typescript
const { data: approvedPlaces } = useApprovedPlacesByStatus(hotelId, "approved");
const { data: pendingPlaces } = useApprovedPlacesByStatus(hotelId, "pending");
const { data: rejectedPlaces } = useApprovedPlacesByStatus(hotelId, "rejected");
```

#### `useApprovedPlaceByPlaceId(hotelId, placeId)`

Check if a specific Google Place has been reviewed.

**Example:**

```typescript
const { data: existingPlace } = useApprovedPlaceByPlaceId(
  hotelId,
  googlePlaceId
);
if (existingPlace) {
  console.log("Already reviewed:", existingPlace.status);
}
```

### Mutation Hooks (Write Operations)

#### `useUpsertApprovedPlace()`

Create or update an approved place (upsert operation).

**Example:**

```typescript
const upsert = useUpsertApprovedPlace();

// Approve a place
await upsert.mutateAsync({
  hotel_id: hotelId,
  place_id: googlePlaceId,
  name: "Restaurant Name",
  type: "restaurant",
  status: "approved",
  google_data: { ...placeData },
  recommended: false,
});

// Reject a place
await upsert.mutateAsync({
  hotel_id: hotelId,
  place_id: googlePlaceId,
  name: "Bar Name",
  type: "bar",
  status: "rejected",
  google_data: { ...placeData },
});
```

#### `useUpdateApprovalStatus()`

Update the status or google_data of an existing place.

**Example:**

```typescript
const updateStatus = useUpdateApprovalStatus();

// Change status
await updateStatus.mutateAsync({
  id: placeRecordId,
  status: "approved",
});

// Update cached Google data
await updateStatus.mutateAsync({
  id: placeRecordId,
  google_data: { ...updatedData },
});
```

#### `useToggleRecommended()`

Toggle the "recommended" flag for a place.

**Example:**

```typescript
const toggleRecommended = useToggleRecommended();

await toggleRecommended.mutateAsync({
  placeId: googlePlaceId,
  hotelId: hotelId,
  currentStatus: false, // Will be toggled to true
});
```

#### `useDeleteApprovedPlace()`

Permanently remove an approved place record.

**Example:**

```typescript
const deletePlace = useDeleteApprovedPlace();

await deletePlace.mutateAsync(placeRecordId);
```

## 🏗️ Architecture Decisions

### Why Split the File?

The original `useApprovedPlacesQueries.ts` had:

- 227 lines of code
- 6 different hooks (3 queries + 3 mutations)
- Mixed concerns (queries, create, update, delete)

After refactoring:

- 6 focused files (30-70 lines each)
- Clear separation: queries vs mutations
- Easier to test and maintain
- Better documentation per hook

### File Organization

1. **`queryKeys.ts`** - Query key factory (single source of truth)
2. **`queries.ts`** - All read operations (useQuery hooks)
3. **`useUpsertApprovedPlace.ts`** - Create/update operation (special case)
4. **`mutations.ts`** - Update operations (status, recommended)
5. **`useDeleteApprovedPlace.ts`** - Delete operation (separate concern)
6. **`index.ts`** - Clean public API

### Why Keep the Old File?

The `useApprovedPlacesQueries.ts` file is kept as a re-export for backward compatibility. This ensures that existing code doesn't break while allowing gradual migration to the new structure.

## 🔄 Migration Guide

To migrate existing code to the new structure:

**Before:**

```typescript
import {
  useApprovedPlaces,
  useUpsertApprovedPlace,
} from "./useApprovedPlacesQueries";
```

**After:**

```typescript
import { useApprovedPlaces, useUpsertApprovedPlace } from "./approved-places";
// or
import { useApprovedPlaces } from "./approved-places/queries";
import { useUpsertApprovedPlace } from "./approved-places/useUpsertApprovedPlace";
```

No functional changes are needed - just update the import paths when convenient.

## 📝 Best Practices

1. **Use the index exports**: Import from `'./approved-places'` for cleaner imports
2. **Leverage query keys**: Use `approvedPlacesKeys` for cache invalidation
3. **Use upsert for new places**: `useUpsertApprovedPlace` handles both create and update
4. **Check before creating**: Use `useApprovedPlaceByPlaceId` to avoid duplicates

## 💡 Common Patterns

### Approving a Place

```typescript
const upsert = useUpsertApprovedPlace();
const { data: existing } = useApprovedPlaceByPlaceId(hotelId, placeId);

if (existing) {
  // Update existing record
  await updateStatus.mutateAsync({
    id: existing.id,
    status: "approved",
  });
} else {
  // Create new record
  await upsert.mutateAsync({
    hotel_id: hotelId,
    place_id: placeId,
    name: placeName,
    type: placeType,
    status: "approved",
    google_data: placeData,
  });
}
```

### Marking as Recommended

```typescript
const toggleRecommended = useToggleRecommended();

// Only approved places should be recommended
if (place.status === "approved") {
  await toggleRecommended.mutateAsync({
    placeId: place.place_id,
    hotelId: place.hotel_id,
    currentStatus: place.recommended,
  });
}
```

### Filtering by Status

```typescript
// Show approved places to guests
const { data: approvedPlaces } = useApprovedPlacesByStatus(hotelId, "approved");

// Show pending places for admin review
const { data: pendingPlaces } = useApprovedPlacesByStatus(hotelId, "pending");

// Show all places for management
const { data: allPlaces } = useApprovedPlaces(hotelId);
```

## 🧪 Testing

Each hook can now be tested independently:

```typescript
// Test queries in isolation
import { useApprovedPlaces } from "./queries";

// Test mutations in isolation
import { useUpsertApprovedPlace } from "./useUpsertApprovedPlace";
import { useToggleRecommended } from "./mutations";
```

## 🔮 Future Enhancements

Potential improvements:

- [ ] Add `useBulkApprove` for approving multiple places at once
- [ ] Add `useApprovedPlacesStats` for dashboard metrics
- [ ] Add optimistic updates for better UX
- [ ] Add `useReorderRecommended` for drag-and-drop ordering
- [ ] Add place categories/tags support
