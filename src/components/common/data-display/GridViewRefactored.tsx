import { ReactNode } from "react";
import { cn } from "../../../utils";
import { GridItem, GridColumn } from "../../../types/table";
import { GridColumns, GridGap } from "../../../utils/ui/layout/grid";
import { Pagination } from "../ui/Pagination";
import { GridLoadingState } from "../grid/GridLoadingState";
import { GridEmptyState } from "../grid/GridEmptyState";
import { GridContent } from "../grid/GridContent";

interface GridViewProps<T = Record<string, unknown>> {
  items: GridItem<T>[];
  columns: GridColumn[];
  renderCard?: (item: GridItem<T>, index: number) => ReactNode;
  selectable?: boolean;
  selectedIds?: Set<string | number>;
  onSelectChange?: (id: string | number) => void;
  expandable?: boolean;
  expandedIds?: Set<string | number>;
  onExpandChange?: (id: string | number) => void;
  editable?: boolean;
  editingId?: string | number | null;
  onStartEdit?: (id: string | number) => void;
  onSaveEdit?: (id: string | number, columnKey: string, value: unknown) => void;
  onCancelEdit?: () => void;
  gridCols?: GridColumns;
  gap?: GridGap;
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
  className?: string;
  onCardClick?: (item: GridItem<T>) => void;
}

export const GridView = <T extends Record<string, unknown>>({
  items,
  columns,
  renderCard,
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
  gridCols = 4,
  gap = "md",
  pagination,
  emptyMessage = "No items available",
  emptyIcon,
  emptyAction,
  loading = false,
  className,
  onCardClick,
}: GridViewProps<T>) => {
  return (
    <div className={cn("flex flex-col", className)}>
      {loading ? (
        <GridLoadingState columns={gridCols} gap={gap} />
      ) : items.length === 0 ? (
        <GridEmptyState
          message={emptyMessage}
          icon={emptyIcon}
          action={emptyAction}
        />
      ) : (
        <GridContent
          items={items}
          columns={columns}
          renderCard={renderCard}
          gridCols={gridCols}
          gap={gap}
          selectable={selectable}
          selectedIds={selectedIds}
          onSelectChange={onSelectChange}
          expandable={expandable}
          expandedIds={expandedIds}
          onExpandChange={onExpandChange}
          editable={editable}
          editingId={editingId}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onCardClick={onCardClick}
        />
      )}

      {pagination && items.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};
