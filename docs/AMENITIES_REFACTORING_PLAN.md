# Amenities Page Refactoring Plan

## Current Structure Analysis

```
src/pages/Hotel/
├── AmenitiesPage.tsx (340 lines - MAIN FILE)
├── components/
│   └── amenities/
│       ├── amenities/
│       │   ├── AmenitiesDataView.tsx
│       │   ├── AmenityColumns.tsx
│       │   ├── AmenityDetail.tsx
│       │   └── AmenityFormFields.tsx
│       ├── requests/
│       │   ├── AmenityRequestColumns.tsx
│       │   ├── AmenityRequestDetail.tsx
│       │   ├── AmenityRequestFormFields.tsx
│       │   └── AmenityRequestsDataView.tsx
│       └── index.ts (re-exports)
└── hooks/
    ├── useAmenityCRUD.tsx
    └── useAmenityRequestCRUD.tsx
```

## Refactoring Opportunities

### 1. **Extract Loading & Error States**

**Current:** Inline JSX in main page (lines 105-118)
**Proposed:** Create reusable components

```
components/amenities/shared/
├── LoadingState.tsx
└── ErrorState.tsx
```

### 2. **Extract Tab Content Components**

**Current:** Large inline JSX blocks (lines 200-265, 267-332)
**Proposed:** Separate tab components

```
components/amenities/tabs/
├── AmenitiesTab.tsx (manages amenities list + CRUD)
└── RequestsTab.tsx (manages requests list + CRUD)
```

### 3. **Extract Page Logic Hook**

**Current:** All logic in main component (lines 37-175)
**Proposed:** Custom hook for page orchestration

```
hooks/amenities/
└── useAmenitiesPageLogic.tsx
```

### 4. **Extract Subscription Logic**

**Current:** Subscription config inline (lines 76-96)
**Proposed:** Custom hook for real-time subscriptions

```
hooks/amenities/
└── useAmenitiesSubscriptions.tsx
```

### 5. **Extract Tab Configuration**

**Current:** Tab config inline in main component (lines 334-348)
**Proposed:** Separate configuration file

```
components/amenities/config/
└── tabsConfig.tsx
```

## Proposed New Structure

```
src/pages/Hotel/
├── AmenitiesPage.tsx (50 lines - clean entry point)
├── components/
│   └── amenities/
│       ├── amenities/          (existing - untouched)
│       ├── requests/            (existing - untouched)
│       ├── tabs/                (NEW)
│       │   ├── AmenitiesTab.tsx
│       │   ├── RequestsTab.tsx
│       │   └── index.ts
│       ├── shared/              (NEW)
│       │   ├── LoadingState.tsx
│       │   ├── ErrorState.tsx
│       │   └── index.ts
│       ├── config/              (NEW)
│       │   ├── tabsConfig.tsx
│       │   └── index.ts
│       └── index.ts (updated re-exports)
└── hooks/
    ├── amenities/               (NEW folder)
    │   ├── useAmenitiesPageLogic.tsx
    │   ├── useAmenitiesSubscriptions.tsx
    │   └── index.ts
    ├── useAmenityCRUD.tsx      (existing - untouched)
    └── useAmenityRequestCRUD.tsx (existing - untouched)
```

## Benefits

1. ✅ **Separation of Concerns**: Each component has single responsibility
2. ✅ **Reusability**: LoadingState and ErrorState can be used elsewhere
3. ✅ **Testability**: Smaller units easier to test
4. ✅ **Maintainability**: Easier to find and modify specific functionality
5. ✅ **Readability**: Main page becomes declarative, easy to understand
6. ✅ **Co-location**: Related code lives together

## Migration Strategy

### Phase 1: Extract Shared Components (No Breaking Changes)

- Create LoadingState component
- Create ErrorState component
- Update AmenitiesPage to use them

### Phase 2: Extract Tab Components (Logical Grouping)

- Create AmenitiesTab component
- Create RequestsTab component
- Update AmenitiesPage to use them

### Phase 3: Extract Hooks (Logic Separation)

- Create useAmenitiesSubscriptions hook
- Create useAmenitiesPageLogic hook
- Update AmenitiesPage to use them

### Phase 4: Extract Configuration (Data Separation)

- Create tabsConfig
- Final cleanup of AmenitiesPage

## Expected Final Result

**AmenitiesPage.tsx** - Clean, declarative, easy to understand:

```tsx
export const AmenitiesPage = () => {
  const { isLoading, hasError, hotelId, hotelStaff, amenityData, requestData } =
    useAmenitiesPageLogic();

  if (isLoading) return <LoadingState />;
  if (hasError || !hotelId || !hotelStaff) return <ErrorState />;

  return (
    <TabPage
      title="Amenities"
      tabs={getAmenitiesTabs(amenityData, requestData)}
      defaultTab="amenities"
    />
  );
};
```

## Import Path Changes

All imports will use relative paths from the page:

- `./components/amenities/shared/LoadingState`
- `./components/amenities/tabs/AmenitiesTab`
- `./hooks/amenities/useAmenitiesPageLogic`

No breaking changes to existing components or hooks.
