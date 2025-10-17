# Three Pages Consistency Analysis

**Pages Analyzed:** Hotel Shop, Hotel Restaurant, Amenities  
**Date:** October 17, 2025  
**Goal:** Ensure all three pages use identical shared components and behave consistently

---

## Executive Summary

### Current State

The three pages (Hotel Shop, Restaurant, Amenities) have **inconsistent component usage**:

- ✅ **Restaurant & Shop Orders**: Use `GenericDataView` (shared component)
- ❌ **Hotel Shop Products**: Uses custom `ProductsDataView` (duplicate code)
- ❌ **Amenities**: Uses custom `AmenitiesDataView` (duplicate code)
- ✅ **All Cards**: Use `GenericCard` base component (good!)
- ⚠️ **Menu Items**: Restaurant MenuItemCard is inline, not in common components

### Critical Issues

1. **DataView Duplication**: ProductsDataView and AmenitiesDataView duplicate GenericDataView logic
2. **Card Location Inconsistency**: ProductCard and AmenityCard are in common/components, MenuItemCard is inline
3. **Different patterns**: Some use GenericDataView, others use custom DataViews

---

## Detailed Component Analysis

### 1. DATA VIEW COMPONENTS

#### ✅ **GenericDataView** (Shared Component)

**Location:** `src/components/common/data-display/GenericDataView.tsx`

**Used By:**

- ✅ Shop Orders (`ShopOrdersDataView`)
- ✅ Restaurant (Restaurants, Menu Items, Dine-In Orders)
- ✅ Amenity Requests
- ✅ Staff Management, Tasks, Absences
- ✅ Guests, QA, Recommended Places

**Features:**

- Table/Grid view switching
- Pagination
- Type-safe
- Reusable render functions
- Consistent behavior

#### ❌ **ProductsDataView** (Custom - SHOULD USE GENERIC)

**Location:** `src/pages/Hotel/components/shop/products/ProductsDataView.tsx`

**Problem:** Duplicates GenericDataView functionality (125 lines)

```tsx
// CURRENT: Custom implementation
export const ProductsDataView: React.FC<ProductsDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  gridColumns,
  handleStatusToggle,
  onEdit,
  onDelete,
  onView,
}) => {
  const filteredProductsWithTypes = filteredData as unknown as Product[];
  const tableRows: TableRow<Product>[] = filteredProductsWithTypes.map(/*...*/);
  const gridItems: GridItem<Product>[] = filteredProductsWithTypes.map(/*...*/);
  const pagination = usePagination({
    totalItems: filteredData.length,
    initialPageSize: 12,
  });
  // ... 100+ more lines of duplicated logic
};

// SHOULD BE: Using GenericDataView
export const ProductsDataView = ({
  viewMode,
  filteredData,
  onEdit,
  onDelete,
  onView,
}) => (
  <GenericDataView<Product>
    viewMode={viewMode}
    filteredData={filteredData}
    tableColumns={productTableColumns}
    gridColumns={productGridColumns}
    getItemId={(product) => product.id}
    renderCard={(product, onClick) => (
      <ProductCard
        product={product}
        onClick={onClick}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )}
    onItemClick={onView}
  />
);
```

#### ❌ **AmenitiesDataView** (Custom - SHOULD USE GENERIC)

**Location:** `src/pages/Hotel/components/amenities/amenities/AmenitiesDataView.tsx`

**Problem:** Duplicates GenericDataView functionality (121 lines)

- Identical structure to ProductsDataView
- Same pagination logic
- Same table/grid switching
- ~100 lines of duplicate code

**Should Be:** Using GenericDataView like Restaurant does

---

### 2. CARD COMPONENTS

#### ✅ **GenericCard** (Base Component)

**Location:** `src/components/common/data-display/GenericCard.tsx`

**Used By:** ALL cards (ProductCard, AmenityCard, MenuItemCard)

**Features:**

- Image display with fallback
- Title, badges, price
- Flexible sections
- Footer actions
- onClick handler

#### ⚠️ **ProductCard** (Wrapper Component)

**Location:** `src/components/shop/ProductCard.tsx` ✅ **CORRECT LOCATION**

**Status:** Good location (common/shop), uses GenericCard

```tsx
export const ProductCard = ({ product, onClick, onEdit, onDelete }) => (
  <GenericCard
    image={product.image_url}
    imageFallback={<Package className="w-16 h-16" />}
    title={product.name}
    price={{ value: product.price, currency: "€" }}
    sections={[/* description, category, stock */]}
    footer={<CardActionFooter onEdit={...} onDelete={...} />}
    onClick={onClick}
  />
);
```

#### ⚠️ **AmenityCard** (Wrapper Component)

**Location:** `src/components/amenities/AmenityCard.tsx` ✅ **CORRECT LOCATION**

**Status:** Good location (common/amenities), uses GenericCard

```tsx
export const AmenityCard = ({ amenity, onClick, onEdit, onDelete }) => (
  <GenericCard
    image={amenity.image_url}
    imageFallback={<Sparkles className="w-16 h-16" />}
    title={amenity.name}
    price={{ value: amenity.price, currency: "$" }}
    sections={[/* description, category */]}
    additionalBadges={[/* recommended, active status */]}
    footer={<CardActionFooter onEdit={...} onDelete={...} />}
    onClick={onClick}
  />
);
```

#### ❌ **MenuItemCard** (Inline Component)

**Location:** `src/pages/Hotel/components/restaurant/menu-items/MenuItemComponents.tsx` (LINE 114)

**Problem:** Defined inline in page-specific file, NOT in common components

```tsx
// CURRENT: Inline definition
const MenuItemCard: React.FC<{...}> = ({ item, onClick, onEdit, onDelete }) => (
  <GenericCard
    image={item.image_url}
    imageFallback={<Menu className="w-16 h-16" />}
    title={item.name}
    price={{ value: item.price, currency: "$" }}
    sections={[/* category, description */]}
    footer={<CardActionFooter onEdit={...} onDelete={...} />}
    onClick={onClick}
  />
);

// SHOULD BE: Exported component in common folder
// Location: src/components/restaurant/MenuItemCard.tsx
export const MenuItemCard = ({ menuItem, onClick, onEdit, onDelete }) => (/*...*/);
```

---

### 3. TAB COMPONENTS

#### Structure Comparison

| Feature                | Shop                           | Restaurant                                                | Amenities                         | Status            |
| ---------------------- | ------------------------------ | --------------------------------------------------------- | --------------------------------- | ----------------- |
| **Tab Files**          | ProductsTab.tsx, OrdersTab.tsx | RestaurantsTab.tsx, MenuItemsTab.tsx, DineInOrdersTab.tsx | AmenitiesTab.tsx, RequestsTab.tsx | ✅ Consistent     |
| **SearchAndFilterBar** | ✅ Yes                         | ✅ Yes                                                    | ✅ Yes                            | ✅ Same component |
| **Button Component**   | ✅ Yes                         | ✅ Yes                                                    | ✅ Yes                            | ✅ Same component |
| **CRUDModalContainer** | ✅ Yes                         | ✅ Yes                                                    | ✅ Yes                            | ✅ Same component |
| **LoadingState**       | ✅ Yes                         | ✅ Yes                                                    | ✅ Yes                            | ✅ Same component |
| **DataView**           | ❌ Custom                      | ✅ Generic                                                | ❌ Custom                         | ❌ INCONSISTENT   |

**ProductsTab Example:**

```tsx
export const ProductsTab: React.FC<ProductsTabProps> = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
}) => {
  return (
    <div className="space-y-4">
      <SearchAndFilterBar {...searchProps} /> {/* ✅ Shared */}
      <ProductsDataView {...dataViewProps} /> {/* ❌ Custom */}
      <CRUDModalContainer {...modalProps} /> {/* ✅ Shared */}
    </div>
  );
};
```

**MenuItemsTab Example:**

```tsx
export const MenuItemsTab = ({ hotelId, menuItemCRUD }) => {
  return (
    <>
      <SearchAndFilterBar {...searchProps} /> {/* ✅ Shared */}
      <MenuItemsDataView {...dataViewProps} /> {/* ✅ Uses GenericDataView */}
      <CRUDModalContainer {...modalProps} /> {/* ✅ Shared */}
    </>
  );
};
```

---

### 4. DETAIL COMPONENTS

#### ✅ **ItemDetailView** (Recently Refactored - EXCELLENT!)

**Location:** `src/components/common/detail-view/ItemDetailView.tsx`

**Used By:** ALL three pages now use this!

- ✅ ProductDetail
- ✅ AmenityDetail
- ✅ MenuItemDetail

**Before:** Each page had ~48 lines of duplicate code  
**After:** Each page uses ItemDetailView (~20 lines)

This is **THE MODEL** for how all components should be refactored!

---

### 5. MODAL & FORM COMPONENTS

| Component              | Shop | Restaurant | Amenities | Status     |
| ---------------------- | ---- | ---------- | --------- | ---------- |
| **CRUDModalContainer** | ✅   | ✅         | ✅        | ✅ Perfect |
| **CRUDDetailModal**    | ✅   | ✅         | ✅        | ✅ Perfect |
| **DetailModal**        | ✅   | ✅         | ✅        | ✅ Perfect |
| **FormFieldConfig**    | ✅   | ✅         | ✅        | ✅ Perfect |

All modal and form components are **perfectly shared**! No issues here.

---

## Component Usage Matrix

| Component Type         | Shop Products | Shop Orders | Restaurant (Menu) | Restaurant (Orders) | Amenities | Amenity Requests | Status          |
| ---------------------- | ------------- | ----------- | ----------------- | ------------------- | --------- | ---------------- | --------------- |
| **GenericDataView**    | ❌            | ✅          | ✅                | ✅                  | ❌        | ✅               | 🔴 INCONSISTENT |
| **GenericCard**        | ✅            | ✅          | ✅                | ✅                  | ✅        | ✅               | ✅ Perfect      |
| **ItemDetailView**     | ✅            | N/A         | ✅                | N/A                 | ✅        | N/A              | ✅ Perfect      |
| **SearchAndFilterBar** | ✅            | ✅          | ✅                | ✅                  | ✅        | ✅               | ✅ Perfect      |
| **TableView**          | ✅            | ✅          | ✅                | ✅                  | ✅        | ✅               | ✅ Perfect      |
| **GridView**           | ✅            | ✅          | ✅                | ✅                  | ✅        | ✅               | ✅ Perfect      |
| **CRUDModalContainer** | ✅            | ✅          | ✅                | ✅                  | ✅        | ✅               | ✅ Perfect      |
| **Button**             | ✅            | ✅          | ✅                | ✅                  | ✅        | ✅               | ✅ Perfect      |
| **LoadingState**       | ✅            | ✅          | ✅                | ✅                  | ✅        | ✅               | ✅ Perfect      |

**Legend:**

- ✅ = Uses shared component correctly
- ❌ = Uses custom/duplicate component
- 🔴 = Critical inconsistency

---

## Folder Structure Analysis

### Current Structure

```
src/
  components/
    common/
      data-display/
        GenericCard.tsx         ✅ Shared base
        GenericDataView.tsx     ✅ Shared (but not used everywhere!)
        CardActionFooter.tsx    ✅ Shared
      detail-view/
        ItemDetailView.tsx      ✅ Shared (recently refactored)
      layout/
        SearchAndFilterBar.tsx  ✅ Shared
        Button.tsx              ✅ Shared
    shop/
      ProductCard.tsx           ✅ Good location
    amenities/
      AmenityCard.tsx           ✅ Good location
    restaurant/
      [MISSING] MenuItemCard.tsx  ❌ Should exist here!

  pages/Hotel/components/
    shop/
      products/
        ProductsDataView.tsx    ❌ DUPLICATE - should use GenericDataView
        ProductDetail.tsx       ✅ Uses ItemDetailView
        ProductColumns.tsx      ✅ Page-specific
        ProductFormFields.tsx   ✅ Page-specific
      orders/
        ShopOrdersDataView.tsx  ✅ Uses GenericDataView ✅

    restaurant/
      menu-items/
        MenuItemComponents.tsx  ❌ All-in-one file with inline card

    amenities/
      amenities/
        AmenitiesDataView.tsx   ❌ DUPLICATE - should use GenericDataView
        AmenityDetail.tsx       ✅ Uses ItemDetailView
        AmenityColumns.tsx      ✅ Page-specific
```

### Proposed Structure (Improvements)

```
src/
  components/
    common/
      data-display/
        GenericCard.tsx           ✅ Keep as-is
        GenericDataView.tsx       ✅ Keep as-is
        CardActionFooter.tsx      ✅ Keep as-is
      detail-view/
        ItemDetailView.tsx        ✅ Keep as-is

    shop/
      ProductCard.tsx             ✅ Keep as-is

    amenities/
      AmenityCard.tsx             ✅ Keep as-is

    restaurant/
      MenuItemCard.tsx            ⭐ CREATE - extract from inline

  pages/Hotel/components/
    shop/
      products/
        [DELETE] ProductsDataView.tsx     ❌ Remove - use GenericDataView
        ProductDetail.tsx                 ✅ Keep
        ProductColumns.tsx                ✅ Keep
        ProductFormFields.tsx             ✅ Keep
      orders/
        ShopOrdersDataView.tsx            ✅ Keep (wrapper around GenericDataView)

    restaurant/
      menu-items/
        MenuItemColumns.tsx               ⭐ CREATE - separate from all-in-one
        MenuItemDetail.tsx                ⭐ CREATE - separate from all-in-one
        MenuItemFormFields.tsx            ⭐ CREATE - separate from all-in-one
        [DELETE] MenuItemComponents.tsx   ❌ Split into separate files

    amenities/
      amenities/
        [DELETE] AmenitiesDataView.tsx    ❌ Remove - use GenericDataView
        AmenityDetail.tsx                 ✅ Keep
        AmenityColumns.tsx                ✅ Keep
```

---

## Issues & Recommendations

### 🔴 CRITICAL ISSUE #1: DataView Duplication

**Problem:**

- ProductsDataView (125 lines) duplicates GenericDataView
- AmenitiesDataView (121 lines) duplicates GenericDataView
- Total: ~250 lines of duplicate pagination/table/grid logic

**Impact:**

- Bug fixes must be applied in 3 places
- Inconsistent behavior between pages
- More code to maintain

**Solution:**
Refactor to use GenericDataView like Restaurant does:

```tsx
// BEFORE: ProductsDataView.tsx (125 lines)
export const ProductsDataView: React.FC<ProductsDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  gridColumns,
  handleStatusToggle,
  onEdit,
  onDelete,
  onView,
}) => {
  const filteredProductsWithTypes = filteredData as unknown as Product[];
  const tableRows: TableRow<Product>[] = filteredProductsWithTypes.map(/*...*/);
  const gridItems: GridItem<Product>[] = filteredProductsWithTypes.map(/*...*/);
  const pagination = usePagination({
    /*...*/
  });
  // ... 100+ lines of logic
};

// AFTER: Simple wrapper (20 lines)
export const ProductsDataView: React.FC<ProductsDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  gridColumns,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <GenericDataView<Product>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      getItemId={(product) => product.id}
      renderCard={(product, onClick) => (
        <ProductCard
          product={product}
          onClick={onClick}
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product)}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No products found"
    />
  );
};
```

**Code Reduction:** 125 lines → 20 lines (**84% reduction**)

---

### 🔴 CRITICAL ISSUE #2: MenuItemCard Not in Common Components

**Problem:**  
MenuItemCard is defined inline in MenuItemComponents.tsx instead of being a standalone component in `src/components/restaurant/`

**Impact:**

- Cannot be reused elsewhere
- Inconsistent with ProductCard and AmenityCard patterns
- Makes MenuItemComponents.tsx bloated (240 lines)

**Solution:**

**Step 1:** Create `src/components/restaurant/MenuItemCard.tsx`

```tsx
import { type MenuItem } from "../../hooks/queries/hotel-management/restaurants";
import { GenericCard, CardActionFooter } from "../common/data-display";
import { Menu } from "lucide-react";

interface MenuItemCardProps {
  menuItem: MenuItem;
  onClick?: () => void;
  onEdit?: (menuItem: MenuItem) => void;
  onDelete?: (menuItem: MenuItem) => void;
}

export const MenuItemCard = ({
  menuItem,
  onClick,
  onEdit,
  onDelete,
}: MenuItemCardProps) => {
  const sections = [];

  sections.push({
    content: (
      <span className="inline-block text-sm bg-gray-100 px-2 py-1 rounded">
        {menuItem.category}
      </span>
    ),
  });

  if (menuItem.description) {
    sections.push({
      content: (
        <p className="text-sm text-gray-600 line-clamp-2">
          {menuItem.description}
        </p>
      ),
    });
  }

  return (
    <GenericCard
      image={menuItem.image_url || undefined}
      imageFallback={<Menu className="w-16 h-16 text-gray-400" />}
      title={menuItem.name}
      badge={{
        label: menuItem.is_available ? "Available" : "Unavailable",
        variant: "soft",
      }}
      price={{
        value: menuItem.price,
        currency: "$",
        className: "text-xl font-bold text-orange-600",
      }}
      sections={sections}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(menuItem) : undefined}
          onDelete={onDelete ? () => onDelete(menuItem) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};
```

**Step 2:** Update MenuItemComponents.tsx to import instead of defining inline

```tsx
// Add import at top
import { MenuItemCard } from "../../../../../components/restaurant/MenuItemCard";

// Remove inline MenuItemCard definition (lines 114-175)
// Keep MenuItemsDataView but use imported card
```

**Code Reduction:** Cleaner separation, reusable component

---

### ⚠️ ISSUE #3: MenuItemComponents.tsx All-in-One File

**Problem:**  
MenuItemComponents.tsx (240 lines) contains:

- Columns
- Detail component
- DataView
- Card (inline)
- Form fields

**Impact:**

- Hard to navigate
- Violates single responsibility principle
- Different from Shop and Amenities patterns

**Solution:**  
Split into separate files like Shop does:

```
restaurant/menu-items/
  MenuItemColumns.tsx      ⭐ NEW - table/grid columns
  MenuItemDetail.tsx       ⭐ NEW - detail view (already uses ItemDetailView)
  MenuItemsDataView.tsx    ⭐ NEW - data view wrapper
  MenuItemFormFields.tsx   ⭐ NEW - form field configuration
```

**Benefits:**

- Matches Shop and Amenities structure
- Easier to maintain
- Better organization

---

### ✅ SUCCESS STORY: ItemDetailView Refactoring

**What Was Done:** (Recent refactoring)

- Created generic `ItemDetailView` component
- Refactored ProductDetail, AmenityDetail, MenuItemDetail to use it
- Eliminated ~75 lines of duplicate code

**Result:**

- ✅ All three detail views now identical
- ✅ Single source of truth
- ✅ Easy to maintain

**This is the model** for how DataView should be refactored!

---

## Migration Plan

### Phase 1: Extract MenuItemCard (Low Risk)

**Estimated Time:** 30 minutes

1. Create `src/components/restaurant/MenuItemCard.tsx`
2. Move MenuItemCard code from MenuItemComponents.tsx
3. Export from `src/components/restaurant/index.ts`
4. Update MenuItemComponents.tsx import
5. Test grid view

**Files Changed:** 3 files  
**Risk:** Low (simple extraction)

---

### Phase 2: Refactor ProductsDataView to use GenericDataView (Medium Risk)

**Estimated Time:** 1-2 hours

**Current:** ProductsDataView.tsx (125 lines custom implementation)

**Target:** Wrapper around GenericDataView (20 lines)

**Steps:**

1. Create new ProductsDataView implementation using GenericDataView
2. Test table view (sorting, pagination, row click)
3. Test grid view (cards, pagination)
4. Test all CRUD operations (edit, delete, view)
5. Verify status toggle still works
6. Remove old implementation

**Files Changed:** 1 file (ProductsDataView.tsx)  
**Code Reduction:** 125 lines → 20 lines

**Testing Checklist:**

- [ ] Table view displays correctly
- [ ] Grid view displays correctly
- [ ] Pagination works
- [ ] Row click opens detail modal
- [ ] Edit button works
- [ ] Delete button works
- [ ] Status toggle works
- [ ] Search/filter integration works

---

### Phase 3: Refactor AmenitiesDataView to use GenericDataView (Medium Risk)

**Estimated Time:** 1-2 hours

**Same process as Phase 2 but for Amenities**

**Files Changed:** 1 file (AmenitiesDataView.tsx)  
**Code Reduction:** 121 lines → 20 lines

---

### Phase 4: Split MenuItemComponents.tsx (Optional, Low Priority)

**Estimated Time:** 2-3 hours

Split into:

- MenuItemColumns.tsx
- MenuItemDetail.tsx (already extracted to ItemDetailView)
- MenuItemsDataView.tsx
- MenuItemFormFields.tsx

**Files Changed:** 5 files (1 deleted, 4 created)  
**Benefit:** Better organization, matches other pages

---

## Code Impact Summary

### Before Refactoring

```
ProductsDataView.tsx:           125 lines (custom DataView)
AmenitiesDataView.tsx:          121 lines (custom DataView)
MenuItemComponents.tsx:         240 lines (all-in-one)
MenuItemCard:                   Inline definition
---------------------------------------------------
TOTAL DUPLICATED CODE:          ~246 lines
```

### After Refactoring

```
ProductsDataView.tsx:           ~20 lines (GenericDataView wrapper)
AmenitiesDataView.tsx:          ~20 lines (GenericDataView wrapper)
MenuItemComponents.tsx:         Split into 4 files
MenuItemCard.tsx:               Standalone component
---------------------------------------------------
CODE REDUCTION:                 ~200+ lines eliminated
DUPLICATION REMOVED:            100%
```

---

## Benefits of Standardization

### 1. **Consistency**

- All three pages behave identically
- Users have consistent experience
- Developers know what to expect

### 2. **Maintainability**

- Bug fixes in one place benefit all pages
- New features automatically available everywhere
- Less code to test and maintain

### 3. **Performance**

- Shared components are optimized once
- Better code splitting
- Smaller bundle size

### 4. **Developer Experience**

- Clear patterns to follow
- Easy to add new entity types
- Less cognitive load

### 5. **Quality**

- Shared components are battle-tested
- Fewer edge cases to handle
- Consistent error handling

---

## Recommended Action Items

### Immediate (Do Now)

1. ✅ **Use ItemDetailView everywhere** - Already done!
2. 🔴 **Refactor ProductsDataView** - Use GenericDataView
3. 🔴 **Refactor AmenitiesDataView** - Use GenericDataView
4. 🔴 **Extract MenuItemCard** - Move to common components

### Short Term (Next Sprint)

5. ⚠️ **Split MenuItemComponents.tsx** - Better organization
6. 📝 **Document component patterns** - Create usage guide
7. ✅ **Add TypeScript strict mode** - Catch inconsistencies early

### Long Term (Future)

8. 🔄 **Create Page Template** - Scaffold new pages correctly
9. 🧪 **Add Component Tests** - Ensure consistency
10. 📖 **Update Developer Guide** - Document best practices

---

## Comparison: Before vs After

### Shop Products (BEFORE)

```tsx
// Custom DataView - 125 lines
export const ProductsDataView = ({ viewMode, filteredData, ... }) => {
  const filteredProductsWithTypes = filteredData as unknown as Product[];
  const tableRows: TableRow<Product>[] = filteredProductsWithTypes.map(/*...*/);
  const gridItems: GridItem<Product>[] = filteredProductsWithTypes.map(/*...*/);
  const pagination = usePagination({ totalItems: filteredData.length });

  const getPaginatedData = (items: unknown[]) => items.slice(/*...*/);
  const paginatedRows = getPaginatedData(tableRows);
  const paginatedGridItems = getPaginatedData(gridItems);

  return (
    <>{viewMode === "list" ? (
      <TableView columns={...} rows={...} pagination={...} />
    ) : (
      <GridView items={...} columns={...} renderCard={...} pagination={...} />
    )}</>
  );
};
```

### Shop Products (AFTER)

```tsx
// Generic DataView wrapper - 20 lines
export const ProductsDataView = ({
  viewMode,
  filteredData,
  onEdit,
  onDelete,
  onView,
}) => (
  <GenericDataView<Product>
    viewMode={viewMode}
    filteredData={filteredData}
    tableColumns={tableColumns}
    gridColumns={gridColumns}
    getItemId={(product) => product.id}
    renderCard={(product, onClick) => (
      <ProductCard
        product={product}
        onClick={onClick}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )}
    onItemClick={onView}
    emptyMessage="No products found"
  />
);
```

**Reduction:** 125 → 20 lines (**84% less code**)

---

## Conclusion

### Current State: 60% Consistent

- ✅ Modals, Forms, Buttons, Search: Perfect
- ✅ ItemDetailView: Recently refactored, perfect
- ✅ GenericCard: Used everywhere, perfect
- ❌ DataView: Inconsistent (2 custom, 4 generic)
- ❌ Card Location: MenuItemCard not in common components

### Target State: 100% Consistent

- All pages use GenericDataView
- All cards in common components
- Identical behavior everywhere
- ~200 lines of duplicate code eliminated

### Next Steps

1. **Refactor ProductsDataView** - Highest impact (125 lines → 20)
2. **Refactor AmenitiesDataView** - High impact (121 lines → 20)
3. **Extract MenuItemCard** - Quick win (better organization)
4. **Split MenuItemComponents** - Optional (better structure)

### Success Metrics

- ✅ Zero duplicate DataView logic
- ✅ All cards in common components
- ✅ Consistent file structure across all three pages
- ✅ ~200 lines of code reduction
- ✅ 100% component sharing

---

**Ready to proceed with refactoring?** Start with ProductsDataView → GenericDataView migration for immediate impact! 🚀
