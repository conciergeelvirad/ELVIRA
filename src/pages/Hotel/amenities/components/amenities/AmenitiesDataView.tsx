import React from "react";
import { GenericDataView } from "../../../../../components/common/data-display";
import { Column, GridColumn } from "../../../../../types/table";
import { Amenity } from "../../../../../hooks/queries/hotel-management/amenities";
import { AmenityCard } from "../shared";

interface AmenitiesDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (amenity: Amenity) => void;
  tableColumns: Column<Amenity>[];
  gridColumns: GridColumn[];
  onEdit: (amenity: Amenity) => void;
  onDelete: (amenity: Amenity) => void;
  currency?: string;
  handleRecommendedToggle?: (
    id: string | number,
    newValue: boolean,
    fieldName?: "recommended" | "hotel_recommended"
  ) => Promise<void>;
}

/**
 * Amenities Data View Component
 *
 * Displays hotel amenities in table or grid view using GenericDataView.
 * Handles amenity listing, pagination, and CRUD operations.
 */
export const AmenitiesDataView: React.FC<AmenitiesDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  gridColumns,
  onEdit,
  onDelete,
  currency,
  handleRecommendedToggle,
}) => {
  return (
    <GenericDataView<Amenity>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      getItemId={(amenity) => amenity.id}
      renderCard={(amenity, onClick) => (
        <AmenityCard
          amenity={amenity}
          onClick={onClick}
          onEdit={() => onEdit(amenity)}
          onDelete={() => onDelete(amenity)}
          onRecommendedToggle={handleRecommendedToggle}
          currency={currency}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No amenities found"
    />
  );
};
