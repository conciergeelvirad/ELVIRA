import React from "react";
import { usePagination } from "../../../../../hooks";
import { TableView, GridView } from "../../../../../components/common";
import {
  Column,
  TableRow,
  GridItem,
  GridColumn,
} from "../../../../../types/table";
import { Amenity } from "../../../../../hooks/queries/hotel-management/amenities";
import { AmenityCard } from "../../../../../components/amenities";

interface AmenitiesDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (amenity: Amenity) => void;
  tableColumns: Column<Amenity>[];
  gridColumns: GridColumn[];
  onEdit: (amenity: Amenity) => void;
  onDelete: (amenity: Amenity) => void;
}

export const AmenitiesDataView: React.FC<AmenitiesDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  gridColumns,
  onEdit,
  onDelete,
}) => {
  // Convert filtered data to typed format
  const filteredAmenitiesWithTypes = filteredData as unknown as Amenity[];

  // Create table rows and grid items
  const tableRows: TableRow<Amenity>[] = filteredAmenitiesWithTypes.map(
    (amenity) => ({
      id: amenity.id,
      data: amenity,
    })
  );

  const gridItems: GridItem<Amenity>[] = filteredAmenitiesWithTypes.map(
    (amenity) => ({
      id: amenity.id,
      data: amenity,
    })
  );

  // Pagination
  const pagination = usePagination({
    totalItems: filteredData.length,
    initialPageSize: 12,
  });

  // Paginated data helper
  const getPaginatedData = (items: unknown[]) =>
    items.slice(
      (pagination.currentPage - 1) * pagination.pageSize,
      pagination.currentPage * pagination.pageSize
    );

  const paginatedRows = getPaginatedData(tableRows) as TableRow<Amenity>[];

  const paginatedGridItems = getPaginatedData(gridItems) as GridItem<Amenity>[];

  return (
    <>
      {viewMode === "list" ? (
        <TableView
          columns={tableColumns as unknown as Column<Record<string, unknown>>[]}
          rows={paginatedRows as unknown as TableRow<Record<string, unknown>>[]}
          sortable
          striped
          hoverable
          emptyMessage="No amenities found"
          onRowClick={(row) => {
            const amenity = filteredAmenitiesWithTypes.find(
              (a) => a.id === row.id
            );
            if (amenity) handleRowClick(amenity);
          }}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            pageSize: pagination.pageSize,
            totalItems: tableRows.length,
            onPageChange: pagination.goToPage,
            onPageSizeChange: pagination.setPageSize,
          }}
        />
      ) : (
        <GridView
          items={paginatedGridItems}
          columns={gridColumns}
          renderCard={(gridItem) => {
            const amenity = gridItem.data;
            return (
              <AmenityCard
                amenity={amenity}
                onEdit={() => onEdit(amenity)}
                onDelete={() => onDelete(amenity)}
              />
            );
          }}
          emptyMessage="No amenities found"
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            pageSize: pagination.pageSize,
            totalItems: gridItems.length,
            onPageChange: pagination.goToPage,
            onPageSizeChange: pagination.setPageSize,
          }}
        />
      )}
    </>
  );
};
