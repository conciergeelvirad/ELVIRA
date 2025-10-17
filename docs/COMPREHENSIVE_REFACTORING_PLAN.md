# Comprehensive Refactoring Plan 🎯

## Overview

This document outlines the refactoring strategy for 8 large files totaling **~2,200+ lines** of code. The goal is to break them into smaller, reusable, maintainable components following the patterns established in the FilterableListPage and QAPage refactorings.

---

## Files to Refactor (Priority Order)

### ✅ **Already Refactored**

- ✅ FilterableListPage (Shop/DineIn/Services) - 70% reduction
- ✅ QAPage (355 → 105 lines) - 70% reduction

### 🔄 **To Be Refactored** (2,200+ lines total)

| Priority | File                          | Lines | Complexity | Est. Components |
| -------- | ----------------------------- | ----- | ---------- | --------------- |
| 1        | useGuestChat.ts               | 304   | High       | 2 hooks + utils |
| 2        | FilterModal.tsx               | 300   | Medium     | 3 components    |
| 3        | RecommendedItemModal.tsx      | 350   | High       | 4 components    |
| 4        | ApprovedThirdPartySection.tsx | 350   | High       | 5 components    |
| 5        | FilterableListPage.tsx        | 250   | Medium     | Already modular |
| 6        | PhotoGallerySection.tsx       | 250   | Medium     | 3 components    |
| 7        | ExperienceCard.tsx            | 200   | Low        | 2 components    |
| 8        | GuestDashboard.tsx            | 200   | Medium     | Orchestration   |

---

## Phase 1: useGuestChat.ts (304 lines) 🔴 HIGH PRIORITY

### Current State

- Single large hook with multiple responsibilities
- Staff lookup logic embedded
- Message transformation logic
- Realtime subscription management

### Refactoring Strategy

#### 1.1 Split into Multiple Hooks

```
src/pages/Guests/components/Chat/hooks/
├── useGuestChat.ts (main hook - 80 lines)
├── useStaffAssignment.ts (40 lines)
├── useConversationSetup.ts (60 lines)
├── useMessageSubscription.ts (50 lines)
└── index.ts
```

**New Hooks:**

1. **useStaffAssignment** - Find and assign staff

   - `findAvailableStaff()` logic
   - Staff priority handling (Manager > Reception)
   - Returns: `{ assignedStaffId, isAssigning, error }`

2. **useConversationSetup** - Create/fetch conversation

   - Conversation creation logic
   - Guest-to-conversation mapping
   - Returns: `{ conversationId, isCreating, error }`

3. **useMessageSubscription** - Realtime updates

   - Supabase subscription setup/cleanup
   - Message event handling
   - Returns: `{ subscribe, unsubscribe }`

4. **useGuestChat** (main) - Orchestration
   - Combines all hooks
   - Provides simple API
   - Returns: `{ messages, sendMessage, isLoading, unreadCount }`

#### 1.2 Extract Utilities

```
src/pages/Guests/components/Chat/utils/
├── messageTransformers.ts
├── staffLookup.ts
└── conversationHelpers.ts
```

**Expected Reduction:** 304 → 80 lines main hook + 4 smaller hooks (~60 lines each)

---

## Phase 2: FilterModal.tsx (300 lines) 🟡 MEDIUM PRIORITY

### Current State

- Single modal component handling all filter types
- Price range slider
- Category checkboxes
- Additional filter options (restaurants, service types)

### Refactoring Strategy

#### 2.1 Component Breakdown

```
src/pages/Guests/components/common/FilterModal/
├── FilterModal.tsx (main - 80 lines)
├── components/
│   ├── PriceRangeFilter.tsx (60 lines)
│   ├── CategoryFilter.tsx (50 lines)
│   ├── AdditionalFilters.tsx (40 lines)
│   └── FilterActions.tsx (30 lines)
├── hooks/
│   └── useFilterState.ts (40 lines) ⬅️ Already exists! Reuse
└── index.ts
```

**New Components:**

1. **PriceRangeFilter** - Price slider

   - Min/max inputs
   - Range slider UI
   - Price formatting
   - Props: `{ min, max, value, onChange }`

2. **CategoryFilter** - Category checkboxes

   - Category list rendering
   - Select all/none
   - Count badges
   - Props: `{ categories, selected, onChange }`

3. **AdditionalFilters** - Dynamic filters

   - Restaurant dropdown
   - Service type dropdown
   - Custom filter options
   - Props: `{ options, selected, onChange }`

4. **FilterActions** - Apply/Reset buttons
   - Apply button
   - Reset button
   - Close handler
   - Props: `{ onApply, onReset, onClose, hasChanges }`

#### 2.2 Reuse Existing Components

- ✅ **useFilterState** hook already exists - reuse!
- ✅ Modal shell from existing patterns

**Expected Reduction:** 300 → 80 lines main + 4 components (~50 lines each)

---

## Phase 3: RecommendedItemModal.tsx (350 lines) 🔴 HIGH PRIORITY

### Current State

- Single large modal with multiple item types
- Restaurant details (Google Places data)
- Tour details (Amadeus data)
- Product/amenity/menu item display
- Maps integration, reviews, contact info

### Refactoring Strategy

#### 3.1 Component Breakdown

```
src/pages/Guests/components/shared/RecommendedItemModal/
├── RecommendedItemModal.tsx (main - 100 lines)
├── components/
│   ├── ModalHeader.tsx (40 lines)
│   ├── RestaurantDetails.tsx (80 lines)
│   ├── TourDetails.tsx (60 lines)
│   ├── ProductDetails.tsx (40 lines)
│   └── ContactInfo.tsx (50 lines)
├── utils/
│   └── itemTypeHelpers.ts (30 lines)
└── index.ts
```

**New Components:**

1. **ModalHeader** - Title, close, image

   - Item image display
   - Title and category badge
   - Close button
   - Props: `{ title, imageUrl, category, onClose }`

2. **RestaurantDetails** - Google Places info

   - Rating and reviews
   - Opening hours
   - Contact information
   - Google Maps button
   - Props: `{ restaurant: Restaurant }`

3. **TourDetails** - Amadeus activity info

   - Tour description
   - Pricing information
   - Booking details
   - Props: `{ tour: AmadeusActivity }`

4. **ProductDetails** - Hotel product/amenity

   - Price and availability
   - Description
   - Stock information
   - Props: `{ item: RecommendedItem }`

5. **ContactInfo** - Reusable contact display
   - Phone, website, address
   - Map integration
   - Social links
   - Props: `{ phone, website, address, placeId }`

#### 3.2 Extract Type Guards

```typescript
// utils/itemTypeHelpers.ts
export const isRestaurant = (item) => item.type === 'restaurant'
export const isTour = (item) => item.type === 'tour'
export const getCategoryStyle = (type) => { ... }
```

**Expected Reduction:** 350 → 100 lines main + 5 components (~50 lines each)

---

## Phase 4: ApprovedThirdPartySection.tsx (350 lines) 🔴 HIGH PRIORITY

### Current State

- Fetches approved restaurants and tours
- Multiple API integrations (Google Places, Amadeus)
- Complex filtering logic
- Modal state management
- Horizontal scrolling carousel

### Refactoring Strategy

#### 4.1 Component Breakdown

```
src/pages/Guests/pages/Home/components/ApprovedThirdPartySection/
├── ApprovedThirdPartySection.tsx (main - 80 lines)
├── components/
│   ├── SectionCarousel.tsx (60 lines) ⬅️ Reusable!
│   ├── RestaurantCard.tsx (50 lines)
│   └── TourCard.tsx (50 lines)
├── hooks/
│   ├── useApprovedRestaurants.ts (60 lines)
│   ├── useApprovedTours.ts (60 lines)
│   └── useItemModal.ts (30 lines) ⬅️ Already exists!
└── index.ts
```

**New Components:**

1. **SectionCarousel** - Reusable horizontal scroll

   - Auto-scroll functionality
   - Manual scroll support
   - Loading states
   - Props: `{ items, renderItem, isLoading, title }`
   - ✅ **Can be reused in:** RecommendedSection, DineInMenuSection

2. **RestaurantCard** - Restaurant display card

   - Restaurant info display
   - Rating display
   - Click handler
   - Props: `{ restaurant, onClick }`

3. **TourCard** - Tour display card
   - Tour info display
   - Price display
   - Click handler
   - Props: `{ tour, onClick }`

**New Hooks:**

1. **useApprovedRestaurants** - Restaurant data

   - Fetch approved places from DB
   - Fetch Google Places details
   - Filter and match logic
   - Returns: `{ restaurants, isLoading, error }`

2. **useApprovedTours** - Tour data
   - Fetch approved activities
   - Fetch Amadeus details
   - Filter and match logic
   - Returns: `{ tours, isLoading, error }`

#### 4.2 Reuse Existing Components

- ✅ **useItemModal** hook - already exists
- ✅ **RecommendedItemModal** - reuse for displaying items
- ✅ **ExperienceCard** - potentially reusable

**Expected Reduction:** 350 → 80 lines main + 3 components + 2 hooks

---

## Phase 5: PhotoGallerySection.tsx (250 lines) 🟡 MEDIUM PRIORITY

### Current State

- Hotel photos display
- Lightbox/modal for fullscreen view
- Image grid layout
- Category filtering

### Refactoring Strategy

#### 5.1 Component Breakdown

```
src/pages/Guests/pages/Home/components/PhotoGallerySection/
├── PhotoGallerySection.tsx (main - 60 lines)
├── components/
│   ├── PhotoGrid.tsx (50 lines)
│   ├── PhotoLightbox.tsx (70 lines)
│   └── PhotoThumbnail.tsx (30 lines)
├── hooks/
│   └── usePhotoGallery.ts (40 lines)
└── index.ts
```

**New Components:**

1. **PhotoGrid** - Grid layout

   - Responsive grid
   - Category filtering UI
   - Click handlers
   - Props: `{ photos, onPhotoClick, columns }`

2. **PhotoLightbox** - Fullscreen viewer

   - Image navigation (prev/next)
   - Close button
   - Swipe support
   - Props: `{ photos, currentIndex, isOpen, onClose }`

3. **PhotoThumbnail** - Individual thumbnail
   - Lazy loading
   - Hover effects
   - Aspect ratio handling
   - Props: `{ photo, onClick, size }`

**New Hook:**

1. **usePhotoGallery** - Gallery state
   - Current photo index
   - Lightbox open/close
   - Navigation methods
   - Returns: `{ currentPhoto, next, prev, open, close }`

**Expected Reduction:** 250 → 60 lines main + 3 components + 1 hook

---

## Phase 6: ExperienceCard.tsx (200 lines) 🟢 LOW PRIORITY

### Current State

- Displays restaurant or tour card
- Image, title, rating, price
- Click handler
- Styling variations

### Refactoring Strategy

#### 6.1 Component Breakdown

```
src/pages/Guests/components/ExperienceCard/
├── ExperienceCard.tsx (main - 80 lines)
├── components/
│   ├── CardImage.tsx (40 lines) ⬅️ Reusable!
│   ├── CardContent.tsx (50 lines)
│   └── CardRating.tsx (30 lines) ⬅️ Reusable!
└── index.ts
```

**New Components:**

1. **CardImage** - Image display

   - Lazy loading
   - Fallback image
   - Aspect ratio
   - Props: `{ src, alt, fallback }`
   - ✅ **Can be reused in:** All card components

2. **CardContent** - Text content

   - Title, description
   - Price display
   - Category badge
   - Props: `{ title, description, price, category }`

3. **CardRating** - Rating display
   - Stars or numeric rating
   - Review count
   - Props: `{ rating, reviewCount }`
   - ✅ **Can be reused in:** RestaurantCard, TourCard

**Expected Reduction:** 200 → 80 lines main + 3 small components

---

## Phase 7: GuestDashboard.tsx (200 lines) 🟡 MEDIUM PRIORITY

### Current State

- Main guest dashboard orchestration
- Tab navigation
- Session management
- DND status handling

### Refactoring Strategy

#### 7.1 Component Breakdown

```
src/pages/Guests/
├── GuestDashboard.tsx (main - 100 lines)
├── hooks/
│   ├── useGuestSession.ts (40 lines)
│   ├── useDNDStatus.ts (30 lines)
│   └── useTabNavigation.ts (30 lines)
└── utils/
    └── sessionHelpers.ts (20 lines)
```

**New Hooks:**

1. **useGuestSession** - Session management

   - Load session from storage
   - Session validation
   - Hotel data extraction
   - Returns: `{ session, guestData, hotelData, isLoading }`

2. **useDNDStatus** - Do Not Disturb

   - Current DND state
   - Toggle DND
   - Update database
   - Returns: `{ isDndActive, toggleDnd, isUpdating }`

3. **useTabNavigation** - Tab state
   - Active tab
   - Tab change handler
   - Tab history
   - Returns: `{ activeTab, setActiveTab, goBack }`

**Expected Reduction:** 200 → 100 lines main + 3 hooks

---

## Phase 8: FilterableListPage.tsx (250 lines) ✅ ALREADY GOOD

### Current State

- Already well-structured
- Generic and reusable
- Some opportunities for minor improvements

### Minor Improvements

1. Extract search/filter logic to custom hook
2. Create sub-components for header sections
3. Add JSDoc documentation

**No major refactoring needed - already follows best practices!**

---

## Reusable Components Library 📚

### Components That Can Be Extracted and Reused

#### 1. **SectionCarousel** (NEW)

Use in:

- ApprovedThirdPartySection
- RecommendedSection
- DineInMenuSection
- PhotoGallerySection

#### 2. **CardImage** (NEW)

Use in:

- ExperienceCard
- MenuItemCard
- ProductCard
- RestaurantCard
- TourCard

#### 3. **CardRating** (NEW)

Use in:

- RestaurantCard
- TourCard
- ReviewDisplay

#### 4. **ContactInfo** (NEW)

Use in:

- RecommendedItemModal
- RestaurantDetails
- EmergencyContactsSection

#### 5. **Modal Shell** (Extract from existing)

Use in:

- RecommendedItemModal
- FilterModal
- PhotoLightbox
- RequestHistoryModal

### Existing Components to Reuse

✅ **Already Available:**

- EmptyState (ui/)
- LoadingSkeleton (ui/)
- CategoryHeader (ui/)
- useFilterState (hooks/)
- useItemModal (hooks/)
- useGuestHotelId (hooks/)

---

## Proposed Folder Structure 📁

```
src/pages/Guests/
├── GuestDashboard.tsx (100 lines - orchestration)
│
├── components/
│   ├── common/                    # Shared across guest pages
│   │   ├── FilterModal/
│   │   │   ├── FilterModal.tsx
│   │   │   ├── components/
│   │   │   └── index.ts
│   │   ├── SearchBar/
│   │   ├── SectionCarousel/      # NEW - Reusable carousel
│   │   │   ├── SectionCarousel.tsx
│   │   │   └── index.ts
│   │   ├── CardImage/             # NEW - Reusable image
│   │   ├── CardRating/            # NEW - Reusable rating
│   │   └── ContactInfo/           # NEW - Contact display
│   │
│   ├── shared/                    # Complex shared components
│   │   ├── GuestLayout.tsx
│   │   ├── GuestHeader.tsx
│   │   ├── FloatingWidget.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── RequestHistoryModal.tsx
│   │   └── RecommendedItemModal/  # Refactored
│   │       ├── RecommendedItemModal.tsx
│   │       ├── components/
│   │       ├── utils/
│   │       └── index.ts
│   │
│   ├── ui/                        # Basic UI components
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── CategoryHeader.tsx
│   │   └── index.ts
│   │
│   ├── ExperienceCard/            # Refactored
│   │   ├── ExperienceCard.tsx
│   │   ├── components/
│   │   └── index.ts
│   │
│   ├── MenuItemCard/
│   ├── FilterableListPage/        # Already good
│   │
│   └── Chat/                      # Refactored
│       ├── ChatModal.tsx
│       ├── hooks/
│       │   ├── useGuestChat.ts
│       │   ├── useStaffAssignment.ts
│       │   ├── useConversationSetup.ts
│       │   ├── useMessageSubscription.ts
│       │   └── index.ts
│       ├── utils/
│       └── index.ts
│
├── pages/
│   ├── Home/
│   │   ├── HomePage.tsx
│   │   └── components/
│   │       ├── StayDetailsCard.tsx
│   │       ├── CategoryMenu.tsx
│   │       ├── QuickAccessSection.tsx
│   │       ├── EmergencyContactsSection.tsx
│   │       │
│   │       ├── RecommendedSection/
│   │       │   ├── index.tsx
│   │       │   └── RecommendedItemCard.tsx
│   │       │
│   │       ├── ApprovedThirdPartySection/  # Refactored
│   │       │   ├── ApprovedThirdPartySection.tsx
│   │       │   ├── components/
│   │       │   │   ├── RestaurantCard.tsx
│   │       │   │   └── TourCard.tsx
│   │       │   ├── hooks/
│   │       │   └── index.ts
│   │       │
│   │       ├── PhotoGallerySection/        # Refactored
│   │       │   ├── PhotoGallerySection.tsx
│   │       │   ├── components/
│   │       │   ├── hooks/
│   │       │   └── index.ts
│   │       │
│   │       ├── DineInMenuSection.tsx
│   │       └── AboutUsSection.tsx
│   │
│   ├── QA/                        # ✅ Already refactored
│   │   ├── QAPage.tsx
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── Shop/                      # ✅ Uses FilterableListPage
│   ├── DineIn/                    # ✅ Uses FilterableListPage
│   └── Services/                  # ✅ Uses FilterableListPage
│
└── hooks/                         # Guest-specific hooks
    ├── useGuestSession.ts         # NEW
    ├── useDNDStatus.ts            # NEW
    ├── useTabNavigation.ts        # NEW
    ├── useGuestHotelId.ts         # ✅ Exists
    ├── useItemModal.ts            # ✅ Exists
    └── useFilterState.ts          # ✅ Exists
```

---

## Implementation Roadmap 🗺️

### Week 1: High-Priority Large Files

**Days 1-2:** useGuestChat.ts (304 lines)

- Extract 4 hooks
- Create utility files
- Test chat functionality

**Days 3-4:** RecommendedItemModal.tsx (350 lines)

- Extract 5 components
- Create type guards
- Test all item types

**Day 5:** ApprovedThirdPartySection.tsx (Part 1)

- Extract hooks
- Create SectionCarousel (reusable)

### Week 2: Medium-Priority Files

**Days 1-2:** ApprovedThirdPartySection.tsx (Part 2)

- Extract card components
- Integration testing

**Days 3-4:** FilterModal.tsx (300 lines)

- Extract 4 components
- Reuse useFilterState hook

**Day 5:** PhotoGallerySection.tsx (250 lines)

- Extract 3 components
- Create lightbox component

### Week 3: Low-Priority & Polish

**Days 1-2:** ExperienceCard.tsx (200 lines)

- Extract CardImage, CardRating (reusable!)
- Update all card components to use new shared components

**Days 3-4:** GuestDashboard.tsx (200 lines)

- Extract 3 hooks
- Clean up orchestration

**Day 5:** Documentation & Testing

- Update all documentation
- Integration testing
- Performance optimization

---

## Benefits Summary 📊

### Code Reduction

| File                      | Before    | After   | Reduction |
| ------------------------- | --------- | ------- | --------- |
| useGuestChat              | 304       | 80      | 74%       |
| FilterModal               | 300       | 80      | 73%       |
| RecommendedItemModal      | 350       | 100     | 71%       |
| ApprovedThirdPartySection | 350       | 80      | 77%       |
| PhotoGallerySection       | 250       | 60      | 76%       |
| ExperienceCard            | 200       | 80      | 60%       |
| GuestDashboard            | 200       | 100     | 50%       |
| **TOTAL**                 | **1,954** | **580** | **70%**   |

### New Reusable Components

- SectionCarousel (4+ uses)
- CardImage (6+ uses)
- CardRating (3+ uses)
- ContactInfo (3+ uses)
- Modal Shell (5+ uses)

### Improved Code Quality

- ✅ Single Responsibility Principle
- ✅ DRY (Don't Repeat Yourself)
- ✅ Easy to test
- ✅ Easy to maintain
- ✅ Type-safe
- ✅ Reusable patterns

---

## Testing Strategy 🧪

### Unit Tests

- Each extracted component
- Each custom hook
- Utility functions

### Integration Tests

- RecommendedItemModal with different item types
- FilterModal with various filter combinations
- Chat system end-to-end

### Visual Regression Tests

- Card components
- Modal components
- Gallery components

---

## Risk Mitigation ⚠️

### Potential Risks

1. **Breaking existing functionality**
   - Mitigation: Refactor one file at a time, test thoroughly
2. **Type errors during refactoring**
   - Mitigation: Use TypeScript strict mode, test after each change
3. **Performance degradation**
   - Mitigation: Use React.memo, useMemo, useCallback appropriately
4. **Import path changes**
   - Mitigation: Use barrel exports, update imports systematically

---

## Success Metrics 📈

### Quantitative

- [ ] 70% reduction in main file sizes
- [ ] 15+ reusable components created
- [ ] 0 TypeScript errors
- [ ] 100% test coverage for new components
- [ ] <100ms render time for modals

### Qualitative

- [ ] Easier to understand code structure
- [ ] Faster to locate and fix bugs
- [ ] Easier to add new features
- [ ] Improved developer experience
- [ ] Better code documentation

---

## Conclusion

This refactoring plan will transform **~2,200 lines** of monolithic code into a **modular, maintainable, and reusable component library**. The estimated reduction of **70%** in main file sizes, combined with **15+ reusable components**, will significantly improve code quality and developer productivity.

**Ready to start with Phase 1: useGuestChat.ts! 🚀**
