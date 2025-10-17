import { useState } from "react";
import { TableView, GridView } from "../../../../components/common";

// TODO: Update this interface to match your entity
interface TemplateDataViewProps {
  viewMode: "grid" | "list";
  filteredData: Record<string, unknown>[];
  handleRowClick: (item: Record<string, unknown>) => void;
  tableColumns: any[]; // TODO: Add proper typing
  gridColumns: any[]; // TODO: Add proper typing
  handleStatusToggle: (id: string, status: boolean) => void;
  onEdit: (item: Record<string, unknown>) => void;
  onDelete: (item: Record<string, unknown>) => void;
  onView: (item: Record<string, unknown>) => void;
}

export const TemplateDataView = ({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  gridColumns,
}: Omit<
  TemplateDataViewProps,
  "handleStatusToggle" | "onEdit" | "onDelete" | "onView"
>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  if (viewMode === "grid") {
    return (
      <GridView
        items={currentData.map((item) => ({
          id: String(item.id || ""),
          data: item,
        }))}
        columns={gridColumns}
        onCardClick={handleRowClick}
        loading={false}
        emptyMessage="No templates found" // TODO: Update message
        pagination={{
          currentPage,
          totalPages,
          pageSize,
          totalItems,
          onPageChange: setCurrentPage,
        }}
      />
    );
  }

  return (
    <TableView
      rows={currentData.map((item) => ({
        id: String(item.id || ""),
        data: item,
      }))}
      columns={tableColumns}
      onRowClick={(row) => handleRowClick(row.data)}
      loading={false}
      emptyMessage="No templates found" // TODO: Update message
      pagination={{
        currentPage,
        totalPages,
        pageSize,
        totalItems,
        onPageChange: setCurrentPage,
      }}
      hoverable
    />
  );
};
