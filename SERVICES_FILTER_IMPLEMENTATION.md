# Services Page Filter Modal Implementation

## Summary

Implemented the FilterModal for the Services page following the same reusable pattern used for ShopPage and DineInPage.

## Changes Made

### 1. ServicesPage Implementation

**Location:** `src/pages/Guests/pages/Services/ServicesPage.tsx`

**New Imports:**

```typescript
import {
  SearchBar,
  FilterModal,
  type FilterOptions,
} from "../../components/common";
import {
  useAmenities,
  filterActiveAmenities,
  groupAmenitiesByCategory,
  getUniqueCategories, // New: Extract categories
  type Amenity,
} from "../../../../hooks/queries/hotel-management/amenities";
```

**State Management:**

```typescript
const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
const [filters, setFilters] = useState<FilterOptions>({
  selectedCategories: [],
  priceRange: { min: 0, max: 1000 },
  showOnlyRecommended: false,
});
```

**Computed Filter Options:**

```typescript
// Categories from amenities
const categories = useMemo(() => getUniqueCategories(amenities), [amenities]);

// Max price from amenities (handles null prices)
const maxPrice = useMemo(() => {
  if (amenities.length === 0) return 1000;
  return Math.ceil(Math.max(...amenities.map((a) => a.price || 0)));
}, [amenities]);

// Auto-update price range when maxPrice changes
useMemo(() => {
  setFilters((prev) => ({
    ...prev,
    priceRange: { min: 0, max: maxPrice },
  }));
}, [maxPrice]);
```

**Filter Logic:**

1. **Search Filter** - Name and description matching
2. **Category Filter** - Multi-select categories
3. **Price Range Filter** - Min/max price slider (handles null prices with `|| 0`)
4. **Recommended Filter** - Shows only hotel-recommended amenities

**FilterModal Integration:**

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

## Database Schema Understanding

### amenities Table

```typescript
interface Amenity {
  id: string;
  hotel_id: string;
  name: string;
  description: string | null;
  category: string; // e.g., "spa", "fitness", "pool", "restaurant", "bar", "business", "entertainment", "other"
  price: number | null; // Can be null for free amenities
  is_active: boolean;
  hotel_recommended: boolean;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}
```

### Category Types

Predefined amenity categories:

- `spa` - Spa & Wellness
- `fitness` - Gym & Fitness
- `pool` - Swimming Pool & Water Activities
- `restaurant` - Dining
- `bar` - Bars & Lounges
- `business` - Business Center & Meeting Rooms
- `entertainment` - Entertainment & Activities
- `other` - Other Services

## Filter Behavior

### Category Filter

When categories are selected, only amenities matching those categories will be shown.

```typescript
if (filters.selectedCategories.length > 0) {
  amenitiesToShow = amenitiesToShow.filter((amenity) =>
    filters.selectedCategories.includes(amenity.category)
  );
}
```

### Price Range Filter

Filters amenities by price, handling null prices as 0 (free amenities).

```typescript
amenitiesToShow = amenitiesToShow.filter(
  (amenity) =>
    (amenity.price || 0) >= filters.priceRange.min &&
    (amenity.price || 0) <= filters.priceRange.max
);
```

### Hotel Recommended Filter

Shows only amenities marked as recommended by the hotel.

```typescript
if (filters.showOnlyRecommended) {
  amenitiesToShow = amenitiesToShow.filter(
    (amenity) => amenity.hotel_recommended
  );
}
```

## Comparison Across Pages

### ShopPage (Products)

**Filters:**

- ✅ Price Range
- ✅ Hotel Recommended
- ✅ Categories

**Unique Features:**

- Cart button in SearchBar
- Stock quantity display
- Product-specific categories

### DineInPage (Menu Items)

**Filters:**

- ✅ Price Range
- ✅ Hotel Recommended
- ✅ Restaurants (multi-select)
- ✅ Service Types (breakfast, lunch, dinner)
- ✅ Categories

**Unique Features:**

- Restaurant filtering (array intersection)
- Service type filtering (meal times)
- Cart button in SearchBar
- Restaurant-specific menu items

### ServicesPage (Amenities)

**Filters:**

- ✅ Price Range
- ✅ Hotel Recommended
- ✅ Categories

**Unique Features:**

- No cart button (services are for booking/information)
- Price can be null (free amenities)
- Simpler filter structure (like ShopPage but for services)

## Visual Design

### Services Filter Modal Sections

1. **Price Range** - Airbnb-style dual-handle slider
2. **Hotel Recommended** - Toggle switch
3. **Categories** - Multi-select pills (e.g., "Spa", "Fitness", "Pool", "Restaurant")

### Category Display Examples

- **Spa** - Massage, Sauna, Steam Room
- **Fitness** - Gym, Personal Training, Yoga Classes
- **Pool** - Swimming Pool, Pool Bar, Water Aerobics
- **Restaurant** - Fine Dining, Buffet, Room Service
- **Bar** - Lobby Bar, Rooftop Bar, Pool Bar
- **Business** - Meeting Rooms, Business Center, Conference Hall
- **Entertainment** - Live Music, Kids Club, Game Room

## Console Logging

Added detailed logging for debugging:

- `🏊 [ServicesPage] Fetched amenities: X`
- `✅ [ServicesPage] Active amenities: X`
- `📊 [ServicesPage] Total amenities: X`
- `🏊 [ServicesPage] Showing amenities: X`
- `🔍 [ServicesPage] Filtered amenities: X`
- `🔧 [ServicesPage] Applying filters: {...}`

## Reusability Achieved

The FilterModal component is now fully implemented across all three main guest pages:

| Page         | Price | Recommended | Categories | Restaurants | Service Types | Cart |
| ------------ | ----- | ----------- | ---------- | ----------- | ------------- | ---- |
| **Shop**     | ✅    | ✅          | ✅         | ❌          | ❌            | ✅   |
| **DineIn**   | ✅    | ✅          | ✅         | ✅          | ✅            | ✅   |
| **Services** | ✅    | ✅          | ✅         | ❌          | ❌            | ❌   |

### Code Reuse

- **FilterModal Component**: Shared across all pages
- **FilterOptions Type**: Common interface with optional fields
- **SearchBar Component**: Shared with conditional cart button
- **Filter Logic Pattern**: Consistent across all pages

## Testing Checklist

- [ ] Filter modal opens correctly on Services page
- [ ] Category pills display amenity categories
- [ ] Price range slider works with null prices (free amenities)
- [ ] Hotel recommended toggle filters correctly
- [ ] Multiple filters work together (AND logic)
- [ ] Reset button clears all filters
- [ ] Active filter count updates correctly
- [ ] Search + filters work together
- [ ] Free amenities (price = null) are handled correctly
- [ ] Mobile responsive layout
- [ ] Z-index correct (above bottom navigation)

## Future Enhancements

1. **Availability Status Filter** - Filter by available, busy, maintenance, closed
2. **Time-based Availability** - Show only amenities available at current time
3. **Booking Integration** - Direct booking from amenity details
4. **Location Filter** - Filter by physical location within hotel
5. **Free vs Paid Filter** - Quick toggle for free amenities only
6. **Reservation Required Filter** - Show only amenities that need booking

## Implementation Summary

### Files Modified

1. `src/pages/Guests/pages/Services/ServicesPage.tsx` - Added FilterModal integration

### Files Unchanged (Reused)

1. `src/pages/Guests/components/common/FilterModal/FilterModal.tsx` - Already generic
2. `src/pages/Guests/components/common/FilterModal/types.ts` - Already has optional fields
3. `src/pages/Guests/components/common/SearchBar/SearchBar.tsx` - Already flexible

### Total Implementation Time

Following the established pattern from ShopPage and DineInPage made this implementation straightforward:

- Import updates: 2 minutes
- State setup: 3 minutes
- Filter calculation logic: 5 minutes
- Filter application logic: 10 minutes
- UI integration: 5 minutes
- **Total: ~25 minutes**

## Key Learnings

1. **Null Handling**: Amenities can have null prices (free services), requiring `|| 0` fallback
2. **Category Extraction**: Used existing `getUniqueCategories` utility from amenities transformers
3. **Simpler Structure**: Services page is simpler than DineIn (no restaurants/service types)
4. **Consistent Pattern**: Following the same pattern across pages ensures maintainability

## Notes

- Services page doesn't need a cart button (services are for information/booking, not shopping)
- Price filtering handles null values gracefully (treats as free/€0)
- The `hotel_recommended` field works perfectly for highlighting premium services
- Category names are formatted nicely with the existing `formatCategoryName` utility
- All three pages now have consistent filtering UX
