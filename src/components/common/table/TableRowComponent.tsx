import { ChevronRight } from "lucide-react";
import { cn, getValueByAccessor } from "../../../utils";
import { Column, TableRow } from "../../../types/table";
import { EditableCell } from "../data-display/EditableCell";
import { CHECKBOX_STYLES, TABLE_CELL_PADDING } from "../../../constants/styles";

interface TableRowComponentProps<T> {
  row: TableRow<T>;
  rowIndex: number;
  columns: Column<T>[];
  selectable?: boolean;
  expandable?: boolean;
  editable?: boolean;
  isSelected: boolean;
  isExpanded: boolean;
  isEditing: boolean;
  striped?: boolean;
  hoverable?: boolean;
  onSelectChange?: (id: string | number, shiftKey: boolean) => void;
  onExpandChange?: (id: string | number) => void;
  onStartEdit?: (id: string | number) => void;
  onSaveEdit?: (id: string | number, columnKey: string, value: unknown) => void;
  onCancelEdit?: () => void;
  onRowClick?: (row: TableRow<T>) => void;
}

export const TableRowComponent = <T extends Record<string, unknown>>({
  row,
  rowIndex,
  columns,
  selectable,
  expandable,
  editable,
  isSelected,
  isExpanded,
  isEditing,
  striped,
  hoverable,
  onSelectChange,
  onExpandChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRowClick,
}: TableRowComponentProps<T>) => {
  return (
    <>
      <tr
        className={cn(
          "border-b border-gray-200 transition-colors",
          striped && rowIndex % 2 === 1 && "bg-gray-50",
          hoverable && "hover:bg-gray-100",
          isSelected && "bg-blue-50 hover:bg-blue-100",
          onRowClick && "cursor-pointer"
        )}
        onClick={() => onRowClick?.(row)}
      >
        {selectable && (
          <td
            className={TABLE_CELL_PADDING}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}} // Empty handler for controlled input
              onClick={(e) => onSelectChange?.(row.id, e.shiftKey)}
              className={CHECKBOX_STYLES}
            />
          </td>
        )}
        {expandable && (
          <td
            className={TABLE_CELL_PADDING}
            onClick={(e) => e.stopPropagation()}
          >
            {row.expandedContent && (
              <button
                onClick={() => onExpandChange?.(row.id)}
                className="p-1 hover:bg-gray-200 rounded transition-all"
                aria-label={isExpanded ? "Collapse row" : "Expand row"}
              >
                <ChevronRight
                  size={16}
                  className={cn(
                    "transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )}
                />
              </button>
            )}
          </td>
        )}
        {columns.map((column) => {
          const cellValue = getValueByAccessor(
            row.data,
            column.accessor,
            column.key
          );
          const isColumnEditable = editable && row.editable !== false;

          return (
            <td
              key={column.key}
              onClick={(e) => {
                if (isColumnEditable && !isEditing) {
                  e.stopPropagation();
                  onStartEdit?.(row.id);
                }
              }}
              className={cn(isColumnEditable && !isEditing && "cursor-pointer")}
            >
              {isColumnEditable && isEditing ? (
                <EditableCell
                  value={cellValue}
                  isEditing={true}
                  onSave={(value) => onSaveEdit?.(row.id, column.key, value)}
                  onCancel={() => onCancelEdit?.()}
                />
              ) : column.render ? (
                <div className={TABLE_CELL_PADDING}>
                  {column.render(cellValue, row.data, rowIndex)}
                </div>
              ) : (
                <div
                  className={cn(TABLE_CELL_PADDING, "text-sm text-gray-900")}
                >
                  {cellValue ?? "-"}
                </div>
              )}
            </td>
          );
        })}
      </tr>
      {isExpanded && row.expandedContent && (
        <tr className="bg-gray-50">
          <td
            colSpan={
              columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)
            }
            className={TABLE_CELL_PADDING}
          >
            <div className="animate-slideDown">{row.expandedContent}</div>
          </td>
        </tr>
      )}
    </>
  );
};
