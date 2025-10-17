# Tour Agencies Components - Reusability Analysis

## 🎯 Goal

Maximize component reuse from existing Restaurant components for the Tour Agencies tab.

## 📊 Restaurant Components Analysis

### ✅ Highly Reusable Components

#### 1. **Common Components** (Can be used directly)

| Component          | Location               | Reusability | Tour Use Case                                 |
| ------------------ | ---------------------- | ----------- | --------------------------------------------- |
| **GenericCard**    | `common/data-display/` | 🟢 100%     | Tour cards with images, ratings, prices       |
| **Badge**          | `common/data-display/` | 🟢 100%     | Categories, price levels, duration            |
| **StatusBadge**    | `common/data-display/` | 🟢 100%     | Approval status (if we add approval workflow) |
| **InfoRow**        | `common/detail/`       | 🟢 100%     | Tour details (duration, location, etc.)       |
| **InfoSection**    | `common/detail/`       | 🟢 100%     | Grouping tour information sections            |
| **LoadingSpinner** | `common/ui/loading/`   | 🟢 100%     | Loading states                                |
| **Modal**          | `common/`              | 🟢 100%     | Tour details modal                            |
| **FilterPanel**    | `common/`              | 🟢 100%     | Filter tours by rating, price, type           |

#### 2. **Third-Party Shared Components** (Can be adapted)

| Component                 | Current Use        | Adaptation Needed | New Use                                |
| ------------------------- | ------------------ | ----------------- | -------------------------------------- |
| **RadiusSelector**        | Restaurant search  | 🟢 None           | Tour search radius                     |
| **ThirdPartyFilterPanel** | Restaurant filters | 🟡 Modify filters | Tour filters (rating, price, duration) |

### 🔄 Adaptable Restaurant Sub-Components

#### From `restaurant-card/`:

| Component                           | Current Function              | Tour Equivalent               | Reusability                |
| ----------------------------------- | ----------------------------- | ----------------------------- | -------------------------- |
| `createRestaurantRatingSection`     | Display restaurant rating     | `createTourRatingSection`     | 🟢 95% - Same structure    |
| `createRestaurantAddressSection`    | Display address with MapPin   | `createTourLocationSection`   | 🟢 95% - Same icon, layout |
| `createRestaurantCategoriesSection` | Display types/categories      | `createTourCategoriesSection` | 🟢 100% - Identical logic  |
| `RestaurantStatusBadges`            | Approval + Recommended        | `TourStatusBadges`            | 🟢 100% - Same pattern     |
| `RestaurantCardActions`             | View/Approve/Reject/Recommend | `TourCardActions`             | 🟢 95% - Same buttons      |
| `RestaurantCardFooter`              | Combines badges + actions     | `TourCardFooter`              | 🟢 100% - Same layout      |

#### From `restaurant-details/`:

| Component                 | Current Function      | Tour Equivalent     | Reusability                     |
| ------------------------- | --------------------- | ------------------- | ------------------------------- |
| `RestaurantPhotosGallery` | Photo grid display    | `TourPhotosGallery` | 🟢 100% - Same structure        |
| `RestaurantRatingDisplay` | Rating summary        | `TourRatingDisplay` | 🟢 100% - Same display          |
| `RestaurantBasicInfo`     | Address, phone, hours | `TourBasicInfo`     | 🟡 80% - Adapt for tour details |
| `RestaurantCategories`    | Type badges           | `TourCategories`    | 🟢 100% - Same badges           |
| `RestaurantReviews`       | Customer reviews      | `TourReviews`       | 🟢 100% - Same structure        |

### 🆕 Tour-Specific Components Needed

| Component                | Purpose                  | Based On              | Complexity |
| ------------------------ | ------------------------ | --------------------- | ---------- |
| `TourDurationSection`    | Display tour duration    | InfoRow               | 🟢 Low     |
| `TourPriceSection`       | Display price + currency | Price badge + InfoRow | 🟢 Low     |
| `TourBookingButton`      | Direct booking link      | External link button  | 🟢 Low     |
| `TourDescriptionSection` | Tour description text    | Text display          | 🟢 Low     |

## 🏗️ Proposed Architecture

### Tour Card Structure (Reuse 90%)

```typescript
TourCard (NEW - ~100 lines)
├── GenericCard (REUSE ✅)
│   ├── Image display
│   ├── Title
│   └── Sections array
├── createTourRatingSection (ADAPT from Restaurant)
├── createTourPriceSection (NEW)
├── createTourLocationSection (ADAPT from Restaurant)
├── createTourCategoriesSection (ADAPT from Restaurant)
└── TourCardFooter (ADAPT from Restaurant)
    ├── TourStatusBadges (ADAPT from Restaurant)
    └── TourCardActions (ADAPT from Restaurant)
```

### Tour Details Modal (Reuse 85%)

```typescript
TourDetailsModal (NEW - ~150 lines)
├── Modal (REUSE ✅)
├── LoadingSpinner (REUSE ✅)
├── TourPhotosGallery (ADAPT from Restaurant 95%)
├── TourRatingDisplay (ADAPT from Restaurant 100%)
├── TourBasicInfo (NEW with reused InfoRow/InfoSection)
│   ├── InfoRow (REUSE ✅) - Duration
│   ├── InfoRow (REUSE ✅) - Location
│   ├── InfoRow (REUSE ✅) - Price
│   └── InfoRow (REUSE ✅) - Booking link
├── TourDescriptionSection (NEW)
├── TourCategories (ADAPT from Restaurant 100%)
└── TourReviews (ADAPT from Restaurant 100%)
```

### Tour List (Reuse 70%)

```typescript
TourList (NEW - ~100 lines)
├── Grid layout (COPY from RestaurantList)
├── Empty state (REUSE pattern)
├── Map over tours (SAME)
└── TourCard for each item (NEW but reuses GenericCard)
```

### Tour Filter Panel (Adapt 60%)

```typescript
TourFilterPanel (ADAPT from ThirdPartyFilterPanel)
├── FilterPanel (REUSE ✅)
├── PlaceTypeFilter → TourTypeFilter (ADAPT)
│   └── Types: Cultural, Adventure, Food, Nature, etc.
├── RatingFilter (REUSE ✅ 100%)
├── PriceLevelFilter (REUSE ✅ 100%)
├── DurationFilter (NEW - similar to RatingFilter)
└── RecommendedFilter (REUSE ✅ 100%)
```

## 📋 Implementation Plan

### Phase 1: Direct Reuse (Day 1)

✅ **No modifications needed**:

- GenericCard
- Badge
- StatusBadge
- InfoRow
- InfoSection
- LoadingSpinner
- Modal
- FilterPanel
- RadiusSelector

### Phase 2: Adapt Restaurant Components (Day 1-2)

🔄 **Minor modifications needed**:

1. **Create `tour-card/` folder** (copy from `restaurant-card/`)

   - Rename functions: `createRestaurantRatingSection` → `createTourRatingSection`
   - Add `createTourDurationSection` (new)
   - Add `createTourPriceSection` (new)
   - Adapt `RestaurantCardFooter` → `TourCardFooter`

2. **Create `tour-details/` folder** (copy from `restaurant-details/`)

   - Adapt `RestaurantPhotosGallery` → `TourPhotosGallery`
   - Adapt `RestaurantRatingDisplay` → `TourRatingDisplay`
   - Create `TourBasicInfo` (similar to RestaurantBasicInfo)
   - Create `TourDescriptionSection` (new, simple)

3. **Create `tour-filter/` folder** (copy from `third-party-filter/`)
   - Create `TourTypeFilter` (adapt from PlaceTypeFilter)
   - Add `TourDurationFilter` (similar to RatingFilter)
   - Reuse other filters as-is

### Phase 3: Create Main Components (Day 2)

🆕 **New components using reusable pieces**:

- `TourCard.tsx` (using GenericCard + tour-card components)
- `TourList.tsx` (copy structure from RestaurantList)
- `TourDetailsModal.tsx` (using Modal + tour-details components)
- `TourFilterPanel.tsx` (adapt from ThirdPartyFilterPanel)

## 🎨 Component Mapping

### Restaurant → Tour Equivalents

| Restaurant Component     | Tour Component         | Change % |
| ------------------------ | ---------------------- | -------- |
| `RestaurantCard`         | `TourCard`             | 20%      |
| `RestaurantList`         | `TourList`             | 15%      |
| `RestaurantDetailsModal` | `TourDetailsModal`     | 25%      |
| `RestaurantTable`        | `TourTable` (optional) | 10%      |
| `ThirdPartyFilterPanel`  | `TourFilterPanel`      | 30%      |

### Data Structure Mapping

```typescript
// Restaurant (Google Places)
interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  photos?: Array<...>;
  types?: string[];
}

// Tour (Amadeus)
interface AmadeusActivity {
  id: string;                    // ✅ Same as place_id
  name: string;                  // ✅ Same
  geoCode: { lat, lng };         // ✅ Similar to geometry
  rating?: number;               // ✅ Same
  pictures?: string[];           // ✅ Similar to photos
  price?: { amount, currency };  // 🔄 Different structure
  minimumDuration?: string;      // 🆕 New field
  shortDescription?: string;     // 🆕 New field
  bookingLink?: string;          // 🆕 New field
}
```

## 🔧 Utilities to Create

### New Helper Functions (similar to badgeHelpers)

```typescript
// tourHelpers.ts
export function formatDuration(duration: string): string {
  // "PT2H30M" → "2h 30min"
}

export function formatPrice(price: {
  amount: string;
  currencyCode: string;
}): string {
  // "50" + "EUR" → "€50.00"
}

export function getTourTypeIcon(type: string): React.ReactNode {
  // Return appropriate icon for tour type
}

export function parseDurationToMinutes(duration: string): number {
  // "PT2H30M" → 150 minutes
}
```

## 📊 Estimated Reusability

| Category            | Reuse % | Lines Saved      |
| ------------------- | ------- | ---------------- |
| Common Components   | 100%    | ~800 lines       |
| Layout & Structure  | 85%     | ~200 lines       |
| Styling & Design    | 95%     | ~150 lines       |
| Logic Patterns      | 80%     | ~100 lines       |
| **Total Estimated** | **88%** | **~1,250 lines** |

## ✅ Benefits of High Reusability

1. **Faster Development**: ~70% less code to write
2. **Consistent UI**: Same look and feel as restaurants
3. **Proven Components**: Already tested and working
4. **Easy Maintenance**: Changes affect both sections
5. **TypeScript Safety**: Existing types can guide new ones

## 🎯 Recommended Approach

### Step 1: Copy & Adapt Pattern

```bash
# Create tour-card folder
cp -r restaurant-card/ tour-card/
# Rename components and adapt for tours
```

### Step 2: Reuse Common Components Directly

```typescript
import { GenericCard, Badge, StatusBadge, InfoRow } from "@/components/common";
```

### Step 3: Create Tour-Specific Extensions

```typescript
// Only create what's truly different for tours
export const TourDurationSection = ...
export const TourBookingButton = ...
```

## 📝 Next Steps

1. ✅ **Analyze complete** - We can reuse ~88% of restaurant components
2. 🔄 **Start with tour-card/** - Copy and adapt restaurant-card components
3. 🔄 **Create TourCard.tsx** - Using GenericCard + adapted sections
4. 🔄 **Create TourList.tsx** - Copy RestaurantList structure
5. 🔄 **Create tour-details/** - Adapt restaurant-details components
6. 🔄 **Create TourDetailsModal.tsx** - Using Modal + adapted details
7. 🔄 **Adapt filters** - Create tour-specific filter options

---

**Conclusion**: We can reuse approximately **88% of the restaurant component architecture** for tours, saving significant development time while maintaining consistency! 🎉
