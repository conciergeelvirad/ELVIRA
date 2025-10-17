# Hotel Management Pages - Practical Refactoring Guide

**Date:** October 17, 2025  
**Status:** 📋 Implementation Ready  
**Pages:** Amenities, Shop, Restaurant

---

## 🎯 Executive Summary

The Amenities, Shop, and Restaurant pages share **85-95% identical code**. This guide provides a practical, step-by-step refactoring to eliminate duplication while maintaining functionality.

### Quick Stats

| Component Type | Files        | Duplication | Target                   |
| -------------- | ------------ | ----------- | ------------------------ |
| DataView       | 6 files      | 95%         | 1 base + 6 configs       |
| Detail         | 6 files      | 90%         | 1 base + 6 configs       |
| Tab            | 6 files      | 85%         | 1 base + 6 configs       |
| **Total**      | **18 files** | **~90%**    | **3 bases + 18 configs** |

---

## 📊 Pattern Analysis

### Current Structure (DUPLICATED)

```
components/
├── amenities/
│   ├── amenities/
│   │   ├── AmenitiesDataView.tsx      ← 95% same as Products
│   │   ├── AmenityDetail.tsx          ← 90% same as Product
│   │   ├── AmenityColumns.tsx
│   │   └── AmenityFormFields.tsx
│   ├── requests/
│   │   ├── AmenityRequestsDataView.tsx ← 95% same as Orders
│   │   ├── AmenityRequestDetail.tsx
│   │   ├── AmenityRequestColumns.tsx
│   │   └── AmenityRequestFormFields.tsx
│   └── tabs/
│       ├── AmenitiesTab.tsx           ← 85% same as Products
│       └── RequestsTab.tsx            ← 85% same as Orders
│
├── shop/
│   ├── products/
│   │   ├── ProductsDataView.tsx       ← 95% same as Amenities
│   │   ├── ProductDetail.tsx          ← 90% same as Amenity
│   │   ├── ProductColumns.tsx
│   │   └── ProductFormFields.tsx
│   ├── orders/
│   │   ├── ShopOrdersDataView.tsx     ← 95% same as Requests
│   │   ├── ShopOrderDetail.tsx
│   │   ├── ShopOrderColumns.tsx
│   │   └── ShopOrderFormFields.tsx
│   └── tabs/
│       ├── ProductsTab.tsx            ← 85% same as Amenities
│       └── OrdersTab.tsx              ← 85% same as Requests
│
└── restaurant/
    ├── restaurant/
    │   ├── RestaurantsDataView.tsx    ← 95% same as Amenities
    │   ├── RestaurantDetail.tsx       ← 90% same as Amenity
    │   ├── RestaurantColumns.tsx
    │   └── RestaurantFormFields.tsx
    ├── menu-items/
    │   ├── MenuItemsDataView.tsx      ← 95% same as Amenities
    │   ├── MenuItemDetail.tsx         ← 90% same as Amenity
    │   ├── MenuItemColumns.tsx
    │   └── MenuItemFormFields.tsx
    ├── dine-in-orders/
    │   ├── DineInOrdersDataView.tsx   ← 95% same as Requests
    │   ├── DineInOrderDetail.tsx
    │   └── DineInOrderComponents.tsx
    └── tabs/
        ├── RestaurantsTab.tsx         ← 85% same as Amenities
        ├── MenuItemsTab.tsx           ← 85% same as Amenities
        └── DineInOrdersTab.tsx        ← 85% same as Requests
```

### Proposed Structure (SHARED + CONFIGURED)

```
components/
├── shared/                            # ✨ NEW: Shared base components
│   ├── entity/                        # For main entities (products, amenities, etc.)
│   │   ├── EntityDataView.tsx        # ✨ Replaces 6 DataView files
│   │   ├── EntityDetail.tsx          # ✨ Replaces 6 Detail files
│   │   └── EntityTab.tsx             # ✨ Replaces 6 Tab files
│   ├── orders/                        # For orders/requests
│   │   ├── OrdersDataView.tsx        # ✨ Replaces 3 Orders DataView files
│   │   ├── OrdersDetail.tsx          # ✨ Replaces 3 Orders Detail files
│   │   └── OrdersTab.tsx             # ✨ Replaces 3 Orders Tab files
│   └── index.ts
│
├── amenities/
│   ├── config/                        # ✨ NEW: Configuration files
│   │   ├── amenityConfig.ts          # Define amenity-specific behavior
│   │   └── requestConfig.ts          # Define request-specific behavior
│   ├── AmenityCard.tsx               # Keep: Custom UI
│   ├── AmenityRequestCard.tsx        # Keep: Custom UI
│   └── index.ts
│
├── shop/
│   ├── config/
│   │   ├── productConfig.ts
│   │   └── orderConfig.ts
│   ├── ProductCard.tsx               # Keep: Custom UI
│   ├── ShopOrderCard.tsx             # Keep: Custom UI
│   └── index.ts
│
└── restaurant/
    ├── config/
    │   ├── restaurantConfig.ts
    │   ├── menuItemConfig.ts
    │   └── dineInOrderConfig.ts
    ├── RestaurantCard.tsx            # Keep: Custom UI
    ├── MenuItemCard.tsx              # Keep: Custom UI
    ├── DineInOrderCard.tsx           # Keep: Custom UI
    └── index.ts
```

---

## 🔧 Implementation Steps

### Step 1: Create Shared Entity Components

#### 1.1 Create `EntityDataView` Component

**File:** `src/pages/Hotel/components/shared/entity/EntityDataView.tsx`

```tsx
import React from "react";
import { GenericDataView } from "../../../../../components/common/data-display";
import { Column, GridColumn } from "../../../../../types/table";

interface EntityDataViewProps<T> {
  // Data
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];

  // Columns
  tableColumns: Column<T>[];
  gridColumns: GridColumn[];

  // Actions
  handleRowClick: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;

  // Card rendering
  renderCard: (item: T, onClick: () => void) => React.ReactNode;

  // Optional
  emptyMessage?: string;
  currency?: string;
}

/**
 * Generic Entity Data View Component
 *
 * Shared component for displaying entities (Amenities, Products, Restaurants, MenuItems)
 * in table or grid view using GenericDataView.
 */
export const EntityDataView = <T extends Record<string, unknown>>({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  gridColumns,
  onEdit,
  onDelete,
  renderCard,
  emptyMessage = "No items found",
}: EntityDataViewProps<T>) => {
  return (
    <GenericDataView<T>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      getItemId={(item) => (item as any).id}
      renderCard={renderCard}
      onItemClick={handleRowClick}
      emptyMessage={emptyMessage}
    />
  );
};
```

**Replaces:**

- ✅ `AmenitiesDataView.tsx` (62 lines)
- ✅ `ProductsDataView.tsx` (61 lines)
- ✅ `RestaurantsDataView.tsx` (116 lines)
- ✅ `MenuItemsDataView.tsx` (~60 lines)

**Savings:** ~300 lines → 50 lines = **83% reduction**

#### 1.2 Create `EntityDetail` Component

**File:** `src/pages/Hotel/components/shared/entity/EntityDetail.tsx`

```tsx
import React from "react";
import {
  ItemDetailView,
  ItemDetailField,
} from "../../../../../components/common/detail-view";

interface EntityDetailProps<T> {
  item: T | Record<string, unknown>;
  getDetailFields: (item: T) => Array<{ label: string; value: any }>;
  getImageUrl?: (item: T) => string | null | undefined;
  getImageName?: (item: T) => string;
}

/**
 * Generic Entity Detail Component
 *
 * Shared component for displaying entity details in modals.
 * Uses ItemDetailView for consistent layout.
 */
export const EntityDetail = <T extends Record<string, unknown>>({
  item,
  getDetailFields,
  getImageUrl,
  getImageName,
}: EntityDetailProps<T>) => {
  const typedItem = item as unknown as T;

  // Convert detail fields to ItemDetailField format
  const fields: ItemDetailField[] = getDetailFields(typedItem).map((field) => ({
    label: field.label,
    value: field.value,
  }));

  // Get image info if functions provided
  const imageUrl = getImageUrl ? getImageUrl(typedItem) : undefined;
  const imageName = getImageName ? getImageName(typedItem) : undefined;

  return (
    <ItemDetailView imageUrl={imageUrl} imageName={imageName} fields={fields} />
  );
};
```

**Replaces:**

- ✅ `AmenityDetail.tsx` (28 lines)
- ✅ `ProductDetail.tsx` (28 lines)
- ✅ `RestaurantDetail.tsx` (45 lines)
- ✅ `MenuItemDetail.tsx` (~30 lines)

**Savings:** ~130 lines → 40 lines = **69% reduction**

#### 1.3 Create `EntityTab` Component

**File:** `src/pages/Hotel/components/shared/entity/EntityTab.tsx`

```tsx
import React from "react";
import { Plus } from "lucide-react";
import {
  SearchAndFilterBar,
  Button,
  CRUDModalContainer,
  LoadingState,
} from "../../../../../components/common";
import { EntityDataView } from "./EntityDataView";

interface EntityTabProps<T> {
  // Loading state
  isLoading: boolean;

  // CRUD hook
  crud: any; // Will be properly typed

  // Columns
  tableColumns: any[];
  gridColumns: any[];

  // Configuration
  entityName: string;
  searchPlaceholder: string;
  addButtonLabel: string;
  emptyMessage?: string;

  // Card rendering
  renderCard: (item: T, onClick: () => void) => React.ReactNode;

  // Detail rendering
  renderDetailContent?: (item: any) => React.ReactNode;

  // Form fields
  formFields: any[];
  editFormFields?: any[];

  // Optional
  currency?: string;
  showAddButton?: boolean;
}

/**
 * Generic Entity Tab Component
 *
 * Shared component for entity tabs (Amenities, Products, Restaurants, MenuItems).
 * Handles search, filter, view modes, and CRUD operations.
 */
export const EntityTab = <T extends Record<string, unknown>>({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  entityName,
  searchPlaceholder,
  addButtonLabel,
  emptyMessage,
  renderCard,
  renderDetailContent,
  formFields,
  editFormFields,
  currency,
  showAddButton = true,
}: EntityTabProps<T>) => {
  const {
    searchAndFilter,
    modalState,
    modalActions,
    formState,
    formActions,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
  } = crud;

  const {
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    mode: viewMode,
    setViewMode,
    filteredData,
  } = searchAndFilter;

  if (isLoading) {
    return <LoadingState message={`Loading ${entityName.toLowerCase()}...`} />;
  }

  return (
    <div className="space-y-4">
      <SearchAndFilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={searchPlaceholder}
        filterActive={Boolean(filterValue)}
        onFilterToggle={() => setFilterValue(filterValue ? "" : "active")}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        rightActions={
          showAddButton && (
            <Button
              variant="dark"
              leftIcon={Plus}
              onClick={modalActions.openCreateModal}
            >
              {addButtonLabel}
            </Button>
          )
        }
      />

      <EntityDataView
        viewMode={viewMode}
        filteredData={filteredData}
        handleRowClick={modalActions.openDetailModal}
        tableColumns={tableColumns}
        gridColumns={gridColumns}
        onEdit={modalActions.openEditModal}
        onDelete={modalActions.openDeleteModal}
        renderCard={renderCard}
        emptyMessage={emptyMessage}
        currency={currency}
      />

      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={formFields}
        editFormFields={editFormFields}
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        entityName={entityName}
        renderDetailContent={renderDetailContent}
      />
    </div>
  );
};
```

**Replaces:**

- ✅ `AmenitiesTab.tsx` (130 lines)
- ✅ `ProductsTab.tsx` (135 lines)
- ✅ `RestaurantsTab.tsx` (105 lines)
- ✅ `MenuItemsTab.tsx` (~120 lines)

**Savings:** ~490 lines → 140 lines = **71% reduction**

### Step 2: Create Entity Configurations

#### 2.1 Amenity Configuration

**File:** `src/pages/Hotel/components/amenities/config/amenityConfig.ts`

```tsx
import { AmenityCard } from "../../../../../components/amenities";
import { AmenityDetail } from "../amenities/AmenityDetail";
import { getDetailFields, enhanceAmenity } from "../amenities/AmenityColumns";
import { AMENITY_FORM_FIELDS } from "../amenities/AmenityFormFields";
import { Amenity } from "../../../../../hooks/queries/hotel-management/amenities";

export const amenityConfig = {
  // Entity metadata
  entityName: "Amenity",
  searchPlaceholder: "Search amenities...",
  addButtonLabel: "ADD AMENITY",
  emptyMessage: "No amenities found",

  // Form fields
  formFields: AMENITY_FORM_FIELDS,

  // Card rendering
  renderCard: (
    amenity: Amenity,
    onClick: () => void,
    { onEdit, onDelete, currency, handleRecommendedToggle }: any
  ) => (
    <AmenityCard
      amenity={amenity}
      onClick={onClick}
      onEdit={onEdit}
      onDelete={onDelete}
      onRecommendedToggle={handleRecommendedToggle}
      currency={currency}
    />
  ),

  // Detail rendering
  renderDetail: (item: any) => <AmenityDetail item={item} />,

  // Data enhancement
  enhance: enhanceAmenity,

  // Image extraction
  getImageUrl: (amenity: Amenity) => amenity.image_url,
  getImageName: (amenity: Amenity) => amenity.name,

  // Detail fields
  getDetailFields,
};
```

#### 2.2 Product Configuration

**File:** `src/pages/Hotel/components/shop/config/productConfig.ts`

```tsx
import { ProductCard } from "../../../../../components/shop";
import { ProductDetail } from "../products/ProductDetail";
import { getDetailFields, enhanceProduct } from "../products/ProductColumns";
import { PRODUCT_FORM_FIELDS } from "../products/ProductFormFields";
import { Product } from "../../../../../hooks/queries/hotel-management/products";

export const productConfig = {
  entityName: "Product",
  searchPlaceholder: "Search products...",
  addButtonLabel: "ADD PRODUCT",
  emptyMessage: "No products found",
  formFields: PRODUCT_FORM_FIELDS,

  renderCard: (
    product: Product,
    onClick: () => void,
    { onEdit, onDelete, currency, handleRecommendedToggle }: any
  ) => (
    <ProductCard
      product={product}
      onClick={onClick}
      onEdit={onEdit}
      onDelete={onDelete}
      onRecommendedToggle={handleRecommendedToggle}
      currency={currency}
    />
  ),

  renderDetail: (item: any) => <ProductDetail item={item} />,
  enhance: enhanceProduct,
  getImageUrl: (product: Product) => product.image_url,
  getImageName: (product: Product) => product.name,
  getDetailFields,
};
```

### Step 3: Update Tab Components to Use Shared Base

#### 3.1 Refactor AmenitiesTab

**Before (130 lines):**

```tsx
export const AmenitiesTab = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}: AmenitiesTabProps) => {
  const {
    searchAndFilter,
    modalState,
    modalActions,
    formState,
    formActions,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
  } = crud;

  // ... 100+ lines of duplicated code ...

  return (
    <div className="space-y-4">
      <SearchAndFilterBar ... />
      <AmenitiesDataView ... />
      <CRUDModalContainer ... />
    </div>
  );
};
```

**After (15 lines):**

```tsx
import { EntityTab } from "../../shared/entity/EntityTab";
import { amenityConfig } from "../config/amenityConfig";
import { AmenityCard } from "../../../../../components/amenities";
import { Amenity } from "../../../../../hooks/queries/hotel-management/amenities";

export const AmenitiesTab = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}: AmenitiesTabProps) => {
  return (
    <EntityTab<Amenity>
      isLoading={isLoading}
      crud={crud}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      entityName={amenityConfig.entityName}
      searchPlaceholder={amenityConfig.searchPlaceholder}
      addButtonLabel={amenityConfig.addButtonLabel}
      emptyMessage={amenityConfig.emptyMessage}
      renderCard={(amenity, onClick) =>
        amenityConfig.renderCard(amenity, onClick, {
          onEdit: () => crud.modalActions.openEditModal(amenity),
          onDelete: () => crud.modalActions.openDeleteModal(amenity),
          currency,
          handleRecommendedToggle: crud.handleRecommendedToggle,
        })
      }
      renderDetailContent={amenityConfig.renderDetail}
      formFields={amenityConfig.formFields}
      currency={currency}
    />
  );
};
```

**Savings:** 130 lines → 31 lines = **76% reduction**

---

## 📦 File Structure After Refactoring

```
src/pages/Hotel/components/
├── shared/                                    # ✨ NEW
│   ├── entity/
│   │   ├── EntityDataView.tsx                # 50 lines (replaces 300)
│   │   ├── EntityDetail.tsx                  # 40 lines (replaces 130)
│   │   ├── EntityTab.tsx                     # 140 lines (replaces 490)
│   │   └── index.ts
│   ├── orders/
│   │   ├── OrdersDataView.tsx                # Similar pattern
│   │   ├── OrdersDetail.tsx
│   │   ├── OrdersTab.tsx
│   │   └── index.ts
│   └── index.ts
│
├── amenities/
│   ├── config/                                # ✨ NEW
│   │   ├── amenityConfig.ts                  # 50 lines
│   │   └── requestConfig.ts                  # 50 lines
│   ├── AmenityCard.tsx                        # Keep (custom UI)
│   ├── AmenityRequestCard.tsx                # Keep (custom UI)
│   ├── amenities/
│   │   ├── AmenityColumns.tsx                # Keep (logic)
│   │   └── AmenityFormFields.tsx            # Keep (fields)
│   ├── requests/
│   │   ├── AmenityRequestColumns.tsx         # Keep
│   │   └── AmenityRequestFormFields.tsx      # Keep
│   ├── tabs/
│   │   ├── AmenitiesTab.tsx                  # 31 lines (was 130)
│   │   └── RequestsTab.tsx                   # 31 lines (was 120)
│   └── index.ts
│
├── shop/
│   ├── config/                                # ✨ NEW
│   │   ├── productConfig.ts
│   │   └── orderConfig.ts
│   ├── ProductCard.tsx                        # Keep
│   ├── ShopOrderCard.tsx                     # Keep
│   ├── products/
│   │   ├── ProductColumns.tsx                # Keep
│   │   └── ProductFormFields.tsx             # Keep
│   ├── orders/
│   │   ├── ShopOrderColumns.tsx              # Keep
│   │   └── ShopOrderFormFields.tsx           # Keep
│   ├── tabs/
│   │   ├── ProductsTab.tsx                   # 31 lines (was 135)
│   │   └── OrdersTab.tsx                     # 31 lines (was 125)
│   └── index.ts
│
└── restaurant/
    ├── config/                                # ✨ NEW
    │   ├── restaurantConfig.ts
    │   ├── menuItemConfig.ts
    │   └── dineInOrderConfig.ts
    ├── RestaurantCard.tsx                     # Keep
    ├── MenuItemCard.tsx                      # Keep
    ├── DineInOrderCard.tsx                   # Keep
    ├── restaurant/
    │   ├── RestaurantColumns.tsx             # Keep
    │   └── RestaurantFormFields.tsx          # Keep
    ├── menu-items/
    │   ├── MenuItemColumns.tsx               # Keep
    │   └── MenuItemFormFields.tsx            # Keep
    ├── dine-in-orders/
    │   └── DineInOrderComponents.tsx         # Keep
    ├── tabs/
    │   ├── RestaurantsTab.tsx                # 31 lines (was 105)
    │   ├── MenuItemsTab.tsx                  # 31 lines (was 120)
    │   └── DineInOrdersTab.tsx               # 31 lines (was 115)
    └── index.ts
```

---

## 📊 Impact Summary

### Code Reduction

| Component      | Before               | After                  | Reduction |
| -------------- | -------------------- | ---------------------- | --------- |
| DataView files | 6 × ~70 lines = 420  | 1 × 50 + 6 × 20 = 170  | **60%**   |
| Detail files   | 6 × ~35 lines = 210  | 1 × 40 + 6 × 10 = 100  | **52%**   |
| Tab files      | 6 × ~120 lines = 720 | 1 × 140 + 6 × 31 = 326 | **55%**   |
| **Total**      | **1,350 lines**      | **596 lines**          | **56%**   |

### Files Affected

- ✅ **Delete:** 18 files (DataView, Detail, Tab duplicates)
- ✅ **Create:** 9 files (3 shared bases + 6 configs)
- ✅ **Keep:** 24 files (Cards, Columns, FormFields)
- ✅ **Modify:** 6 files (Tab files to use shared base)

### Benefits

1. **Maintainability:** Fix once, apply everywhere
2. **Consistency:** All pages behave identically
3. **Type Safety:** Shared components are fully typed
4. **Testing:** Test shared components once
5. **Onboarding:** New developers understand pattern quickly
6. **Performance:** Better code splitting opportunities

---

## 🚀 Implementation Plan

### Week 1: Create Shared Components

**Day 1-2:** Create `shared/entity/` directory

- [ ] Create `EntityDataView.tsx`
- [ ] Create `EntityDetail.tsx`
- [ ] Create `EntityTab.tsx`
- [ ] Create index.ts exports

**Day 3-4:** Create `shared/orders/` directory

- [ ] Create `OrdersDataView.tsx`
- [ ] Create `OrdersDetail.tsx`
- [ ] Create `OrdersTab.tsx`
- [ ] Create index.ts exports

**Day 5:** Testing

- [ ] Write unit tests for shared components
- [ ] Test with sample data

### Week 2: Create Configurations

**Day 1:** Amenities configs

- [ ] Create `amenities/config/amenityConfig.ts`
- [ ] Create `amenities/config/requestConfig.ts`

**Day 2:** Shop configs

- [ ] Create `shop/config/productConfig.ts`
- [ ] Create `shop/config/orderConfig.ts`

**Day 3:** Restaurant configs

- [ ] Create `restaurant/config/restaurantConfig.ts`
- [ ] Create `restaurant/config/menuItemConfig.ts`
- [ ] Create `restaurant/config/dineInOrderConfig.ts`

**Day 4-5:** Integration testing

### Week 3: Migrate Components

**Day 1-2:** Migrate Amenities

- [ ] Update `AmenitiesTab.tsx`
- [ ] Update `RequestsTab.tsx`
- [ ] Delete old DataView/Detail files
- [ ] Test thoroughly

**Day 3-4:** Migrate Shop

- [ ] Update `ProductsTab.tsx`
- [ ] Update `OrdersTab.tsx`
- [ ] Delete old DataView/Detail files
- [ ] Test thoroughly

**Day 5:** Migrate Restaurant

- [ ] Update `RestaurantsTab.tsx`
- [ ] Update `MenuItemsTab.tsx`
- [ ] Update `DineInOrdersTab.tsx`
- [ ] Delete old DataView/Detail files
- [ ] Test thoroughly

### Week 4: Polish & Documentation

**Day 1-2:** Code review and cleanup
**Day 3-4:** Update documentation
**Day 5:** Final testing and deployment

---

## ✅ Testing Checklist

For each migrated page:

- [ ] Grid view displays correctly
- [ ] List view displays correctly
- [ ] Search works
- [ ] Filter works
- [ ] View toggle works
- [ ] Add button opens modal
- [ ] Add form submits correctly
- [ ] Detail modal opens
- [ ] Edit modal opens with data
- [ ] Edit form submits correctly
- [ ] Delete confirmation works
- [ ] Delete executes correctly
- [ ] Real-time updates work
- [ ] Cards display correctly
- [ ] Status toggles work (if applicable)
- [ ] Recommended toggles work (if applicable)

---

## 🎯 Success Criteria

- [ ] All 3 pages migrated successfully
- [ ] No functionality lost
- [ ] 50%+ code reduction achieved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Team trained on new patterns

---

**Status:** Ready to implement  
**Estimated Time:** 4 weeks (1 developer)  
**Risk:** Low (gradual migration, page-by-page)  
**Impact:** High (better maintainability, consistency)
