import React from "react";
import { usePagination } from "../../../../hooks";
import { TableView, GridView } from "../../../../components/common";
import {
  Column,
  TableRow,
  GridItem,
  GridColumn,
} from "../../../../types/table";
import {
  GenericDataView,
  GenericCard,
} from "../../../../components/common/data-display";
import { getTableColumns, getGridColumns } from "./EmergencyContactColumns";
import type { EmergencyContact } from "../../../../hooks/queries/hotel-management/emergency-contacts";
import { EmergencyContactCard } from "./EmergencyContactCard";

interface EmergencyContactsDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (contact: EmergencyContact) => void;
  tableColumns: Column<EmergencyContact>[];
  gridColumns: GridColumn[];
  handleStatusToggle: (id: string, checked: boolean) => void;
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (contact: EmergencyContact) => void;
  onView: (contact: EmergencyContact) => void;
}

export const EmergencyContactsDataView: React.FC<
  EmergencyContactsDataViewProps
> = ({
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
  // Convert filtered data to typed format
  const filteredContactsWithTypes =
    filteredData as unknown as EmergencyContact[];

  // Create table rows and grid items
  const tableRows: TableRow<EmergencyContact>[] = filteredContactsWithTypes.map(
    (contact) => ({
      id: contact.id,
      data: contact,
    })
  );

  const gridItems: GridItem<EmergencyContact>[] = filteredContactsWithTypes.map(
    (contact) => ({
      id: contact.id,
      data: contact,
    })
  );

  // Pagination
  const pagination = usePagination({
    totalItems: filteredData.length,
    initialPageSize: 10,
  });

  // Paginated data helper
  const getPaginatedData = (items: unknown[]) =>
    items.slice(
      (pagination.currentPage - 1) * pagination.pageSize,
      pagination.currentPage * pagination.pageSize
    );

  const paginatedRows = getPaginatedData(
    tableRows
  ) as TableRow<EmergencyContact>[];

  const paginatedGridItems = getPaginatedData(
    gridItems
  ) as GridItem<EmergencyContact>[];

  return (
    <>
      {viewMode === "list" ? (
        <TableView
          columns={tableColumns as unknown as Column<Record<string, unknown>>[]}
          rows={paginatedRows as unknown as TableRow<Record<string, unknown>>[]}
          sortable
          striped
          hoverable
          emptyMessage="No emergency contacts found"
          onRowClick={(row) => {
            const contact = filteredContactsWithTypes.find(
              (c) => c.id === row.id
            );
            if (contact) handleRowClick(contact);
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
          items={
            paginatedGridItems as unknown as GridItem<Record<string, unknown>>[]
          }
          columns={gridColumns as unknown as GridColumn[]}
          gridCols={4}
          gap="md"
          emptyMessage="No emergency contacts found"
          renderCard={(item) => (
            <EmergencyContactCard
              key={item.id}
              contact={item.data as unknown as EmergencyContact}
              onStatusToggle={handleStatusToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onClick={() => {
                const contact = item.data as unknown as EmergencyContact;
                handleRowClick(contact);
              }}
            />
          )}
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
