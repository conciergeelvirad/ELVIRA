import React, { useState, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import {
  SearchAndFilterBar,
  Button,
  CRUDModalContainer,
  LoadingState,
} from "../../../../../components/common";
import {
  FilterModal,
  type FilterOptions,
} from "../../../../Guests/components/common/FilterModal";
import { EntityDataView } from "./EntityDataView";
import type { FormFieldConfig } from "../../../../../hooks";

interface EntityTabProps<T> {
  // Loading state
  isLoading: boolean;

  // CRUD hook (from useAmenityCRUD, useProductCRUD, etc.)
  crud: any;

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
  formFields: FormFieldConfig[];
  editFormFields?: FormFieldConfig[];

  // Optional
  currency?: string;
  showAddButton?: boolean;

  // Custom filter panel (replaces FilterModal)
  // Pass a function that accepts isOpen and onToggle
  filterPanel?: (isOpen: boolean, onToggle: () => void) => React.ReactNode;

  // Filter configuration (optional - deprecated, use filterPanel instead)
  enableAdvancedFilters?: boolean;
  filterCategories?: string[];
  filterMaxPrice?: number;
  filterServiceTypes?: string[];
  getItemCategory?: (item: T) => string;
  getItemPrice?: (item: T) => number;
  getItemRecommended?: (item: T) => boolean;
  getItemServiceTypes?: (item: T) => string[];
}

/**
 * Generic Entity Tab Component
 *
 * Shared component for entity tabs (Amenities, Products, Restaurants, MenuItems).
 * Handles search, filter, view modes, and CRUD operations.
 *
 * This component replaces:
 * - AmenitiesTab
 * - ProductsTab
 * - RestaurantsTab
 * - MenuItemsTab
 *
 * @example
 * ```tsx
 * <EntityTab<Amenity>
 *   isLoading={isLoading}
 *   crud={amenityCRUD}
 *   tableColumns={tableColumns}
 *   gridColumns={gridColumns}
 *   entityName="Amenity"
 *   searchPlaceholder="Search amenities..."
 *   addButtonLabel="ADD AMENITY"
 *   renderCard={(amenity, onClick) => (
 *     <AmenityCard amenity={amenity} onClick={onClick} />
 *   )}
 *   formFields={AMENITY_FORM_FIELDS}
 * />
 * ```
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
  filterPanel,
  enableAdvancedFilters = false,
  filterCategories = [],
  filterMaxPrice = 1000,
  filterServiceTypes = [],
  getItemCategory,
  getItemPrice,
  getItemRecommended,
  getItemServiceTypes,
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

  // Advanced filter state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    selectedCategories: [],
    priceRange: { min: 0, max: filterMaxPrice },
    showOnlyRecommended: false,
    selectedServiceTypes: [],
  });

  // Apply advanced filters to data
  const finalFilteredData = useMemo(() => {
    if (!enableAdvancedFilters) return filteredData;

    let result = [...filteredData];

    // Filter by categories
    if (advancedFilters.selectedCategories.length > 0 && getItemCategory) {
      result = result.filter((item) =>
        advancedFilters.selectedCategories.includes(getItemCategory(item))
      );
    }

    // Filter by price range
    if (getItemPrice) {
      result = result.filter((item) => {
        const price = getItemPrice(item);
        return (
          price >= advancedFilters.priceRange.min &&
          price <= advancedFilters.priceRange.max
        );
      });
    }

    // Filter by recommended
    if (advancedFilters.showOnlyRecommended && getItemRecommended) {
      result = result.filter((item) => getItemRecommended(item));
    }

    // Filter by service types (for menu items)
    if (
      advancedFilters.selectedServiceTypes &&
      advancedFilters.selectedServiceTypes.length > 0 &&
      getItemServiceTypes
    ) {
      result = result.filter((item) => {
        const itemServiceTypes = getItemServiceTypes(item);
        return advancedFilters.selectedServiceTypes!.some((type) =>
          itemServiceTypes.includes(type)
        );
      });
    }

    return result;
  }, [
    enableAdvancedFilters,
    filteredData,
    advancedFilters,
    getItemCategory,
    getItemPrice,
    getItemRecommended,
    getItemServiceTypes,
  ]);

  // Handle filter apply
  const handleApplyFilters = useCallback((filters: FilterOptions) => {
    setAdvancedFilters(filters);
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.selectedCategories.length > 0) count++;
    if (
      advancedFilters.priceRange.min > 0 ||
      advancedFilters.priceRange.max < filterMaxPrice
    )
      count++;
    if (advancedFilters.showOnlyRecommended) count++;
    if (
      advancedFilters.selectedServiceTypes &&
      advancedFilters.selectedServiceTypes.length > 0
    )
      count++;
    return count;
  }, [advancedFilters, filterMaxPrice]);

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
        // Show filter button if custom filter panel or advanced filters enabled
        onFilterClick={
          filterPanel || enableAdvancedFilters
            ? () => setIsFilterModalOpen(true)
            : undefined
        }
        filterBadgeCount={enableAdvancedFilters ? activeFilterCount : undefined}
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

      {/* Custom Filter Panel (if provided) */}
      {filterPanel &&
        filterPanel(isFilterModalOpen, () =>
          setIsFilterModalOpen(!isFilterModalOpen)
        )}

      <EntityDataView<T>
        viewMode={viewMode}
        filteredData={finalFilteredData}
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

      {/* Advanced Filter Modal */}
      {enableAdvancedFilters && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilters}
          categories={filterCategories}
          maxPrice={filterMaxPrice}
          currentFilters={advancedFilters}
          serviceTypes={
            filterServiceTypes.length > 0 ? filterServiceTypes : undefined
          }
        />
      )}
    </div>
  );
};
