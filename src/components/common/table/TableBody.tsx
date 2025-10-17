import { ReactNode } from "react";
import { Column, TableRow } from "../../../types/table";
import { TableRowComponent } from "./TableRowComponent";
import { TableLoadingSkeleton } from "./TableLoadingSkeleton";
import { TableEmptyState } from "./TableEmptyState";

interface TableBodyProps<T> {
  columns: Column<T>[];
  rows: TableRow<T>[];
  loading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string | number>;
  onSelectChange?: (id: string | number, shiftKey: boolean) => void;
  expandable?: boolean;
  expandedIds?: Set<string | number>;
  onExpandChange?: (id: string | number) => void;
  editable?: boolean;
  editingId?: string | number | null;
  onStartEdit?: (id: string | number) => void;
  onSaveEdit?: (id: string | number, columnKey: string, value: unknown) => void;
  onCancelEdit?: () => void;
  striped?: boolean;
  hoverable?: boolean;
  onRowClick?: (row: TableRow<T>) => void;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  emptyAction?: ReactNode;
}

/**
 * Table body component that handles loading, empty state, and row rendering
 */
export const TableBody = <T extends Record<string, unknown>>({
  columns,
  rows,
  loading = false,
  selectable = false,
  selectedIds = new Set(),
  onSelectChange,
  expandable = false,
  expandedIds = new Set(),
  onExpandChange,
  editable = false,
  editingId = null,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  striped = true,
  hoverable = true,
  onRowClick,
  emptyMessage = "No data available",
  emptyIcon,
  emptyAction,
}: TableBodyProps<T>) => {
  return (
    <tbody>
      {loading ? (
        <TableLoadingSkeleton
          columns={columns}
          selectable={selectable}
          expandable={expandable}
        />
      ) : rows.length === 0 ? (
        <TableEmptyState
          columns={columns}
          message={emptyMessage}
          icon={emptyIcon}
          action={emptyAction}
          selectable={selectable}
          expandable={expandable}
        />
      ) : (
        rows.map((row, rowIndex) => (
          <TableRowComponent
            key={row.id}
            row={row}
            rowIndex={rowIndex}
            columns={columns}
            selectable={selectable}
            expandable={expandable}
            editable={editable}
            isSelected={selectedIds.has(row.id)}
            isExpanded={expandedIds.has(row.id)}
            isEditing={editingId === row.id}
            striped={striped}
            hoverable={hoverable}
            onSelectChange={onSelectChange}
            onExpandChange={onExpandChange}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onRowClick={onRowClick}
          />
        ))
      )}
    </tbody>
  );
};
