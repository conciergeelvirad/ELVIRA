# Amenity Module

Comprehensive hotel amenity management system for tracking and managing hotel facilities and services.

## Overview

The amenity module handles hotel amenity operations including:

- Amenity catalog management
- Category-based organization
- Pricing and recommendations
- Active/inactive status tracking
- Soft deletion for data integrity

## File Structure

```
amenities/
├── amenity.types.ts          # TypeScript type definitions
├── amenity.constants.ts      # Query keys
├── amenity.transformers.ts   # Data transformation utilities
├── useAmenityQueries.ts      # React Query hooks
├── index.ts                  # Barrel exports
└── README.md                 # This file
```

## Types

### Core Types

- **`Amenity`** - Complete amenity record
- **`AmenityInsert`** - Type for creating new amenities
- **`AmenityUpdate`** - Type for updating amenities
- **`AmenityUpdateData`** - Update type with required ID
- **`AmenityCategory`** - Category enum type
- **`AmenityAvailability`** - Availability status type

## Query Hooks

### useAmenities

Fetches all active amenities for a hotel.

```tsx
import { useAmenities } from "@/hooks/queries/hotel-management/amenities";

function AmenityList() {
  const { data: amenities, isLoading } = useAmenities("hotel-123");

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-3 gap-4">
      {amenities?.map((amenity) => (
        <AmenityCard key={amenity.id} amenity={amenity} />
      ))}
    </div>
  );
}
```

### useAmenityDetails

Fetches a single amenity by ID.

```tsx
import { useAmenityDetails } from "@/hooks/queries/hotel-management/amenities";

function AmenityDetails({ amenityId }: { amenityId: string }) {
  const { data: amenity, isLoading } = useAmenityDetails(amenityId);

  if (isLoading) return <LoadingSpinner />;
  if (!amenity) return <NotFound />;

  return <AmenityDetailsView amenity={amenity} />;
}
```

## Mutation Hooks

### useCreateAmenity

Creates a new amenity.

```tsx
import { useCreateAmenity } from "@/hooks/queries/hotel-management/amenities";

function CreateAmenityForm() {
  const createAmenity = useCreateAmenity();

  const handleSubmit = (formData) => {
    createAmenity.mutate(
      {
        hotel_id: "hotel-123",
        name: "Swimming Pool",
        description: "Olympic-sized heated pool with diving board",
        category: "pool",
        price: 0, // Free amenity
        is_active: true,
        hotel_recommended: true,
        image_url: "https://example.com/pool.jpg",
      },
      {
        onSuccess: () => {
          toast.success("Amenity created successfully");
          navigate("/amenities");
        },
        onError: (error) => {
          toast.error(`Failed to create amenity: ${error.message}`);
        },
      }
    );
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### useUpdateAmenity

Updates an existing amenity.

```tsx
import { useUpdateAmenity } from "@/hooks/queries/hotel-management/amenities";

function EditAmenityForm({ amenityId }: Props) {
  const updateAmenity = useUpdateAmenity();

  const handleSubmit = (updates) => {
    updateAmenity.mutate(
      {
        id: amenityId,
        name: "Updated Pool Name",
        price: 15.0, // Now a paid amenity
        hotel_recommended: false,
      },
      {
        onSuccess: () => {
          toast.success("Amenity updated successfully");
        },
      }
    );
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### useDeleteAmenity

Soft deletes an amenity by setting `is_active` to false.

```tsx
import { useDeleteAmenity } from "@/hooks/queries/hotel-management/amenities";

function DeleteAmenityButton({ amenityId }: Props) {
  const deleteAmenity = useDeleteAmenity();

  const handleDelete = () => {
    if (confirm("Are you sure you want to deactivate this amenity?")) {
      deleteAmenity.mutate(amenityId, {
        onSuccess: () => {
          toast.success("Amenity deactivated successfully");
        },
      });
    }
  };

  return (
    <Button onClick={handleDelete} variant="danger">
      Deactivate
    </Button>
  );
}
```

**Note:** This is a soft delete operation that preserves data integrity. The amenity remains in the database but won't appear in active amenity lists.

## Transformer Utilities

### Filtering

- **`filterActiveAmenities(amenities)`** - Only active amenities
- **`filterByCategory(amenities, category)`** - Filter by category
- **`filterRecommendedAmenities(amenities)`** - Hotel-recommended amenities
- **`filterFreeAmenities(amenities)`** - Free amenities (price = 0)
- **`filterPaidAmenities(amenities)`** - Paid amenities (price > 0)
- **`searchAmenities(amenities, searchTerm)`** - Search by name, description, or category

```tsx
import {
  filterFreeAmenities,
  filterByCategory,
  searchAmenities,
} from "@/hooks/queries/hotel-management/amenities";

const { data: allAmenities } = useAmenities(hotelId);

// Get free amenities
const freeAmenities = filterFreeAmenities(allAmenities || []);

// Get pool amenities
const poolAmenities = filterByCategory(allAmenities || [], "pool");

// Search amenities
const [searchTerm, setSearchTerm] = useState("");
const searchedAmenities = searchAmenities(allAmenities || [], searchTerm);
```

### Sorting

- **`sortAmenitiesByName(amenities)`** - Sort alphabetically
- **`sortAmenitiesByCategory(amenities)`** - Sort by category
- **`sortAmenitiesByPrice(amenities)`** - Sort by price (low to high)
- **`sortAmenitiesByRecommendation(amenities)`** - Recommended first

```tsx
import {
  sortAmenitiesByName,
  sortAmenitiesByPrice,
} from "@/hooks/queries/hotel-management/amenities";

const { data: amenities } = useAmenities(hotelId);

// Sort alphabetically
const byName = sortAmenitiesByName(amenities || []);

// Sort by price
const byPrice = sortAmenitiesByPrice(amenities || []);
```

### Grouping

- **`groupAmenitiesByCategory(amenities)`** - Group by category
- **`groupAmenitiesByPriceType(amenities)`** - Group into free/paid
- **`groupAmenitiesByActiveStatus(amenities)`** - Group by active/inactive

```tsx
import {
  groupAmenitiesByCategory,
  groupAmenitiesByPriceType,
} from "@/hooks/queries/hotel-management/amenities";

const { data: amenities } = useAmenities(hotelId);

// Group by category
const byCategory = groupAmenitiesByCategory(amenities || []);
// { 'pool': [...], 'spa': [...], 'fitness': [...] }

// Group by price type
const byPriceType = groupAmenitiesByPriceType(amenities || []);
// { free: [...], paid: [...] }
```

### Data Extraction

- **`getUniqueCategories(amenities)`** - Get all categories
- **`getActiveAmenities(amenities)`** - Get only active amenities
- **`calculateTotalCost(amenities)`** - Sum prices of amenities
- **`getAmenitiesInPriceRange(amenities, min, max)`** - Filter by price range

```tsx
import {
  getUniqueCategories,
  calculateTotalCost
} from '@/hooks/queries/hotel-management/amenities';

const { data: amenities } = useAmenities(hotelId);

// Get all categories for filter dropdown
const categories = getUniqueCategories(amenities || []);

// Calculate total cost of selected amenities
const selectedAmenities = [...]; // User's selections
const totalCost = calculateTotalCost(selectedAmenities);
```

### Status Utilities

- **`isAmenityAvailable(amenity)`** - Check if amenity is active
- **`getAmenityStatus(amenity)`** - Get status text ("Active" | "Inactive")
- **`getAmenityStatusColor(amenity)`** - Get color for status badge

```tsx
import {
  getAmenityStatus,
  getAmenityStatusColor,
} from "@/hooks/queries/hotel-management/amenities";

function AmenityCard({ amenity }) {
  const status = getAmenityStatus(amenity);
  const color = getAmenityStatusColor(amenity);

  return (
    <div>
      <h3>{amenity.name}</h3>
      <Badge color={color}>{status}</Badge>
    </div>
  );
}
```

### Formatting

- **`formatAmenityPrice(amenity)`** - Format price ("Free" | "$15.00")
- **`formatAmenitySummary(amenity)`** - Format full summary
- **`formatCategoryName(category)`** - Format category name for display

```tsx
import {
  formatAmenityPrice,
  formatCategoryName,
} from "@/hooks/queries/hotel-management/amenities";

const price = formatAmenityPrice(amenity); // "Free" or "$25.00"
const categoryDisplay = formatCategoryName("swimming_pool"); // "Swimming Pool"
```

## Real-time Subscription Example

```tsx
import {
  useAmenities,
  amenitiesKeys,
} from "@/hooks/queries/hotel-management/amenities";
import { useTableSubscription } from "@/hooks/useTableSubscription";
import { useQueryClient } from "@tanstack/react-query";

function AmenityList({ hotelId }: Props) {
  const queryClient = useQueryClient();
  const { data: amenities, isLoading } = useAmenities(hotelId);

  // Subscribe to real-time updates
  useTableSubscription({
    table: "amenities",
    event: "*",
    filter: `hotel_id=eq.${hotelId}`,
    callback: () => {
      queryClient.invalidateQueries({ queryKey: amenitiesKeys.lists() });
    },
  });

  return <AmenityGrid amenities={amenities} />;
}
```

## Search with Debouncing

```tsx
import {
  useAmenities,
  searchAmenities,
} from "@/hooks/queries/hotel-management/amenities";
import { useDebouncedValue } from "@/hooks/ui/useDebouncedValue";

function SearchableAmenityList({ hotelId }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const { data: amenities } = useAmenities(hotelId);
  const filteredAmenities = searchAmenities(amenities || [], debouncedSearch);

  return (
    <div>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <AmenityGrid amenities={filteredAmenities} />
    </div>
  );
}
```

## Category-based Filtering

```tsx
import {
  useAmenities,
  filterByCategory,
  getUniqueCategories,
  formatCategoryName,
} from "@/hooks/queries/hotel-management/amenities";

function AmenitiesByCategory({ hotelId }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: amenities } = useAmenities(hotelId);

  const categories = getUniqueCategories(amenities || []);
  const filtered = selectedCategory
    ? filterByCategory(amenities || [], selectedCategory)
    : amenities || [];

  return (
    <div>
      <CategoryTabs
        categories={categories.map((cat) => ({
          id: cat,
          label: formatCategoryName(cat),
        }))}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <AmenityGrid amenities={filtered} />
    </div>
  );
}
```

## Best Practices

### 1. Soft Deletion

Always use soft deletion to maintain data integrity:

```tsx
// Good - Soft delete
deleteAmenity.mutate(amenityId);

// Bad - Don't hard delete amenities
// They may be referenced by booking history
```

### 2. Price Management

Use proper numeric types for prices:

```tsx
// Good
createAmenity.mutate({
  price: 25.0, // Numeric value
});

// Bad
createAmenity.mutate({
  price: "25.00", // String value
});
```

### 3. Hotel Recommendations

Clearly mark recommended amenities:

```tsx
createAmenity.mutate({
  name: "Rooftop Pool",
  hotel_recommended: true, // Highlight for guests
});
```

### 4. Category Organization

Use consistent category naming:

```tsx
// Good categories
"spa", "fitness", "pool", "restaurant", "bar", "business";

// Bad - inconsistent
"Spa", "FITNESS CENTER", "swimming-pool";
```

## Migration Guide

If you're migrating from the old `useAmenitiesQueries.ts`:

```tsx
// Old import
import { useAmenities } from "../useAmenitiesQueries";

// New import
import { useAmenities } from "../amenities";

// All hooks maintain the same API
```

The API remains fully backward compatible, with additional utility functions now available for common operations.
