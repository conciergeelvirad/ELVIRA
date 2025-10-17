# Third-Party Components - Generic Refactoring Plan

## 🎯 Goal

**Refactor restaurant-specific components into generic, reusable components** that work for both restaurants AND tours (and any future third-party integrations).

## ✅ Your Suggestion is Better Because:

1. **DRY Principle** - No code duplication
2. **Single Source of Truth** - One component to maintain
3. **Easier Updates** - Changes benefit all third-party types
4. **Scalability** - Easy to add more third-party types (hotels, spas, etc.)
5. **Smaller Codebase** - Less code to maintain

## 🔄 Refactoring Strategy

### Current Structure (Restaurant-Specific):

```
components/third-party/
├── restaurant/
│   ├── RestaurantCard.tsx
│   ├── RestaurantList.tsx
│   ├── RestaurantDetailsModal.tsx
│   ├── RestaurantTable.tsx
│   └── restaurant-card/
│       ├── RestaurantRatingSection.tsx
│       ├── RestaurantAddressSection.tsx
│       ├── RestaurantCategoriesSection.tsx
│       ├── RestaurantStatusBadges.tsx
│       ├── RestaurantCardActions.tsx
│       └── RestaurantCardFooter.tsx
```

### Proposed Structure (Generic):

```
components/third-party/
├── shared/                                    # 🆕 Generic components
│   ├── ThirdPartyCard.tsx                    # Generic card (restaurants, tours, etc.)
│   ├── ThirdPartyList.tsx                    # Generic list
│   ├── ThirdPartyDetailsModal.tsx            # Generic details modal
│   ├── ThirdPartyTable.tsx                   # Generic table
│   └── third-party-card/                     # 🆕 Generic card sections
│       ├── RatingSection.tsx                 # Generic rating
│       ├── LocationSection.tsx               # Generic location
│       ├── CategoriesSection.tsx             # Generic categories
│       ├── StatusBadges.tsx                  # Generic status
│       ├── CardActions.tsx                   # Generic actions
│       └── CardFooter.tsx                    # Generic footer
│   └── third-party-details/                  # 🆕 Generic detail sections
│       ├── PhotosGallery.tsx
│       ├── RatingDisplay.tsx
│       ├── BasicInfo.tsx
│       ├── Categories.tsx
│       └── Reviews.tsx
├── restaurant/                               # 🔄 Restaurant-specific wrappers
│   ├── RestaurantCard.tsx                    # Wrapper using ThirdPartyCard
│   ├── RestaurantList.tsx                    # Wrapper using ThirdPartyList
│   └── RestaurantDetailsModal.tsx            # Wrapper using ThirdPartyDetailsModal
├── tour-agencies/                            # 🆕 Tour-specific wrappers
│   ├── TourCard.tsx                          # Wrapper using ThirdPartyCard
│   ├── TourList.tsx                          # Wrapper using ThirdPartyList
│   └── TourDetailsModal.tsx                  # Wrapper using ThirdPartyDetailsModal
└── third-party-filter/                       # Already generic ✅
    └── ThirdPartyFilterPanel.tsx
```

## 📋 Refactoring Steps

### Phase 1: Create Generic Card Components (Rename & Generalize)

#### 1.1 Rename `restaurant-card/` → `third-party-card/`

```bash
Move-Item restaurant-card third-party-card
```

#### 1.2 Generalize Components

**Before:**

```typescript
// RestaurantRatingSection.tsx
export function createRestaurantRatingSection(rating?: number) {
  // Restaurant-specific logic
}
```

**After:**

```typescript
// RatingSection.tsx (generic)
export function createRatingSection(
  rating?: number,
  reviewCount?: number,
  type: "restaurant" | "tour" = "restaurant"
) {
  // Generic logic that works for both
}
```

### Phase 2: Create Generic Main Components

#### 2.1 Create `ThirdPartyCard.tsx` (Generic)

**Interface:**

```typescript
interface ThirdPartyCardProps {
  // Generic properties
  id: string;
  name: string;
  type: "restaurant" | "tour" | "hotel" | "spa"; // Extensible
  rating?: number;
  reviewCount?: number;
  location: {
    address?: string;
    latitude: number;
    longitude: number;
  };
  categories?: string[];
  images?: string[];
  price?: {
    level?: number; // 1-4 for restaurants
    amount?: string; // "$50" for tours
    currency?: string; // "EUR"
  };
  status?: {
    isApproved?: boolean;
    isRecommended?: boolean;
  };
  metadata?: {
    duration?: string; // For tours
    bookingLink?: string; // For tours
    openingHours?: string[]; // For restaurants
    cuisine?: string[]; // For restaurants
    activityType?: string[]; // For tours
  };
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onRecommend?: () => void;
}
```

**Component:**

```typescript
export function ThirdPartyCard({
  type,
  name,
  rating,
  location,
  categories,
  ...rest
}: ThirdPartyCardProps) {
  // Generic sections that adapt based on type
  const sections = [
    createRatingSection(rating, rest.reviewCount, type),
    createLocationSection(location, type),
    createCategoriesSection(categories, type),
    // Conditionally add type-specific sections
    type === "tour" &&
      rest.metadata?.duration &&
      createDurationSection(rest.metadata.duration),
    type === "tour" && rest.price?.amount && createPriceSection(rest.price),
  ].filter(Boolean);

  return (
    <GenericCard
      image={rest.images?.[0]}
      icon={getTypeIcon(type)}
      badges={getTypeBadges(type, rest)}
      sections={sections}
      footer={
        <CardFooter
          status={rest.status}
          onView={rest.onView}
          onApprove={rest.onApprove}
          onReject={rest.onReject}
          onRecommend={rest.onRecommend}
        />
      }
    />
  );
}
```

### Phase 3: Create Type-Specific Wrappers

#### 3.1 Simplified `RestaurantCard.tsx` (Wrapper)

```typescript
import {
  ThirdPartyCard,
  type ThirdPartyCardProps,
} from "../shared/ThirdPartyCard";

interface RestaurantCardProps {
  restaurant: GooglePlaceResult;
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onRecommend?: () => void;
}

export function RestaurantCard({
  restaurant,
  ...actions
}: RestaurantCardProps) {
  // Transform restaurant data to generic format
  const genericData: ThirdPartyCardProps = {
    id: restaurant.place_id,
    name: restaurant.name,
    type: "restaurant",
    rating: restaurant.rating,
    reviewCount: restaurant.user_ratings_total,
    location: {
      address: restaurant.vicinity,
      latitude: restaurant.geometry.location.lat,
      longitude: restaurant.geometry.location.lng,
    },
    categories: restaurant.types,
    images: restaurant.photos?.map((p) => p.getUrl()),
    price: {
      level: restaurant.price_level,
    },
    metadata: {
      openingHours: restaurant.opening_hours?.weekday_text,
      cuisine: restaurant.types?.filter((t) => isCuisineType(t)),
    },
    ...actions,
  };

  return <ThirdPartyCard {...genericData} />;
}
```

#### 3.2 New `TourCard.tsx` (Wrapper)

```typescript
import {
  ThirdPartyCard,
  type ThirdPartyCardProps,
} from "../shared/ThirdPartyCard";

interface TourCardProps {
  tour: AmadeusActivity;
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onRecommend?: () => void;
}

export function TourCard({ tour, ...actions }: TourCardProps) {
  // Transform tour data to generic format
  const genericData: ThirdPartyCardProps = {
    id: tour.id,
    name: tour.name,
    type: "tour",
    rating: tour.rating,
    location: {
      address: tour.shortDescription,
      latitude: tour.geoCode.latitude,
      longitude: tour.geoCode.longitude,
    },
    categories: parseCategories(tour.name), // Extract from name/description
    images: tour.pictures,
    price: {
      amount: tour.price?.amount,
      currency: tour.price?.currencyCode,
    },
    metadata: {
      duration: tour.minimumDuration,
      bookingLink: tour.bookingLink,
      activityType: extractActivityTypes(tour),
    },
    ...actions,
  };

  return <ThirdPartyCard {...genericData} />;
}
```

## 🎨 Generic Utility Functions

### Helper Functions (to create)

```typescript
// thirdPartyHelpers.ts

export function getTypeIcon(type: ThirdPartyType): React.ReactNode {
  switch (type) {
    case "restaurant":
      return <UtensilsCrossed className="w-5 h-5" />;
    case "tour":
      return <MapPin className="w-5 h-5" />;
    case "hotel":
      return <Hotel className="w-5 h-5" />;
    case "spa":
      return <Sparkles className="w-5 h-5" />;
  }
}

export function formatPrice(price: PriceData, type: ThirdPartyType): string {
  if (type === "restaurant" && price.level) {
    return "€".repeat(price.level);
  }
  if (price.amount && price.currency) {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: price.currency,
    }).format(parseFloat(price.amount));
  }
  return "N/A";
}

export function getTypeBadges(type: ThirdPartyType, data: any): BadgeProps[] {
  const badges: BadgeProps[] = [];

  if (type === "restaurant" && data.price?.level) {
    badges.push({ label: formatPrice(data.price, type), variant: "outline" });
  }

  if (type === "tour" && data.metadata?.duration) {
    badges.push({
      label: formatDuration(data.metadata.duration),
      variant: "secondary",
    });
  }

  return badges;
}
```

## 📊 Benefits Comparison

| Approach                  | Pros                        | Cons                        | Maintenance           | Scalability                     |
| ------------------------- | --------------------------- | --------------------------- | --------------------- | ------------------------------- |
| **Copy & Rename**         | Fast initial setup          | Code duplication            | Hard - fix bugs twice | Poor - copy again for each type |
| **Generic + Wrappers** ✅ | Single source of truth, DRY | Slightly more complex setup | Easy - fix once       | Excellent - just add wrapper    |

## 🚀 Migration Strategy

### Step-by-Step Refactoring

1. **Create `shared/` folder structure**

   ```
   mkdir -p src/components/third-party/shared/third-party-card
   mkdir -p src/components/third-party/shared/third-party-details
   ```

2. **Move & Rename generic components**

   - `restaurant-card/` → `shared/third-party-card/`
   - Remove "Restaurant" prefix from all components
   - Generalize props and logic

3. **Create `ThirdPartyCard.tsx`**

   - Generic component accepting unified interface
   - Type-aware rendering logic
   - Conditionally render type-specific sections

4. **Refactor `RestaurantCard.tsx`** to use new generic component

   - Transform Google Places data → generic format
   - Pass to `ThirdPartyCard`
   - Keep restaurant-specific logic minimal

5. **Create `TourCard.tsx`** using same pattern

   - Transform Amadeus data → generic format
   - Pass to `ThirdPartyCard`
   - Add tour-specific transformations

6. **Test both types** work correctly with shared components

7. **Repeat for List, Modal, Table components**

## 🎯 Naming Conventions

### Generic Components (in `shared/`)

- `ThirdPartyCard` (not RestaurantCard)
- `ThirdPartyList` (not RestaurantList)
- `ThirdPartyDetailsModal` (not RestaurantDetailsModal)
- `RatingSection` (not RestaurantRatingSection)
- `LocationSection` (not RestaurantAddressSection)
- `CategoriesSection` (not RestaurantCategoriesSection)

### Type-Specific Wrappers

- `RestaurantCard` → thin wrapper around `ThirdPartyCard`
- `TourCard` → thin wrapper around `ThirdPartyCard`
- Future: `HotelCard`, `SpaCard`, etc.

## ✅ Success Criteria

- ✅ Generic components work for restaurants
- ✅ Generic components work for tours
- ✅ No code duplication
- ✅ Easy to add new third-party types
- ✅ All existing functionality preserved
- ✅ TypeScript types are generic and extensible

## 📝 Next Steps

**Should we proceed with this refactoring?**

1. Create `shared/` folder structure
2. Move and generalize `restaurant-card/` components
3. Create generic `ThirdPartyCard.tsx`
4. Refactor existing `RestaurantCard` to use generic component
5. Create new `TourCard` using same pattern
6. Repeat for List, Modal, Table components

**Estimated time**: 2-3 hours vs 5-6 hours for copy approach
**Long-term benefit**: Much easier maintenance! 🎉

---

**Your suggestion is the right architectural decision!** 💯
