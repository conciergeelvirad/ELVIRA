# Third Party Management - Refactored Structure

This document describes the refactored structure of the Third Party Management feature, which has been broken down into smaller, reusable, and maintainable pieces.

## 📁 File Structure

```
src/
├── components/
│   ├── common/
│   │   └── FilterPanel.tsx                    # ⭐ NEW: Generic reusable filter panel
│   └── third-party/
│       ├── ThirdPartyFilterPanel.tsx          # ⭐ NEW: Specialized filter for third-party places
│       └── RadiusSelector.tsx                 # ⭐ NEW: Radius selection component
│
├── hooks/
│   └── features/
│       ├── useThirdPartyFilters.ts            # ⭐ NEW: Filter state management
│       └── useThirdPartyActions.ts            # ⭐ NEW: Action handlers (approve, reject, etc.)
│
├── utils/
│   └── thirdPartyHelpers.ts                   # ⭐ NEW: Utility functions
│
└── pages/
    └── Hotel/
        └── ThirdPartyManagementPage.tsx       # 🔄 SIMPLIFIED: Main page using extracted pieces
```

## 🎯 Design Philosophy

### Reusability First

All components are designed to be reusable across different pages:

- **Generic FilterPanel** can be used for any page requiring filters
- **Custom hooks** can be imported and used anywhere
- **Utility functions** are pure and stateless

### Separation of Concerns

- **UI Components**: Pure presentation, no business logic
- **Custom Hooks**: State management and side effects
- **Utilities**: Pure functions for data transformation

### Composability

Components use a compound component pattern for maximum flexibility:

```typescript
<FilterPanel>
  <FilterPanel.Section>
    <FilterPanel.Checkbox />
    <FilterPanel.Slider />
  </FilterPanel.Section>
  <FilterPanel.Actions />
</FilterPanel>
```

## 📦 Components

### 1. FilterPanel (Generic)

**Location**: `components/common/FilterPanel.tsx`

A completely reusable filter panel component that can be used across the entire application.

**Features**:

- Compound component pattern (Section, Checkbox, Slider, Actions)
- Fully customizable
- Collapsible/expandable
- Built-in reset functionality
- Result counter

**Usage Example**:

```typescript
import { FilterPanel } from "@/components/common/FilterPanel";

<FilterPanel isOpen={isOpen} onToggle={handleToggle} title="Filters">
  <FilterPanel.Section title="Categories">
    <FilterPanel.Checkbox
      label="Category 1"
      checked={checked}
      onChange={setChecked}
    />
  </FilterPanel.Section>

  <FilterPanel.Slider
    label="Price Range"
    value={price}
    onChange={setPrice}
    min={0}
    max={100}
  />

  <FilterPanel.Actions
    onReset={resetFilters}
    resultCount={10}
    totalCount={100}
  />
</FilterPanel>;
```

**Reuse Potential**:

- ✅ Guest conversations page
- ✅ Staff management page
- ✅ Bookings page
- ✅ Any page requiring filters

### 2. ThirdPartyFilterPanel (Specialized)

**Location**: `components/third-party/ThirdPartyFilterPanel.tsx`

Specialized filter panel for third-party places, built using the generic FilterPanel.

**Features**:

- Place type filtering (restaurant, bar, cafe, night club)
- Approval status filtering (pending, approved, rejected)
- Minimum rating slider
- Price level filtering
- Recommended-only toggle

**Usage Example**:

```typescript
import { ThirdPartyFilterPanel } from "@/components/third-party/ThirdPartyFilterPanel";

<ThirdPartyFilterPanel
  isOpen={isFilterOpen}
  onToggle={() => setIsFilterOpen(!isFilterOpen)}
  filters={filters}
  onFiltersChange={updateFilters}
  onReset={resetFilters}
  resultCount={filteredRestaurants.length}
  totalCount={restaurants.length}
/>;
```

### 3. RadiusSelector

**Location**: `components/third-party/RadiusSelector.tsx`

Component for selecting search radius with slider and preset buttons.

**Features**:

- Slider for precise control (1km - 10km)
- Quick preset buttons (1km, 2km, 5km, 10km)
- Automatic formatting (meters/kilometers)
- Optional refetch button

**Usage Example**:

```typescript
import { RadiusSelector } from "@/components/third-party/RadiusSelector";

<RadiusSelector
  radius={radius}
  onRadiusChange={setRadius}
  onRefetch={refetchPlaces}
/>;
```

## 🪝 Custom Hooks

### 1. useThirdPartyFilters

**Location**: `hooks/features/useThirdPartyFilters.ts`

Manages all filter state and provides filter functions.

**Features**:

- Centralized filter state management
- Filter update functions
- Reset functionality
- Default values

**Usage Example**:

```typescript
import { useThirdPartyFilters } from "@/hooks/features/useThirdPartyFilters";

const { filters, updateFilters, resetFilters, isFilterOpen, setIsFilterOpen } =
  useThirdPartyFilters();

// Update specific filter
updateFilters({ minRating: 4.0 });

// Reset all filters
resetFilters();
```

**State Managed**:

- `selectedTypes`: string[]
- `selectedStatuses`: ApprovalStatus[]
- `minRating`: number
- `selectedPriceLevels`: number[]
- `showRecommendedOnly`: boolean
- `isFilterOpen`: boolean

### 2. useThirdPartyActions

**Location**: `hooks/features/useThirdPartyActions.ts`

Encapsulates all action handlers for third-party places.

**Features**:

- Approve/reject places
- Toggle recommended status
- View details modal management
- Loading states

**Usage Example**:

```typescript
import { useThirdPartyActions } from "@/hooks/features/useThirdPartyActions";

const {
  handleApprove,
  handleReject,
  handleToggleRecommended,
  handleViewDetails,
  handleCloseDetails,
  selectedPlaceId,
  isActionLoading,
  getRecommendedStatus,
} = useThirdPartyActions({ hotelId, approvedPlaces });

// Approve a place
await handleApprove(restaurant);

// Toggle recommended
await handleToggleRecommended(restaurant);

// View details
handleViewDetails(restaurant);
```

## 🛠️ Utility Functions

### thirdPartyHelpers.ts

**Location**: `utils/thirdPartyHelpers.ts`

Collection of pure utility functions for working with third-party places data.

**Categories**:

#### Approval Status Helpers

```typescript
getApprovalStatus(placeId, approvedPlaces); // Get status
isRecommended(placeId, approvedPlaces); // Check recommended
isApproved(placeId, approvedPlaces); // Check approved
isRejected(placeId, approvedPlaces); // Check rejected
isPending(placeId, approvedPlaces); // Check pending
```

#### Place Type Helpers

```typescript
getPlaceType(types); // Get primary type
getPlaceTypeLabel(type); // Get display label
```

#### Filtering

```typescript
filterRestaurants(restaurants, approvedPlaces, criteria);
```

#### Formatting

```typescript
formatRating(rating); // "4.5 ⭐"
formatPriceLevel(level); // "€€€"
formatDistance(meters); // "2.5 km"
getStatusColor(status); // "bg-green-100 text-green-800"
getStatusIcon(status); // "✅"
```

#### Sorting

```typescript
sortRestaurants(restaurants, sortBy, ascending);
```

#### Validation

```typescript
hasValidCoordinates(restaurant);
hasMinimumData(restaurant);
```

## 🔄 Refactored Main Page

### Before Refactoring

**ThirdPartyManagementPage.tsx**: ~539 lines

- All filter UI inline
- All state management inline
- All helper functions inline
- All action handlers inline

### After Refactoring

**ThirdPartyManagementPage.tsx**: ~200 lines (projected)

- Uses `useThirdPartyFilters()` for state
- Uses `useThirdPartyActions()` for actions
- Uses `<ThirdPartyFilterPanel />` for filters
- Uses `<RadiusSelector />` for radius
- Uses utility functions for data transformation

**Benefits**:

- ✅ 60% reduction in file size
- ✅ Easier to test (each piece independently)
- ✅ Easier to maintain (clear separation)
- ✅ Reusable components for other pages
- ✅ Better code organization

## 📝 Migration Guide

### For New Features

When adding new filter capabilities:

1. **Add to FilterPanel** if it's generic (checkbox, slider, etc.)
2. **Add to ThirdPartyFilterPanel** if it's specific to third-party places
3. **Update useThirdPartyFilters** to manage the new state
4. **Update thirdPartyHelpers** to include filtering logic

### For Other Pages

To use the filter panel system on other pages:

1. **Create specialized filter panel** using `<FilterPanel>` compound components
2. **Create custom hook** for your page's filter state
3. **Reuse utility patterns** from `thirdPartyHelpers.ts`

**Example**: Guest Conversations Filter

```typescript
// 1. Create specialized component
export const GuestConversationsFilterPanel: React.FC<Props> = ({...}) => {
  return (
    <FilterPanel isOpen={isOpen} onToggle={onToggle} title="Filter Conversations">
      <FilterPanel.Section title="Status">
        <FilterPanel.Checkbox label="Open" {...} />
        <FilterPanel.Checkbox label="Closed" {...} />
      </FilterPanel.Section>
      {/* More filters... */}
    </FilterPanel>
  );
};

// 2. Create filter hook
export const useGuestConversationsFilters = () => {
  const [filters, setFilters] = useState({...});
  // Filter logic...
  return { filters, updateFilters, resetFilters };
};

// 3. Use in page
const { filters, updateFilters, resetFilters } = useGuestConversationsFilters();
```

## 🧪 Testing Strategy

### Unit Tests

- **Components**: Test rendering, user interactions, props handling
- **Hooks**: Test state management, filter logic, action handling
- **Utils**: Test pure functions with various inputs

### Integration Tests

- Test filter changes update displayed data
- Test actions trigger correct API calls
- Test modal interactions

### Example Test Structure

```typescript
// FilterPanel.test.tsx
describe("FilterPanel", () => {
  it("renders with title", () => {});
  it("toggles open/closed", () => {});
  it("calls onReset when reset clicked", () => {});
});

// useThirdPartyFilters.test.ts
describe("useThirdPartyFilters", () => {
  it("initializes with default values", () => {});
  it("updates filters correctly", () => {});
  it("resets filters to defaults", () => {});
});

// thirdPartyHelpers.test.ts
describe("filterRestaurants", () => {
  it("filters by place type", () => {});
  it("filters by approval status", () => {});
  it("filters by multiple criteria", () => {});
});
```

## 🚀 Performance Considerations

### Memoization

Use `useMemo` for expensive filtering operations:

```typescript
const filteredRestaurants = useMemo(
  () => filterRestaurants(restaurants, approvedPlaces, filters),
  [restaurants, approvedPlaces, filters]
);
```

### Lazy Loading

- Filters are collapsed by default
- Details modal loads data only when opened
- Radius updates are debounced

### Component Optimization

- Pure components where possible
- Avoid inline function definitions
- Use React.memo for expensive components

## 📚 Best Practices

### 1. Keep Components Pure

Components should only handle presentation:

```typescript
// ✅ Good
<ThirdPartyFilterPanel filters={filters} onFiltersChange={updateFilters} />

// ❌ Bad - business logic in component
<ThirdPartyFilterPanel onApprove={async () => { /* API call */ }} />
```

### 2. Centralize State

Use custom hooks for state management:

```typescript
// ✅ Good
const { filters, updateFilters } = useThirdPartyFilters();

// ❌ Bad - scattered state
const [type, setType] = useState(...);
const [status, setStatus] = useState(...);
// ...many more states
```

### 3. Use Utility Functions

Extract reusable logic:

```typescript
// ✅ Good
const status = getApprovalStatus(placeId, approvedPlaces);

// ❌ Bad - inline logic repeated everywhere
const status =
  approvedPlaces.find((ap) => ap.place_id === placeId)?.status || "pending";
```

### 4. Type Everything

Maintain strong typing:

```typescript
// ✅ Good
export interface ThirdPartyFilters {
  selectedTypes: string[];
  minRating: number;
}

// ❌ Bad
const filters: any = {...};
```

## 🔮 Future Enhancements

### Planned Improvements

- [ ] Add filter presets (save/load filter configurations)
- [ ] Add export functionality (CSV, PDF)
- [ ] Add bulk actions (approve/reject multiple)
- [ ] Add advanced search with text input
- [ ] Add sorting options UI
- [ ] Add filter history/undo
- [ ] Add keyboard shortcuts
- [ ] Add accessibility improvements (ARIA labels)

### Reusability Roadmap

- [ ] Create filters for Guest Conversations page
- [ ] Create filters for Staff Management page
- [ ] Create filters for Bookings page
- [ ] Extract common patterns into shared library
- [ ] Create filter template generator

## 📖 Additional Resources

### Related Documentation

- [FilterPanel API Documentation](./components/common/FilterPanel.md)
- [Custom Hooks Guide](./hooks/README.md)
- [Utility Functions Reference](./utils/README.md)

### Code Examples

- [Complete refactored page example](./examples/ThirdPartyManagementPage.example.tsx)
- [Creating custom filters](./examples/CustomFilterPanel.example.tsx)
- [Testing refactored components](./examples/FilterPanel.test.example.tsx)
