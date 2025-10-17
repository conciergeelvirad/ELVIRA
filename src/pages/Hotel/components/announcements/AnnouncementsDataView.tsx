import React from "react";
import { usePagination } from "../../../../hooks";
import { TableView, GridView } from "../../../../components/common";
import {
  Column,
  TableRow,
  GridItem,
  GridColumn,
} from "../../../../types/table";
import { Announcement } from "../../../../hooks/queries/hotel-management/announcements";
import { AnnouncementCard } from "../../../../components/announcements";

interface AnnouncementsDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (announcement: Announcement) => void;
  tableColumns: Column<Announcement>[];
  gridColumns: GridColumn[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
}

export const AnnouncementsDataView: React.FC<AnnouncementsDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  gridColumns,
  onEdit,
  onDelete,
}) => {
  // Convert filtered data to typed format
  const filteredAnnouncementsWithTypes =
    filteredData as unknown as Announcement[];

  // Create table rows and grid items
  const tableRows: TableRow<Announcement>[] =
    filteredAnnouncementsWithTypes.map((announcement) => ({
      id: announcement.id,
      data: announcement,
    }));

  const gridItems: GridItem<Announcement>[] =
    filteredAnnouncementsWithTypes.map((announcement) => ({
      id: announcement.id,
      data: announcement,
    }));

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

  const paginatedRows = getPaginatedData(tableRows) as TableRow<Announcement>[];

  const paginatedGridItems = getPaginatedData(
    gridItems
  ) as GridItem<Announcement>[];

  return (
    <>
      {viewMode === "list" ? (
        <TableView
          columns={tableColumns as unknown as Column<Record<string, unknown>>[]}
          rows={paginatedRows as unknown as TableRow<Record<string, unknown>>[]}
          sortable
          striped
          hoverable
          emptyMessage="No announcements found"
          onRowClick={(row) => {
            const announcement = filteredAnnouncementsWithTypes.find(
              (a) => a.id === row.id
            );
            if (announcement) handleRowClick(announcement);
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
            const announcement = gridItem.data;
            return (
              <AnnouncementCard
                announcement={announcement}
                onEdit={() => onEdit(announcement)}
                onDelete={() => onDelete(announcement)}
              />
            );
          }}
          emptyMessage="No announcements found"
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
