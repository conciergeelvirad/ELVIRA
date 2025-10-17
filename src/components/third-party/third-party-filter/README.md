# Third-Party Filter Components

Modular filter components extracted from `ThirdPartyFilterPanel.tsx` to improve maintainability and reusability.

## Overview

The Third-Party Filter Panel provides comprehensive filtering for third-party places (restaurants, bars, cafes, night clubs). It has been refactored from **192 lines to 99 lines** (~48% reduction) by extracting filter components and constants.

## Components

### Filter Components

#### `PlaceTypeFilter`

- **Purpose**: Allows filtering by place type
- **Props**:
  - `selectedTypes`: Array of selected type values
  - `onTypeToggle`: Handler for type selection changes
- **Options**: Restaurant, Bar, Cafe, Night Club
- **Features**: Multi-select checkboxes with emoji icons

#### `ApprovalStatusFilter`

- **Purpose**: Allows filtering by approval status
- **Props**:
  - `selectedStatuses`: Array of selected status values
  - `onStatusToggle`: Handler for status selection changes
- **Options**: Pending, Approved, Rejected
- **Features**: Multi-select checkboxes with status icons

#### `PriceLevelFilter`

- **Purpose**: Allows filtering by price level
- **Props**:
  - `selectedPriceLevels`: Array of selected price levels (1-4)
  - `onPriceLevelToggle`: Handler for price level changes
- **Options**: € (Inexpensive), €€ (Moderate), €€€ (Expensive), €€€€ (Very Expensive)
- **Features**: Multi-select checkboxes with descriptive labels

#### `RatingFilter`

- **Purpose**: Allows filtering by minimum rating
- **Props**:
  - `minRating`: Current minimum rating value (0-5)
  - `onRatingChange`: Handler for rating changes
- **Features**:
  - Slider control (0-5 range, 0.5 step)
  - Formatted display (e.g., "3.5+ ⭐" or "Any")
  - Uses FilterPanel.Slider component

#### `RecommendedFilter`

- **Purpose**: Toggle to show only recommended places
- **Props**:
  - `showRecommendedOnly`: Current toggle state
  - `onToggle`: Handler for toggle changes
- **Features**: Single checkbox with star emoji

### Constants Module

#### `filterConstants.ts`

Centralized configuration for all filter options:

```typescript
// Place Types
PLACE_TYPES: Array<{value, label, icon}>
- restaurant: "🍽️ Restaurant"
- bar: "🍺 Bar"
- cafe: "☕ Cafe"
- night_club: "🎵 Night Club"

// Approval Statuses
APPROVAL_STATUSES: Array<{value, label, icon}>
- pending: "⏳ Pending"
- approved: "✅ Approved"
- rejected: "❌ Rejected"

// Price Levels
PRICE_LEVELS: Array<{value, label}>
- 1: "€ - Inexpensive"
- 2: "€€ - Moderate"
- 3: "€€€ - Expensive"
- 4: "€€€€ - Very Expensive"

// Utility Function
formatRating(rating: number): string
- Returns "Any" for rating 0
- Returns formatted string like "3.5+ ⭐"
```

## Architecture

```
ThirdPartyFilterPanel (99 lines - Main Component)
├── Handler Functions (toggle logic for each filter type)
├── FilterPanel (from common components)
└── Grid Layout (5 columns)
    ├── PlaceTypeFilter (30 lines)
    ├── ApprovalStatusFilter (33 lines)
    ├── PriceLevelFilter (32 lines)
    ├── RatingFilter (28 lines)
    └── RecommendedFilter (25 lines)

filterConstants.ts (39 lines)
├── PLACE_TYPES
├── APPROVAL_STATUSES
├── PRICE_LEVELS
└── formatRating()
```

## Refactoring Benefits

### Before

- **192 lines**: Single monolithic component
- **Inline constants**: Hard-coded filter options
- **Repeated patterns**: Similar checkbox logic repeated
- **Hard to test**: Filter UI logic embedded in main component

### After

- **99 lines**: Clean, orchestrating component
- **5 modular filters**: Each filter is a focused component
- **Centralized constants**: Easy to modify filter options
- **Highly testable**: Each filter component independently testable
- **Better maintainability**: Changes to one filter don't affect others

## Usage in ThirdPartyFilterPanel

```tsx
import {
  PlaceTypeFilter,
  ApprovalStatusFilter,
  PriceLevelFilter,
  RatingFilter,
  RecommendedFilter,
} from "./third-party-filter";

export const ThirdPartyFilterPanel = ({ filters, onFiltersChange, ... }) => {
  // Handler functions
  const handleTypeToggle = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.selectedTypes, type]
      : filters.selectedTypes.filter((t) => t !== type);
    onFiltersChange({ selectedTypes: newTypes });
  };

  // Similar handlers for status, price level...

  return (
    <FilterPanel isOpen={isOpen} onToggle={onToggle} title="Filters">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <PlaceTypeFilter
          selectedTypes={filters.selectedTypes}
          onTypeToggle={handleTypeToggle}
        />

        <ApprovalStatusFilter
          selectedStatuses={filters.selectedStatuses}
          onStatusToggle={handleStatusToggle}
        />

        <PriceLevelFilter
          selectedPriceLevels={filters.selectedPriceLevels}
          onPriceLevelToggle={handlePriceLevelToggle}
        />

        <RatingFilter
          minRating={filters.minRating}
          onRatingChange={(value) => onFiltersChange({ minRating: value })}
        />

        <RecommendedFilter
          showRecommendedOnly={filters.showRecommendedOnly}
          onToggle={(checked) =>
            onFiltersChange({ showRecommendedOnly: checked })
          }
        />
      </div>

      <FilterPanel.Actions
        onReset={onReset}
        resultCount={resultCount}
        totalCount={totalCount}
      />
    </FilterPanel>
  );
};
```

## Filter State Interface

```typescript
interface ThirdPartyFilters {
  selectedTypes: string[]; // ["restaurant", "bar"]
  selectedStatuses: ApprovalStatus[]; // ["approved", "pending"]
  minRating: number; // 0-5 range
  selectedPriceLevels: number[]; // [1, 2, 3, 4]
  showRecommendedOnly: boolean; // true/false
}
```

## Common Components Used

- **FilterPanel**: Base panel component with sections, checkboxes, and slider
- **FilterPanel.Section**: Section wrapper with title
- **FilterPanel.Checkbox**: Styled checkbox with label
- **FilterPanel.Slider**: Range slider with formatted value display
- **FilterPanel.Actions**: Reset button and result count display

## Dependencies

- `../../common/FilterPanel`: Base filter panel component
- `../../../types/approved-third-party-places`: ApprovalStatus type

## Testing Considerations

Each component can be tested independently:

1. **PlaceTypeFilter**: Test checkbox state and toggle handler calls
2. **ApprovalStatusFilter**: Test status selection and multi-select behavior
3. **PriceLevelFilter**: Test price level selection logic
4. **RatingFilter**: Test slider value changes and formatting
5. **RecommendedFilter**: Test toggle state
6. **filterConstants**: Test formatRating utility function

## Constants Modification

To add new filter options, update `filterConstants.ts`:

```typescript
// Add new place type
export const PLACE_TYPES = [
  // ... existing types
  { value: "bakery", label: "🥖 Bakery", icon: "🥖" },
];

// Add new price level
export const PRICE_LEVELS = [
  // ... existing levels
  { value: 5, label: "€€€€€ - Luxury" },
];
```

## Grid Layout

The filter panel uses a responsive grid:

- **Mobile (sm)**: 2 columns
- **Tablet (md)**: 3 columns
- **Desktop (lg)**: 5 columns

Each filter component occupies one grid column, creating a compact, organized layout.

## Future Enhancements

- Add date range filter for place opening dates
- Add distance/radius filter integration
- Add saved filter presets
- Add filter application count badges
- Support keyboard shortcuts for quick filtering
- Add filter state persistence to localStorage
- Support URL query parameters for shareable filtered views
