# DineIn Filter Modal Implementation

## Summary

Extended the reusable FilterModal component to support DineIn page with restaurant and service type filters.

## Changes Made

### 1. Updated FilterModal Types

**Location:** `src/pages/Guests/components/common/FilterModal/types.ts`

**New FilterOptions Interface:**

```typescript
export interface FilterOptions {
  selectedCategories: string[];
  priceRange: { min: number; max: number };
  showOnlyRecommended: boolean;
  selectedRestaurants?: string[]; // New: For DineIn page
  selectedServiceTypes?: string[]; // New: For DineIn page (breakfast, lunch, dinner)
}
```

**New FilterModalProps:**

```typescript
export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  categories: string[];
  maxPrice: number;
  currentFilters: FilterOptions;
  restaurants?: Array<{ id: string; name: string }>; // Optional: For DineIn
  serviceTypes?: string[]; // Optional: For DineIn
}
```

### 2. Enhanced FilterModal Component

**Location:** `src/pages/Guests/components/common/FilterModal/FilterModal.tsx`

**New Features:**

- ✅ **Restaurants Section** - Multi-select for filtering by restaurant
- ✅ **Service Types Section** - Multi-select for meal times (breakfast, lunch, dinner, etc.)
- ✅ **Conditional Rendering** - Restaurants and service types only show when provided
- ✅ **Extended State Management** - Added state for selectedRestaurants and selectedServiceTypes
- ✅ **Updated Filter Count** - Includes restaurant and service type selections in active count

**Layout Order (DineIn):**

1. Price Range
2. Hotel Recommended
3. Restaurants (DineIn only)
4. Service Type (DineIn only)
5. Categories

### 3. DineInPage Implementation

**Location:** `src/pages/Guests/pages/DineIn/DineInPage.tsx`

**New Queries:**

- `useRestaurants(hotelId)` - Fetch all restaurants for hotel
- `getUniqueCategories(menuItems)` - Extract unique menu categories

**Computed Filter Options:**

```typescript
// Categories from menu items
const categories = useMemo(() => getUniqueCategories(menuItems), [menuItems]);

// Service types from menu items (extracted from service_type array)
const serviceTypes = useMemo(() => {
  const types = new Set<string>();
  menuItems.forEach((item) => {
    if (item.service_type) {
      item.service_type.forEach((type) => types.add(type));
    }
  });
  return Array.from(types).sort();
}, [menuItems]);

// Max price from menu items
const maxPrice = useMemo(() => {
  if (menuItems.length === 0) return 1000;
  return Math.ceil(Math.max(...menuItems.map((item) => item.price)));
}, [menuItems]);
```

**Filter Logic:**

1. **Search Filter** - Name and description matching
2. **Category Filter** - Multi-select categories
3. **Price Range Filter** - Min/max price slider
4. **Restaurant Filter** - Items must be in selected restaurant's menu (checks `restaurant_ids` array)
5. **Service Type Filter** - Items must have selected service type (checks `service_type` array)
6. **Recommended Filter** - Placeholder for future implementation

**FilterModal Integration:**

```tsx
<FilterModal
  isOpen={isFilterModalOpen}
  onClose={() => setIsFilterModalOpen(false)}
  onApply={handleApplyFilters}
  categories={categories}
  maxPrice={maxPrice}
  currentFilters={filters}
  restaurants={restaurants.map((r) => ({ id: r.id, name: r.name }))}
  serviceTypes={serviceTypes}
/>
```

## Database Schema Understanding

### menu_items Table

```typescript
interface MenuItem {
  id: string;
  hotel_id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  service_type: string[] | null; // e.g., ["breakfast", "lunch", "dinner"]
  special_type: string[] | null; // e.g., ["vegan", "gluten-free"]
  restaurant_ids: string[]; // Array of restaurant IDs this item belongs to
  is_available: boolean;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
}
```

### restaurants Table

```typescript
interface Restaurant {
  id: string;
  hotel_id: string;
  name: string;
  // ... other fields
}
```

## Filter Behavior

### Restaurant Filter

When restaurants are selected, only menu items that include ANY of the selected restaurant IDs in their `restaurant_ids` array will be shown.

```typescript
if (filters.selectedRestaurants && filters.selectedRestaurants.length > 0) {
  itemsToShow = itemsToShow.filter((item) =>
    filters.selectedRestaurants!.some((restId) =>
      item.restaurant_ids.includes(restId)
    )
  );
}
```

### Service Type Filter

When service types are selected, only menu items that include ANY of the selected service types in their `service_type` array will be shown.

```typescript
if (filters.selectedServiceTypes && filters.selectedServiceTypes.length > 0) {
  itemsToShow = itemsToShow.filter((item) =>
    item.service_type?.some((type) =>
      filters.selectedServiceTypes!.includes(type)
    )
  );
}
```

## Reusability Strategy

The FilterModal is now fully reusable across different pages:

### ShopPage (Simple)

```tsx
<FilterModal
  isOpen={isFilterModalOpen}
  onClose={() => setIsFilterModalOpen(false)}
  onApply={handleApplyFilters}
  categories={categories}
  maxPrice={maxPrice}
  currentFilters={filters}
  // No restaurants or serviceTypes - they won't render
/>
```

### DineInPage (Full Featured)

```tsx
<FilterModal
  isOpen={isFilterModalOpen}
  onClose={() => setIsFilterModalOpen(false)}
  onApply={handleApplyFilters}
  categories={categories}
  maxPrice={maxPrice}
  currentFilters={filters}
  restaurants={restaurants.map((r) => ({ id: r.id, name: r.name }))}
  serviceTypes={serviceTypes}
/>
```

### ServicesPage (Future)

Could potentially add custom filter sections as needed.

## Visual Design

### DineIn Filter Modal Sections

1. **Price Range** - Airbnb-style dual-handle slider
2. **Hotel Recommended** - Toggle switch
3. **Restaurants** - Multi-select pills (e.g., "Main Restaurant", "Pool Bar", "Room Service")
4. **Service Type** - Multi-select pills (e.g., "Breakfast", "Lunch", "Dinner", "Brunch")
5. **Categories** - Multi-select pills (e.g., "Appetizers", "Mains", "Desserts", "Beverages")

### Interaction

- Each section shows selected items with blue background
- Active filter count badge in header shows total selected filters
- Reset button clears all filters
- Apply button applies filters and closes modal

## Console Logging

Added detailed logging for debugging:

- `🍽️ [DineInPage] Fetched menu items: X`
- `🏨 [DineInPage] Fetched restaurants: X`
- `✅ [DineInPage] Available menu items: X`
- `🔍 [DineInPage] Filtered items: X`
- `🔧 [DineInPage] Applying filters: {...}`

## Testing Checklist

- [ ] Filter modal opens with all sections visible
- [ ] Restaurant multi-select works correctly
- [ ] Service type multi-select works correctly
- [ ] Restaurant filter correctly filters menu items by restaurant_ids
- [ ] Service type filter correctly filters menu items by service_type
- [ ] Multiple filters work together (AND logic)
- [ ] Reset button clears all filters including new ones
- [ ] Active filter count includes restaurants and service types
- [ ] ShopPage still works with updated FilterModal (optional params)
- [ ] Mobile responsive layout works properly
- [ ] Filter button opens modal correctly

## Future Enhancements

1. **Recommended Field for Menu Items** - Add `hotel_recommended` boolean to menu_items table
2. **Special Dietary Filters** - Use `special_type` array (vegan, gluten-free, etc.)
3. **Time-based Filtering** - Show only items available at current time based on service_type
4. **Restaurant Operating Hours** - Filter by restaurants currently open
5. **Favorites** - Allow guests to save favorite items for quick filtering

## Notes

- The `showOnlyRecommended` filter is currently a placeholder for menu items as the database doesn't have this field yet
- Service types are dynamically extracted from menu items, so they'll vary by hotel
- The filter is designed to be inclusive (OR logic within each section, AND logic across sections)
- Z-index is set to `z-[60]` to appear above bottom navigation (`z-50`)
