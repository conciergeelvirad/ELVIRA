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
 *
 * This component replaces:
 * - AmenitiesDataView
 * - ProductsDataView
 * - RestaurantsDataView
 * - MenuItemsDataView
 *
 * @example
 * ```tsx
 * <EntityDataView<Amenity>
 *   viewMode={viewMode}
 *   filteredData={filteredData}
 *   tableColumns={tableColumns}
 *   gridColumns={gridColumns}
 *   handleRowClick={handleClick}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   renderCard={(amenity, onClick) => (
 *     <AmenityCard amenity={amenity} onClick={onClick} />
 *   )}
 *   emptyMessage="No amenities found"
 * />
 * ```
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
