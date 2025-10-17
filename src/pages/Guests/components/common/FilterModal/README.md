# FilterModal Component

A reusable filter modal component for guest pages that provides a comprehensive filtering interface.

## Features

- **Full-screen mobile-optimized modal** - Slides up from bottom on mobile, centered on desktop
- **Category multi-select** - Toggle multiple categories with visual feedback
- **Price range slider** - Dual slider for min/max price selection
- **Availability toggle** - Filter for in-stock items only
- **Hotel recommended toggle** - Show only recommended items
- **Active filter count badge** - Shows number of active filters in header
- **Apply/Reset actions** - Clear all filters or apply changes

## Usage

```tsx
import { FilterModal, type FilterOptions } from "../../components/common";

const MyPage = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    selectedCategories: [],
    priceRange: { min: 0, max: 1000 },
    showOnlyAvailable: false,
    showOnlyRecommended: false,
  });

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <>
      <button onClick={() => setIsFilterModalOpen(true)}>Open Filters</button>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        categories={["Electronics", "Clothing", "Accessories"]}
        maxPrice={500}
        currentFilters={filters}
      />
    </>
  );
};
```

## Props

### `FilterModalProps`

| Prop             | Type                               | Required | Description                       |
| ---------------- | ---------------------------------- | -------- | --------------------------------- |
| `isOpen`         | `boolean`                          | Yes      | Controls modal visibility         |
| `onClose`        | `() => void`                       | Yes      | Callback when modal is closed     |
| `onApply`        | `(filters: FilterOptions) => void` | Yes      | Callback when filters are applied |
| `categories`     | `string[]`                         | Yes      | List of available categories      |
| `maxPrice`       | `number`                           | Yes      | Maximum price for slider range    |
| `currentFilters` | `FilterOptions`                    | Yes      | Current active filters            |

### `FilterOptions` Type

```typescript
interface FilterOptions {
  selectedCategories: string[];
  priceRange: { min: number; max: number };
  showOnlyAvailable: boolean;
  showOnlyRecommended: boolean;
}
```

## Implementation Example (ShopPage)

### 1. Import dependencies

```tsx
import { FilterModal, type FilterOptions } from "../../components/common";
import { useProductCategories } from "../../../../hooks/queries";
```

### 2. Set up state

```tsx
const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
const [filters, setFilters] = useState<FilterOptions>({
  selectedCategories: [],
  priceRange: { min: 0, max: 1000 },
  showOnlyAvailable: false,
  showOnlyRecommended: false,
});

// Fetch categories
const { data: categories = [] } = useProductCategories(hotelId);

// Calculate max price
const maxPrice = useMemo(() => {
  if (products.length === 0) return 1000;
  return Math.ceil(Math.max(...products.map((p) => p.price)));
}, [products]);
```

### 3. Apply filters to data

```tsx
const filteredProducts = useMemo(() => {
  let result = products;

  // Search filter
  if (searchQuery) {
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Category filter
  if (filters.selectedCategories.length > 0) {
    result = result.filter((product) =>
      filters.selectedCategories.includes(product.category)
    );
  }

  // Price range filter
  result = result.filter(
    (product) =>
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
  );

  // Availability filter
  if (filters.showOnlyAvailable) {
    result = result.filter(
      (product) => product.is_active && (product.stock_quantity || 0) > 0
    );
  }

  // Recommended filter
  if (filters.showOnlyRecommended) {
    result = result.filter((product) => product.hotel_recommended);
  }

  return result;
}, [products, searchQuery, filters]);
```

### 4. Render modal

```tsx
<FilterModal
  isOpen={isFilterModalOpen}
  onClose={() => setIsFilterModalOpen(false)}
  onApply={(newFilters) => setFilters(newFilters)}
  categories={categories}
  maxPrice={maxPrice}
  currentFilters={filters}
/>
```

## Design Features

### Mobile Optimizations

- Slides up from bottom with animation
- Full-width on mobile
- Touch-optimized toggle switches
- Large touch targets (44px min)
- Sticky header and footer
- Smooth scrolling content area

### Desktop Enhancements

- Centered modal with max-width
- Rounded corners
- Backdrop blur effect
- Fade-in animation

### Visual Feedback

- Active filter count badge in header
- Selected category pills with blue highlight
- Real-time price range values
- Toggle switch animations
- Hover states on all interactive elements

## Accessibility

- **Keyboard navigation** - All controls are keyboard accessible
- **ARIA labels** - Close button has proper aria-label
- **Focus management** - Modal traps focus when open
- **Screen reader support** - All form controls are properly labeled
- **Touch targets** - All buttons meet 44px minimum size

## Responsive Behavior

### Mobile (<640px)

- Full-screen modal
- Slides up from bottom
- Rounded top corners only
- Stack layout

### Desktop (≥640px)

- Centered modal
- Max-width: 32rem (512px)
- All corners rounded
- Backdrop blur

## Future Enhancements

- [ ] Save filter presets
- [ ] URL query parameter sync
- [ ] Filter history/undo
- [ ] Advanced filters (date range, custom fields)
- [ ] Multi-language support
- [ ] Accessibility improvements (focus trap)
