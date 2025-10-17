import { ReactNode } from "react";
import { GridItem, GridColumn } from "../../../types/table";
import { GridContainer } from "./GridContainer";
import { DefaultGridCard } from "./DefaultGridCard";
import { GridColumns, GridGap } from "../../../utils/ui/layout/grid";

interface GridContentProps<T> {
  items: GridItem<T>[];
  columns: GridColumn[];
  renderCard?: (item: GridItem<T>, index: number) => ReactNode;
  gridCols?: GridColumns;
  gap?: GridGap;
  className?: string;

  // State props
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

  onCardClick?: (item: GridItem<T>) => void;
}

/**
 * Grid content component that renders items in a grid layout
 */
export const GridContent = <T extends Record<string, unknown>>({
  items,
  columns,
  renderCard,
  gridCols = 4,
  gap = "md",
  className,

  // State props
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

  onCardClick,
}: GridContentProps<T>) => {
  return (
    <GridContainer columns={gridCols} gap={gap} className={className}>
      {items.map((item, index) =>
        renderCard ? (
          <div key={item.id}>{renderCard(item, index)}</div>
        ) : (
          <DefaultGridCard
            key={item.id}
            item={item}
            columns={columns}
            isSelected={selectedIds.has(item.id)}
            isExpanded={expandedIds.has(item.id)}
            isEditing={editingId === item.id}
            selectable={selectable}
            expandable={expandable}
            editable={editable}
            onSelectChange={onSelectChange}
            onExpandChange={onExpandChange}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onCardClick={onCardClick}
          />
        )
      )}
    </GridContainer>
  );
};
