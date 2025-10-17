import React from "react";
import { Plus } from "lucide-react";
import {
  SearchAndFilterBar,
  Button,
  CRUDModalContainer,
  LoadingState,
} from "../../../../../components/common";
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

      <EntityDataView<T>
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
