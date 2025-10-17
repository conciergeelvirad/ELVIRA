import { ReactNode } from "react";
import { Column, TableRow } from "../../../types/table";
import { Pagination } from "../ui/Pagination";
import { TableHeader } from "../table/TableHeader";
import { TableBody } from "../table/TableBody";
import { TableContainer } from "../table/TableContainer";

interface TableViewProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  rows: TableRow<T>[];
  selectable?: boolean;
  selectedIds?: Set<string | number>;
  onSelectChange?: (id: string | number) => void;
  onSelectAll?: (ids: (string | number)[]) => void;
  expandable?: boolean;
  expandedIds?: Set<string | number>;
  onExpandChange?: (id: string | number) => void;
  editable?: boolean;
  editingId?: string | number | null;
  onStartEdit?: (id: string | number) => void;
  onSaveEdit?: (id: string | number, columnKey: string, value: unknown) => void;
  onCancelEdit?: () => void;
  sortable?: boolean;
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
  onSortChange?: (key: string) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  emptyAction?: ReactNode;
  loading?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  onRowClick?: (row: TableRow<T>) => void;
}

export const TableView = <T extends Record<string, unknown>>({
  columns,
  rows,
  selectable = false,
  selectedIds = new Set(),
  onSelectChange,
  onSelectAll,
  expandable = false,
  expandedIds = new Set(),
  onExpandChange,
  editable = false,
  editingId = null,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  sortable = false,
  sortConfig = null,
  onSortChange,
  pagination,
  emptyMessage = "No data available",
  emptyIcon,
  emptyAction,
  loading = false,
  striped = true,
  hoverable = true,
  className,
  onRowClick,
}: TableViewProps<T>) => {
  // Calculate selection state
  const allSelected =
    rows.length > 0 && rows.every((row) => selectedIds.has(row.id));
  const someSelected =
    rows.some((row) => selectedIds.has(row.id)) && !allSelected;

  // Handle select all
  const handleSelectAll = () => {
    if (onSelectAll) {
      if (allSelected) {
        onSelectAll([]);
      } else {
        onSelectAll(rows.map((row) => row.id));
      }
    }
  };

  // Handle row selection
  const handleRowSelect = (id: string | number) => {
    if (!onSelectChange) return;
    onSelectChange(id);
  };

  const hasPagination = pagination && rows.length > 0;

  return (
    <div className="flex flex-col">
      <TableContainer className={hasPagination ? "rounded-b-none" : className}>
        <TableHeader
          columns={columns}
          selectable={selectable}
          expandable={expandable}
          sortable={sortable}
          sortConfig={sortConfig}
          onSortChange={onSortChange}
          allSelected={allSelected}
          someSelected={someSelected}
          onSelectAll={handleSelectAll}
        />
        <TableBody
          columns={columns}
          rows={rows}
          loading={loading}
          selectable={selectable}
          selectedIds={selectedIds}
          onSelectChange={handleRowSelect}
          expandable={expandable}
          expandedIds={expandedIds}
          onExpandChange={onExpandChange}
          editable={editable}
          editingId={editingId}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          striped={striped}
          hoverable={hoverable}
          onRowClick={onRowClick}
          emptyMessage={emptyMessage}
          emptyIcon={emptyIcon}
          emptyAction={emptyAction}
        />
      </TableContainer>

      {hasPagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          className="rounded-b-xl shadow border-t-0"
        />
      )}
    </div>
  );
};
