/**
 * CRUDTableView Component
 *
 * Displays CRUD data in a traditional table layout with rows and columns.
 */

import type { Column } from "../../../../types/table";

interface CRUDTableViewProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onView?: (item: T) => void;
  onDelete?: (id: string | number) => void;
}

/**
 * Renders data in a table with headers and action buttons
 *
 * @param data - Array of items to display
 * @param columns - Column definitions for the table
 * @param onEdit - Edit button click handler
 * @param onView - Optional view button click handler
 * @param onDelete - Optional delete button click handler
 */
export const CRUDTableView = <T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onView,
  onDelete,
}: CRUDTableViewProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(
                        column.accessor
                          ? typeof column.accessor === "function"
                            ? column.accessor(item)
                            : item[column.accessor]
                          : item[column.key as keyof T],
                        item,
                        0
                      )
                    : column.accessor
                    ? typeof column.accessor === "function"
                      ? column.accessor(item)
                      : String(item[column.accessor])
                    : String(item[column.key as keyof T])}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  {onView && (
                    <button
                      onClick={() => onView(item)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      View
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
