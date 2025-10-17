# ShopPage Refactoring Plan

## Identified Reusable Patterns

### 1. **Loading Skeleton** (Lines 133-150)

**Pattern**: Empty search bar + 5 skeleton cards
**Used in**: Shop, DineIn, Services (identical code)
**Extract to**: `components/ui/PageLoadingSkeleton.tsx`

### 2. **Empty State** (Lines 152-169)

**Pattern**: Search bar + centered emoji + message
**Used in**: Shop, DineIn, Services (same structure, different emoji/text)
**Extract to**: `components/ui/PageEmptyState.tsx`

### 3. **Category Header** (Lines 212-220)

**Pattern**: Category title + count badge
**Used in**: Shop, DineIn, Services (identical)
**Extract to**: `components/ui/CategoryHeader.tsx`

### 4. **Hotel ID Logic** (Lines 45-46)

**Pattern**: `getGuestSession()` → extract hotelId
**Used in**: ALL guest pages
**Extract to**: `hooks/useGuestHotelId.ts`

### 5. **Modal State Management** (Lines 39-41, 109-119, 130-133)

**Pattern**: selectedItem + isModalOpen + open/close handlers
**Used in**: Shop, DineIn, Services (identical)
**Extract to**: `hooks/useItemModal.ts`

### 6. **Filter State Management** (Lines 28-35, 61-67, 107-109)

**Pattern**: filters state + isFilterModalOpen + handlers
**Used in**: Shop, DineIn, Services (similar)
**Extract to**: `hooks/useFilterState.ts`

## Proposed Folder Structure

```
src/pages/Guests/
├── components/
│   ├── ui/                          # NEW: Presentational UI components
│   │   ├── PageLoadingSkeleton.tsx  # Loading state for list pages
│   │   ├── PageEmptyState.tsx       # Empty state for list pages
│   │   ├── CategoryHeader.tsx       # Category title + count badge
│   │   └── index.ts                 # Barrel export
│   ├── common/                      # EXISTING: SearchBar, FilterModal
│   ├── MenuItemCard/                # EXISTING: Keep as is
│   └── shared/                      # EXISTING: Layout components
├── hooks/                           # NEW: Custom hooks
│   ├── useGuestHotelId.ts          # Extract hotelId from session
│   ├── useItemModal.ts             # Modal state management
│   ├── useFilterState.ts           # Filter state management
│   └── index.ts                     # Barrel export
└── pages/
    ├── Shop/
    ├── DineIn/
    └── Services/
```

## Refactoring Steps (Safe & Incremental)

### Phase 1: Create Reusable Components ✅

1. Create `components/ui/CategoryHeader.tsx`
2. Create `components/ui/PageLoadingSkeleton.tsx`
3. Create `components/ui/PageEmptyState.tsx`
4. Create `components/ui/index.ts`

### Phase 2: Create Custom Hooks ✅

5. Create `hooks/useGuestHotelId.ts`
6. Create `hooks/useItemModal.ts`
7. Create `hooks/useFilterState.ts`
8. Create `hooks/index.ts`

### Phase 3: Refactor ShopPage (One change at a time)

9. Replace category header JSX with `<CategoryHeader />`
10. Replace loading skeleton with `<PageLoadingSkeleton />`
11. Replace empty state with `<PageEmptyState />`
12. Replace `getGuestSession()` with `useGuestHotelId()`
13. Replace modal state with `useItemModal()`
14. Replace filter state with `useFilterState()`

### Phase 4: Test ShopPage

15. Verify all functionality works
16. Check filters, search, modals, cart

### Phase 5: Apply to DineIn & Services

17. Repeat Phase 3 for DineInPage
18. Repeat Phase 3 for ServicesPage

## Code Reduction Expected

- **~40-50 lines removed per page**
- **3 pages = ~120-150 lines total**
- **Better maintainability**
- **Consistent UX across pages**

## Risk Level

- ✅ LOW RISK: UI components (CategoryHeader, skeletons, empty states)
- ⚠️ MEDIUM RISK: Custom hooks (need careful state management)
- ✅ SAFE APPROACH: One small change at a time, test after each
