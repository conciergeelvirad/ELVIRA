/**
 * CRUDGridView Component
 *
 * Displays CRUD data in a responsive grid layout with cards.
 */

import type { Column } from "../../../../types/table";

interface CRUDGridViewProps<T> {
  data: T[];
  columns: Column<T>[];
  gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
  onEdit: (item: T) => void;
  onView?: (item: T) => void;
  onDelete?: (id: string | number) => void;
}

/**
 * Renders data in a grid of cards
 *
 * @param data - Array of items to display
 * @param columns - Column definitions (first 3 used in cards)
 * @param gridCols - Number of grid columns (default: 3)
 * @param onEdit - Edit button click handler
 * @param onView - Optional view button click handler
 * @param onDelete - Optional delete button click handler
 */
export const CRUDGridView = <T extends { id: string | number }>({
  data,
  columns,
  gridCols = 3,
  onEdit,
  onView,
  onDelete,
}: CRUDGridViewProps<T>) => {
  return (
    <div className="p-6">
      <div className={`grid gap-4 grid-cols-${gridCols}`}>
        {data.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="space-y-2">
              {columns.slice(0, 3).map((column) => (
                <div key={column.key}>
                  <span className="text-sm font-medium text-gray-600">
                    {column.header}:
                  </span>
                  <span className="text-sm text-gray-900 ml-2">
                    {column.accessor
                      ? typeof column.accessor === "function"
                        ? column.accessor(item)
                        : String(item[column.accessor])
                      : String(item[column.key as keyof T])}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              {onView && (
                <button
                  onClick={() => onView(item)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  View
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
