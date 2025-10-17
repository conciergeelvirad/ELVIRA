# Hotel Recommended Places Query Hooks

**Created:** October 11, 2025  
**Location:** `src/hooks/queries/hotel-management/useRecommendedPlacesQueries.ts`

---

## 📋 Overview

React Query hooks for managing hotel recommended places. Provides CRUD operations and search functionality for places recommended by the hotel to guests.

---

## 🗂️ Database Schema

```sql
hotel_recommended_places {
  id: uuid (PK)
  hotel_id: uuid (FK → hotels)
  place_name: text (max 200 chars)
  address: text (max 500 chars)
  is_active: boolean (default: true)
  created_at: timestamp
  updated_at: timestamp
  created_by: uuid (FK → profiles)
  data_retention_until: date (default: now + 7 years)
}
```

### Indexes

- `hotel_id` - For filtering by hotel
- `is_active` - For filtering active places
- `place_name` - For name searches
- `hotel_id, is_active` - Composite for common queries
- Full-text search on `place_name` and `address`

---

## 🔑 Query Keys Structure

```typescript
recommendedPlacesKeys = {
  all: ["recommended-places"],
  lists: () => ["recommended-places", "list"],
  list: (hotelId) => ["recommended-places", "list", hotelId],
  active: (hotelId) => ["recommended-places", "active", hotelId],
  details: () => ["recommended-places", "detail"],
  detail: (id) => ["recommended-places", "detail", id],
};
```

---

## 📚 Available Hooks

### Query Hooks

#### 1. `useRecommendedPlaces(hotelId: string)`

**Purpose:** Fetch all recommended places for a hotel  
**Returns:** Array of RecommendedPlaceWithDetails  
**Sorted by:** `created_at` (descending)

```typescript
const { data: places, isLoading } = useRecommendedPlaces(hotelId);
```

---

#### 2. `useActiveRecommendedPlaces(hotelId: string)`

**Purpose:** Fetch only active recommended places  
**Returns:** Array of RecommendedPlaceWithDetails  
**Sorted by:** `place_name` (ascending)

```typescript
const { data: activePlaces, isLoading } = useActiveRecommendedPlaces(hotelId);
```

---

#### 3. `useRecommendedPlaceById(placeId?: string)`

**Purpose:** Fetch a single place by ID  
**Returns:** RecommendedPlaceWithDetails  
**Enabled:** Only when placeId is provided

```typescript
const { data: place } = useRecommendedPlaceById(placeId);
```

---

#### 4. `useSearchRecommendedPlaces(hotelId: string, searchText: string)`

**Purpose:** Search places by name or address  
**Returns:** Array of RecommendedPlaceWithDetails  
**Enabled:** Only when searchText is not empty

```typescript
const { data: searchResults } = useSearchRecommendedPlaces(
  hotelId,
  "restaurant"
);
```

---

### Mutation Hooks

#### 5. `useCreateRecommendedPlace()`

**Purpose:** Create a new recommended place  
**Invalidates:** List and active queries

```typescript
const createPlace = useCreateRecommendedPlace();

createPlace.mutate({
  hotel_id: "hardcoded-hotel-id",
  place_name: "The Great Restaurant",
  address: "123 Main St, City",
  is_active: true,
  created_by: userId,
});
```

---

#### 6. `useUpdateRecommendedPlace()`

**Purpose:** Update an existing place  
**Invalidates:** List, active, and detail queries

```typescript
const updatePlace = useUpdateRecommendedPlace();

updatePlace.mutate({
  id: placeId,
  updates: {
    place_name: "Updated Name",
    address: "New Address",
  },
});
```

---

#### 7. `useDeleteRecommendedPlace()`

**Purpose:** Delete a recommended place  
**Invalidates:** All place queries

```typescript
const deletePlace = useDeleteRecommendedPlace();

deletePlace.mutate(placeId);
```

---

#### 8. `useTogglePlaceActive()`

**Purpose:** Toggle active status of a place  
**Invalidates:** List, active, and detail queries

```typescript
const toggleActive = useTogglePlaceActive();

toggleActive.mutate({
  id: placeId,
  isActive: false,
});
```

---

## 📦 Types

### RecommendedPlace

Base type from database table

### RecommendedPlaceInsert

Type for inserting new places

### RecommendedPlaceUpdate

Type for updating existing places

### RecommendedPlaceWithDetails

Extended type with joined data:

```typescript
{
  ...RecommendedPlace,
  created_by_profile?: {
    id: string;
    email: string;
  };
  hotels?: {
    id: string;
    hotel_name: string;
  };
}
```

---

## 💡 Usage Example with Hardcoded Hotel ID

```typescript
import { useActiveRecommendedPlaces } from "@/hooks/queries/hotel-management/useRecommendedPlacesQueries";

export const RecommendedPlacesPage = () => {
  // Hardcoded hotel ID for testing
  const HARDCODED_HOTEL_ID = "your-hotel-uuid-here";

  const {
    data: places,
    isLoading,
    error,
  } = useActiveRecommendedPlaces(HARDCODED_HOTEL_ID);

  if (isLoading) return <div>Loading places...</div>;
  if (error) return <div>Error loading places</div>;

  return (
    <div>
      <h1>Recommended Places</h1>
      <ul>
        {places?.map((place) => (
          <li key={place.id}>
            <h3>{place.place_name}</h3>
            <p>{place.address}</p>
            <span>{place.is_active ? "Active" : "Inactive"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 🔄 Query Invalidation

The mutation hooks automatically invalidate relevant queries:

- **Create:** Invalidates `lists()` and `active(hotelId)`
- **Update:** Invalidates `lists()`, `active(hotelId)`, and `detail(id)`
- **Delete:** Invalidates all place queries
- **Toggle Active:** Invalidates `lists()`, `active(hotelId)`, and `detail(id)`

---

## 🎯 Features

- ✅ Full CRUD operations
- ✅ Active/inactive filtering
- ✅ Text search (name and address)
- ✅ Automatic query invalidation
- ✅ TypeScript type safety
- ✅ Relationships with profiles and hotels
- ✅ Optimistic updates ready
- ✅ Error handling

---

## 📝 Notes

- Hotel ID should be obtained from `useHotel()` context in production
- Currently uses hardcoded hotel ID for testing purposes
- All places are soft-deleted via `is_active` flag
- Data retention is set to 7 years by default
- Full-text search available via database indexes
- Created by user tracked via `created_by` field
