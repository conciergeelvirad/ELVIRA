/**
 * Generic Data View Component
 *
 * A reusable component that renders data in either table or grid view with pagination.
 * This component abstracts away the common logic shared across all DataView components,
 * providing a clean, type-safe interface for displaying any entity type.
 *
 * @example
 * ```tsx
 * <GenericDataView
 *   viewMode={viewMode}
 *   filteredData={filteredStaff}
 *   tableColumns={staffTableColumns}
 *   gridColumns={staffGridColumns}
 *   getItemId={(staff) => staff.employeeId}
 *   renderCard={(staff, onClick) => <StaffCard staff={staff} onClick={onClick} />}
 *   onItemClick={handleRowClick}
 *   emptyMessage="No staff members found"
 * />
 * ```
 */

import React, { useMemo } from "react";
import { usePagination } from "../../../hooks";
import { TableView, GridView } from "../index";
import { Column, TableRow, GridItem, GridColumn } from "../../../types/table";

interface GenericDataViewProps<T> {
  /** Current view mode - list (table) or grid */
  viewMode: "list" | "grid";

  /** Array of filtered data to display */
  filteredData: unknown[];

  /** Table column configuration */
  tableColumns: Column<T>[];

  /** Grid column configuration */
  gridColumns: GridColumn[];

  /** Function to extract unique ID from each item */
  getItemId: (item: T) => string | number;

  /** Render function for grid view cards */
  renderCard: (item: T, onClick: () => void) => React.ReactNode;

  /** Callback when an item is clicked */
  onItemClick: (item: T) => void;

  /** Message to display when no data is available */
  emptyMessage?: string;

  /** Initial page size for pagination (default: 12) */
  initialPageSize?: number;

  /** Enable table sorting (default: true) */
  sortable?: boolean;

  /** Enable table row striping (default: true) */
  striped?: boolean;

  /** Enable table row hover effect (default: true) */
  hoverable?: boolean;
}

/**
 * Generic Data View Component
 *
 * Handles both table and grid rendering with pagination, abstracting away
 * the common logic shared across all entity-specific DataView components.
 */
export function GenericDataView<T>({
  viewMode,
  filteredData,
  tableColumns,
  gridColumns,
  getItemId,
  renderCard,
  onItemClick,
  emptyMessage = "No items found",
  initialPageSize = 12,
  sortable = true,
  striped = true,
  hoverable = true,
}: GenericDataViewProps<T>) {
  // Convert filtered data to typed format
  const typedData = useMemo(
    () => filteredData as unknown as T[],
    [filteredData]
  );

  // Create table rows and grid items
  const { tableRows, gridItems } = useMemo(() => {
    const rows: TableRow<T>[] = typedData.map((item) => ({
      id: getItemId(item),
      data: item,
    }));

    const items: GridItem<T>[] = typedData.map((item) => ({
      id: getItemId(item),
      data: item,
    }));

    return { tableRows: rows, gridItems: items };
  }, [typedData, getItemId]);

  // Pagination
  const pagination = usePagination({
    totalItems: filteredData.length,
    initialPageSize,
  });

  // Paginated data
  const { paginatedRows, paginatedGridItems } = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    return {
      paginatedRows: tableRows.slice(startIndex, endIndex),
      paginatedGridItems: gridItems.slice(startIndex, endIndex),
    };
  }, [tableRows, gridItems, pagination.currentPage, pagination.pageSize]);

  // Handle row/item click
  const handleClick = (id: string | number) => {
    const item = typedData.find((item) => getItemId(item) === id);
    if (item) onItemClick(item);
  };

  return (
    <>
      {viewMode === "list" ? (
        <TableView
          columns={tableColumns as unknown as Column<Record<string, unknown>>[]}
          rows={paginatedRows as unknown as TableRow<Record<string, unknown>>[]}
          sortable={sortable}
          striped={striped}
          hoverable={hoverable}
          emptyMessage={emptyMessage}
          onRowClick={(row) => handleClick(row.id)}
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
          items={
            paginatedGridItems as unknown as GridItem<Record<string, unknown>>[]
          }
          columns={gridColumns as unknown as GridColumn[]}
          renderCard={(gridItem) =>
            renderCard(gridItem.data as unknown as T, () =>
              handleClick(gridItem.id)
            )
          }
          emptyMessage={emptyMessage}
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
}
