# Hotel Pages Refactoring - Visual Comparison

**Quick Reference Guide**

---

## 🔍 Current Duplication Problem

### Example: DataView Components

All these files are **95% identical**:

```tsx
// ❌ BEFORE: 6 nearly identical files

// amenities/amenities/AmenitiesDataView.tsx
export const AmenitiesDataView = ({ viewMode, filteredData, ... }) => {
  return (
    <GenericDataView<Amenity>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      getItemId={(amenity) => amenity.id}
      renderCard={(amenity, onClick) => (
        <AmenityCard amenity={amenity} onClick={onClick} ... />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No amenities found"
    />
  );
};

// shop/products/ProductsDataView.tsx
export const ProductsDataView = ({ viewMode, filteredData, ... }) => {
  return (
    <GenericDataView<Product>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      getItemId={(product) => product.id}
      renderCard={(product, onClick) => (
        <ProductCard product={product} onClick={onClick} ... />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No products found"
    />
  );
};

// restaurant/restaurant/RestaurantsDataView.tsx
export const RestaurantsDataView = ({ viewMode, filteredData, ... }) => {
  return (
    <GenericDataView<Restaurant>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      getItemId={(restaurant) => restaurant.id}
      renderCard={(restaurant, onClick) => (
        <RestaurantCard restaurant={restaurant} onClick={onClick} ... />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No restaurants found"
    />
  );
};

// ... 3 more identical copies
```

**Problem:** 6 files × 60 lines = 360 lines of duplicated code!

---

## ✅ Refactored Solution

### Single Shared Component + Configs

```tsx
// ✅ AFTER: 1 shared component

// shared/entity/EntityDataView.tsx (50 lines)
export const EntityDataView = <T,>({
  viewMode,
  filteredData,
  tableColumns,
  gridColumns,
  renderCard,
  handleRowClick,
  emptyMessage = "No items found",
  ...rest
}) => {
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
      {...rest}
    />
  );
};
```

### Usage with Configs

```tsx
// amenities/config/amenityConfig.ts (20 lines)
export const amenityConfig = {
  renderCard: (amenity, onClick, { onEdit, onDelete, currency }) => (
    <AmenityCard
      amenity={amenity}
      onClick={onClick}
      onEdit={onEdit}
      onDelete={onDelete}
      currency={currency}
    />
  ),
  emptyMessage: "No amenities found",
  // ... other config
};

// amenities/tabs/AmenitiesTab.tsx
<EntityDataView
  {...props}
  renderCard={(amenity, onClick) =>
    amenityConfig.renderCard(amenity, onClick, { ... })
  }
  emptyMessage={amenityConfig.emptyMessage}
/>
```

**Result:** 360 lines → 50 + (6 × 20) = 170 lines = **53% reduction**

---

## 📊 Side-by-Side Comparison: Tab Components

### BEFORE: Duplicated Code

```tsx
// ❌ AmenitiesTab.tsx (130 lines)
export const AmenitiesTab = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}) => {
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
    return <LoadingState message="Loading amenities..." />;
  }

  return (
    <div className="space-y-4">
      <SearchAndFilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search amenities..."
        filterActive={Boolean(filterValue)}
        onFilterToggle={() => setFilterValue(filterValue ? "" : "active")}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        rightActions={
          <Button
            variant="dark"
            leftIcon={Plus}
            onClick={modalActions.openCreateModal}
          >
            ADD AMENITY
          </Button>
        }
      />

      <AmenitiesDataView
        viewMode={viewMode}
        filteredData={filteredData}
        handleRowClick={modalActions.openDetailModal}
        tableColumns={tableColumns}
        gridColumns={gridColumns}
        onEdit={modalActions.openEditModal}
        onDelete={modalActions.openDeleteModal}
        currency={currency}
      />

      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={AMENITY_FORM_FIELDS}
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        entityName="Amenity"
      />
    </div>
  );
};
```

```tsx
// ❌ ProductsTab.tsx (135 lines) - SAME CODE, different names
export const ProductsTab = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}) => {
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
    return <LoadingState message="Loading products..." />;
  }

  return (
    <div className="space-y-4">
      <SearchAndFilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search products..."
        filterActive={Boolean(filterValue)}
        onFilterToggle={() => setFilterValue(filterValue ? "" : "active")}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        rightActions={
          <Button
            variant="dark"
            leftIcon={Plus}
            onClick={modalActions.openCreateModal}
          >
            ADD PRODUCT
          </Button>
        }
      />

      <ProductsDataView
        viewMode={viewMode}
        filteredData={filteredData}
        handleRowClick={modalActions.openDetailModal}
        tableColumns={tableColumns}
        gridColumns={gridColumns}
        onEdit={modalActions.openEditModal}
        onDelete={modalActions.openDeleteModal}
        currency={currency}
      />

      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={PRODUCT_FORM_FIELDS}
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        entityName="Product"
      />
    </div>
  );
};
```

**Problem:** 6 tabs × 120 lines = 720 lines of nearly identical code!

### AFTER: Shared Component + Config

```tsx
// ✅ shared/entity/EntityTab.tsx (140 lines) - ONE SHARED COMPONENT
export const EntityTab = <T,>({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  entityName,
  searchPlaceholder,
  addButtonLabel,
  renderCard,
  renderDetailContent,
  formFields,
  currency,
  ...rest
}) => {
  const { searchAndFilter, modalState, modalActions, formState, formActions, ... } = crud;
  const { searchTerm, setSearchTerm, filterValue, setFilterValue, mode, setViewMode, filteredData } = searchAndFilter;

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
        viewMode={mode}
        onViewModeChange={setViewMode}
        rightActions={
          <Button variant="dark" leftIcon={Plus} onClick={modalActions.openCreateModal}>
            {addButtonLabel}
          </Button>
        }
      />

      <EntityDataView
        viewMode={mode}
        filteredData={filteredData}
        handleRowClick={modalActions.openDetailModal}
        tableColumns={tableColumns}
        gridColumns={gridColumns}
        onEdit={modalActions.openEditModal}
        onDelete={modalActions.openDeleteModal}
        renderCard={renderCard}
        currency={currency}
        {...rest}
      />

      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={formFields}
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

```tsx
// ✅ amenities/tabs/AmenitiesTab.tsx (31 lines)
import { EntityTab } from "../../shared/entity/EntityTab";
import { amenityConfig } from "../config/amenityConfig";

export const AmenitiesTab = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}) => {
  return (
    <EntityTab<Amenity>
      isLoading={isLoading}
      crud={crud}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      entityName={amenityConfig.entityName}
      searchPlaceholder={amenityConfig.searchPlaceholder}
      addButtonLabel={amenityConfig.addButtonLabel}
      renderCard={(amenity, onClick) =>
        amenityConfig.renderCard(amenity, onClick, {
          onEdit: () => crud.modalActions.openEditModal(amenity),
          onDelete: () => crud.modalActions.openDeleteModal(amenity),
          currency,
        })
      }
      renderDetailContent={amenityConfig.renderDetail}
      formFields={amenityConfig.formFields}
      currency={currency}
    />
  );
};
```

```tsx
// ✅ shop/tabs/ProductsTab.tsx (31 lines)
import { EntityTab } from "../../shared/entity/EntityTab";
import { productConfig } from "../config/productConfig";

export const ProductsTab = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}) => {
  return (
    <EntityTab<Product>
      isLoading={isLoading}
      crud={crud}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      entityName={productConfig.entityName}
      searchPlaceholder={productConfig.searchPlaceholder}
      addButtonLabel={productConfig.addButtonLabel}
      renderCard={(product, onClick) =>
        productConfig.renderCard(product, onClick, {
          onEdit: () => crud.modalActions.openEditModal(product),
          onDelete: () => crud.modalActions.openDeleteModal(product),
          currency,
        })
      }
      renderDetailContent={productConfig.renderDetail}
      formFields={productConfig.formFields}
      currency={currency}
    />
  );
};
```

**Result:** 720 lines → 140 + (6 × 31) = 326 lines = **55% reduction**

---

## 🎯 Key Benefits

### 1. Single Source of Truth

- Fix a bug once → Fixed everywhere
- Add a feature once → Available everywhere
- Update styling once → Consistent everywhere

### 2. Configuration-Based

- Each entity (amenity, product, restaurant) has a config file
- Config defines: labels, messages, card rendering, detail rendering
- Easy to understand what makes each entity unique

### 3. Type Safety

```tsx
// Generic with type parameter
<EntityTab<Amenity> ... />
<EntityTab<Product> ... />
<EntityTab<Restaurant> ... />

// Full TypeScript support
```

### 4. Easier Testing

```tsx
// Test shared component once
describe('EntityTab', () => {
  it('displays loading state', () => { ... });
  it('handles search', () => { ... });
  it('opens modals', () => { ... });
});

// Only test config-specific behavior
describe('AmenitiesTab', () => {
  it('renders amenity card correctly', () => { ... });
});
```

---

## 📁 Directory Structure Changes

### BEFORE (Fragmented)

```
components/
├── amenities/
│   ├── amenities/
│   │   ├── AmenitiesDataView.tsx     ← Duplicate
│   │   ├── AmenityDetail.tsx         ← Duplicate
│   │   └── ...
│   ├── requests/
│   │   ├── AmenityRequestsDataView.tsx ← Duplicate
│   │   └── ...
│   └── tabs/
│       ├── AmenitiesTab.tsx          ← Duplicate
│       └── RequestsTab.tsx           ← Duplicate
│
├── shop/
│   ├── products/
│   │   ├── ProductsDataView.tsx      ← Duplicate
│   │   ├── ProductDetail.tsx         ← Duplicate
│   │   └── ...
│   ├── orders/
│   │   ├── ShopOrdersDataView.tsx    ← Duplicate
│   │   └── ...
│   └── tabs/
│       ├── ProductsTab.tsx           ← Duplicate
│       └── OrdersTab.tsx             ← Duplicate
│
└── restaurant/
    ├── restaurant/
    │   ├── RestaurantsDataView.tsx   ← Duplicate
    │   ├── RestaurantDetail.tsx      ← Duplicate
    │   └── ...
    ├── menu-items/
    │   ├── MenuItemsDataView.tsx     ← Duplicate
    │   └── ...
    ├── dine-in-orders/
    │   ├── DineInOrdersDataView.tsx  ← Duplicate
    │   └── ...
    └── tabs/
        ├── RestaurantsTab.tsx        ← Duplicate
        ├── MenuItemsTab.tsx          ← Duplicate
        └── DineInOrdersTab.tsx       ← Duplicate
```

### AFTER (Organized)

```
components/
├── shared/                            ✨ NEW
│   ├── entity/
│   │   ├── EntityDataView.tsx        → Replaces 6 files
│   │   ├── EntityDetail.tsx          → Replaces 6 files
│   │   ├── EntityTab.tsx             → Replaces 6 files
│   │   └── index.ts
│   └── orders/
│       ├── OrdersDataView.tsx        → Replaces 3 files
│       ├── OrdersDetail.tsx          → Replaces 3 files
│       ├── OrdersTab.tsx             → Replaces 3 files
│       └── index.ts
│
├── amenities/
│   ├── config/                        ✨ NEW
│   │   ├── amenityConfig.ts          → Entity configuration
│   │   └── requestConfig.ts          → Order configuration
│   ├── AmenityCard.tsx               ✅ Keep (custom UI)
│   ├── AmenityRequestCard.tsx        ✅ Keep (custom UI)
│   ├── amenities/
│   │   ├── AmenityColumns.tsx        ✅ Keep (column logic)
│   │   └── AmenityFormFields.tsx     ✅ Keep (form fields)
│   └── tabs/
│       ├── AmenitiesTab.tsx          ✂️ Simplified (31 lines)
│       └── RequestsTab.tsx           ✂️ Simplified (31 lines)
│
├── shop/
│   ├── config/                        ✨ NEW
│   │   ├── productConfig.ts
│   │   └── orderConfig.ts
│   ├── ProductCard.tsx               ✅ Keep
│   ├── ShopOrderCard.tsx             ✅ Keep
│   └── tabs/
│       ├── ProductsTab.tsx           ✂️ Simplified (31 lines)
│       └── OrdersTab.tsx             ✂️ Simplified (31 lines)
│
└── restaurant/
    ├── config/                        ✨ NEW
    │   ├── restaurantConfig.ts
    │   ├── menuItemConfig.ts
    │   └── dineInOrderConfig.ts
    ├── RestaurantCard.tsx            ✅ Keep
    ├── MenuItemCard.tsx              ✅ Keep
    ├── DineInOrderCard.tsx           ✅ Keep
    └── tabs/
        ├── RestaurantsTab.tsx        ✂️ Simplified (31 lines)
        ├── MenuItemsTab.tsx          ✂️ Simplified (31 lines)
        └── DineInOrdersTab.tsx       ✂️ Simplified (31 lines)
```

---

## 🚀 Migration Example

### Step-by-Step: Migrating AmenitiesTab

#### Step 1: Create Config File

```tsx
// amenities/config/amenityConfig.ts
export const amenityConfig = {
  entityName: "Amenity",
  searchPlaceholder: "Search amenities...",
  addButtonLabel: "ADD AMENITY",
  emptyMessage: "No amenities found",
  formFields: AMENITY_FORM_FIELDS,
  renderCard: (amenity, onClick, { onEdit, onDelete, currency }) => (
    <AmenityCard
      amenity={amenity}
      onClick={onClick}
      onEdit={onEdit}
      onDelete={onDelete}
      currency={currency}
    />
  ),
  renderDetail: (item) => <AmenityDetail item={item} />,
};
```

#### Step 2: Update Tab Component

```tsx
// amenities/tabs/AmenitiesTab.tsx
// BEFORE: 130 lines
export const AmenitiesTab = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}) => {
  // ... 120 lines of code ...
};

// AFTER: 31 lines
import { EntityTab } from "../../shared/entity/EntityTab";
import { amenityConfig } from "../config/amenityConfig";

export const AmenitiesTab = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}) => {
  return (
    <EntityTab<Amenity>
      isLoading={isLoading}
      crud={crud}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      {...amenityConfig}
      renderCard={(amenity, onClick) =>
        amenityConfig.renderCard(amenity, onClick, {
          onEdit: () => crud.modalActions.openEditModal(amenity),
          onDelete: () => crud.modalActions.openDeleteModal(amenity),
          currency,
        })
      }
      currency={currency}
    />
  );
};
```

#### Step 3: Delete Old Files

```bash
# Delete these files (now replaced by shared components)
rm components/amenities/amenities/AmenitiesDataView.tsx
rm components/amenities/amenities/AmenityDetail.tsx
```

#### Step 4: Test

- Grid view works ✅
- List view works ✅
- Search works ✅
- Filter works ✅
- Add modal works ✅
- Edit modal works ✅
- Delete works ✅
- Detail modal works ✅

---

## 💡 Summary

### What We're Doing

- **Extract** duplicated code into shared components
- **Configure** each entity through config files
- **Simplify** tab components to just use shared base + config
- **Delete** redundant files

### What We're Keeping

- ✅ Custom Cards (AmenityCard, ProductCard, etc.)
- ✅ Column definitions (logic for table columns)
- ✅ Form fields (specific fields for each entity)
- ✅ All functionality and behavior

### What We're Gaining

- ✅ 50%+ less code
- ✅ Single source of truth
- ✅ Consistent behavior
- ✅ Easier maintenance
- ✅ Better type safety
- ✅ Clearer architecture

---

**Ready to start?** See `HOTEL_PAGES_PRACTICAL_REFACTORING.md` for detailed implementation steps.
