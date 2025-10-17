import { ChevronDown, ChevronUp } from "lucide-react";
import { cn, getValueByAccessor } from "../../../utils";
import { GridItem, GridColumn } from "../../../types/table";
import { EditableField } from "../data-display/EditableField";
import {
  CHECKBOX_STYLES_LARGE,
  CARD_PADDING,
  BUTTON_LINK,
} from "../../../constants/styles";

interface DefaultGridCardProps<T> {
  item: GridItem<T>;
  columns: GridColumn[];
  isSelected: boolean;
  isExpanded: boolean;
  isEditing: boolean;
  selectable?: boolean;
  expandable?: boolean;
  editable?: boolean;
  onSelectChange?: (id: string | number) => void;
  onExpandChange?: (id: string | number) => void;
  onStartEdit?: (id: string | number) => void;
  onSaveEdit?: (id: string | number, columnKey: string, value: any) => void;
  onCancelEdit?: () => void;
  onCardClick?: (item: GridItem<T>) => void;
}

export const DefaultGridCard = <T extends Record<string, any>>({
  item,
  columns,
  isSelected,
  isExpanded,
  isEditing,
  selectable,
  expandable,
  editable,
  onSelectChange,
  onExpandChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onCardClick,
}: DefaultGridCardProps<T>) => {
  return (
    <div
      className={cn(
        "relative bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 overflow-hidden group",
        isSelected && "ring-2 ring-blue-500",
        onCardClick && "cursor-pointer"
      )}
      onClick={() => onCardClick?.(item)}
    >
      {selectable && (
        <div
          className="absolute top-3 right-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectChange?.(item.id)}
            className={CHECKBOX_STYLES_LARGE}
          />
        </div>
      )}

      <div className={CARD_PADDING}>
        <div className="space-y-4">
          {columns.map((column) => {
            const value = getValueByAccessor(
              item.data,
              column.accessor,
              column.key
            );
            const isColumnEditable =
              editable && item.editable !== false && column.editable !== false;

            return (
              <div key={column.key}>
                {isColumnEditable && isEditing ? (
                  <EditableField
                    label={column.label}
                    value={value}
                    isEditing={true}
                    onSave={(newValue) =>
                      onSaveEdit?.(item.id, column.key, newValue)
                    }
                    onCancel={() => onCancelEdit?.()}
                  />
                ) : (
                  <div>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                      {column.label}
                    </div>
                    <div className="text-sm text-gray-900">
                      {column.render
                        ? column.render(value, item.data)
                        : value ?? "-"}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {expandable && item.expandedContent && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpandChange?.(item.id);
              }}
              className={cn("flex items-center gap-2", BUTTON_LINK)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={16} />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  <span>Show More</span>
                </>
              )}
            </button>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-100 animate-slideDown">
                {item.expandedContent}
              </div>
            )}
          </div>
        )}

        {editable && item.editable !== false && !isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit?.(item.id);
              }}
              className={BUTTON_LINK}
            >
              Edit
            </button>
          </div>
        )}

        {isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelEdit?.();
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
