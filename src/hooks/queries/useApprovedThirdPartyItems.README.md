# useApprovedThirdPartyItems Hook

A simple React Query hook for fetching **APPROVED** third-party items from the `hotel_third_party_approvals` table.

## Overview

This hook only fetches items with `status = 'APPROVED'`. Perfect for displaying approved restaurants and tour agencies to guests.

## Table Schema

```sql
hotel_third_party_approvals (
  id uuid PRIMARY KEY,
  hotel_id uuid NOT NULL,
  third_party_id uuid NOT NULL,
  third_party_type text NOT NULL, -- 'RESTAURANT' | 'TOUR AGENCY'
  status text NOT NULL, -- We only fetch 'APPROVED'
  created_at timestamptz,
  updated_at timestamptz,
  approved_by uuid
)
```

## Available Hooks

### 1. useApprovedThirdPartyItems

Fetches all approved items (restaurants and tour agencies).

```tsx
import { useApprovedThirdPartyItems } from "@/hooks/queries";

function ApprovedItems({ hotelId }) {
  const { data: approved, isLoading } = useApprovedThirdPartyItems(hotelId);

  return (
    <div>
      {approved?.map((item) => (
        <div key={item.id}>
          {item.third_party_type}: {item.third_party_id}
        </div>
      ))}
    </div>
  );
}
```

### 2. useApprovedRestaurants

Fetches only approved restaurants.

```tsx
import { useApprovedRestaurants } from "@/hooks/queries";

function RestaurantsList({ hotelId }) {
  const { data: restaurants, isLoading } = useApprovedRestaurants(hotelId);

  return (
    <div>
      <h2>Approved Restaurants ({restaurants?.length || 0})</h2>
      {restaurants?.map((restaurant) => (
        <div key={restaurant.id}>{restaurant.third_party_id}</div>
      ))}
    </div>
  );
}
```

### 3. useApprovedTourAgencies

Fetches only approved tour agencies.

```tsx
import { useApprovedTourAgencies } from "@/hooks/queries";

function TourAgenciesList({ hotelId }) {
  const { data: tours, isLoading } = useApprovedTourAgencies(hotelId);

  return (
    <div>
      <h2>Approved Tours ({tours?.length || 0})</h2>
      {tours?.map((tour) => (
        <div key={tour.id}>{tour.third_party_id}</div>
      ))}
    </div>
  );
}
```

### 4. useApprovedItemsCounts

Gets counts of approved items by type.

```tsx
import { useApprovedItemsCounts } from "@/hooks/queries";

function ApprovedStats({ hotelId }) {
  const { data: counts } = useApprovedItemsCounts(hotelId);

  return (
    <div>
      <p>Total: {counts?.total}</p>
      <p>Restaurants: {counts?.restaurants}</p>
      <p>Tour Agencies: {counts?.tourAgencies}</p>
    </div>
  );
}
```

## Data Structure

```typescript
interface ApprovedThirdPartyItem {
  id: string;
  hotel_id: string;
  third_party_id: string;
  third_party_type: "RESTAURANT" | "TOUR AGENCY";
  created_at: string;
  updated_at: string;
  approved_by: string | null;
}
```

## Complete Example

```tsx
import React from "react";
import {
  useApprovedThirdPartyItems,
  useApprovedRestaurants,
  useApprovedTourAgencies,
  useApprovedItemsCounts,
} from "@/hooks/queries";

function ApprovedItemsPage({ hotelId }) {
  const { data: allItems, isLoading } = useApprovedThirdPartyItems(hotelId);
  const { data: restaurants } = useApprovedRestaurants(hotelId);
  const { data: tours } = useApprovedTourAgencies(hotelId);
  const { data: counts } = useApprovedItemsCounts(hotelId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Approved Third-Party Items</h1>

      {/* Stats */}
      <div>
        <p>Total: {counts?.total}</p>
        <p>Restaurants: {counts?.restaurants}</p>
        <p>Tours: {counts?.tourAgencies}</p>
      </div>

      {/* All Items */}
      <section>
        <h2>All Approved ({allItems?.length})</h2>
        {allItems?.map((item) => (
          <div key={item.id}>
            <span>{item.third_party_type}</span>
            <span>{item.third_party_id}</span>
          </div>
        ))}
      </section>

      {/* Restaurants Only */}
      <section>
        <h2>Restaurants ({restaurants?.length})</h2>
        {restaurants?.map((restaurant) => (
          <div key={restaurant.id}>{restaurant.third_party_id}</div>
        ))}
      </section>

      {/* Tours Only */}
      <section>
        <h2>Tour Agencies ({tours?.length})</h2>
        {tours?.map((tour) => (
          <div key={tour.id}>{tour.third_party_id}</div>
        ))}
      </section>
    </div>
  );
}
```

## Filter by Type

You can optionally filter by type:

```tsx
// Get all approved items
const { data: all } = useApprovedThirdPartyItems(hotelId);

// Get only restaurants
const { data: restaurants } = useApprovedThirdPartyItems(hotelId, "RESTAURANT");

// Get only tour agencies
const { data: tours } = useApprovedThirdPartyItems(hotelId, "TOUR AGENCY");
```

## Query Keys

All queries use structured keys for proper caching:

```typescript
["approved-third-party-items", hotelId, type?]
["approved-items-counts", hotelId]
```

## Common Patterns

### Show count badge

```tsx
const { data: restaurants } = useApprovedRestaurants(hotelId);
const count = restaurants?.length || 0;

<button>Restaurants ({count})</button>;
```

### Check if any approved

```tsx
const { data: approved } = useApprovedThirdPartyItems(hotelId);
const hasApproved = (approved?.length || 0) > 0;

{
  hasApproved ? <List /> : <EmptyState />;
}
```

### Filter and display

```tsx
const { data: items } = useApprovedThirdPartyItems(hotelId);

const restaurants = items?.filter((i) => i.third_party_type === "RESTAURANT");
const tours = items?.filter((i) => i.third_party_type === "TOUR AGENCY");
```

## Error Handling

```tsx
const { data, isLoading, isError, error } = useApprovedThirdPartyItems(hotelId);

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorMessage error={error} />;
if (!data?.length) return <EmptyState />;

return <ItemsList items={data} />;
```

## Best Practices

1. ✅ **Always check loading state** before rendering data
2. ✅ **Handle empty states** when no approved items exist
3. ✅ **Use specific hooks** (`useApprovedRestaurants`) when you only need one type
4. ✅ **Use counts hook** for dashboard statistics
5. ✅ **Cache is automatic** - no manual refetching needed

## Notes

- ✅ Only returns items with `status = 'APPROVED'`
- ✅ Automatically sorted by `created_at` (newest first)
- ✅ Includes comprehensive console logging for debugging
- ✅ Proper TypeScript typing throughout
- ✅ React Query caching and automatic refetching
