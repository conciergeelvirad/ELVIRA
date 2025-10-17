import { ReactNode } from "react";
import { calculateTableColSpan } from "../../../utils/ui/layout/table";
import { Column } from "../../../types/table";

interface TableEmptyStateProps<T> {
  columns: Column<T>[];
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  selectable?: boolean;
  expandable?: boolean;
  actionsColumn?: boolean;
}

/**
 * Empty state component for tables
 */
export const TableEmptyState = <T extends Record<string, unknown>>({
  columns,
  message = "No data available",
  icon,
  action,
  selectable = false,
  expandable = false,
  actionsColumn = false,
}: TableEmptyStateProps<T>) => {
  const colSpan = calculateTableColSpan({
    columnsLength: columns.length,
    selectable,
    expandable,
    actionsColumn,
  });

  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          {icon && <div className="text-gray-400">{icon}</div>}
          <p className="text-gray-500">{message}</p>
          {action && <div>{action}</div>}
        </div>
      </td>
    </tr>
  );
};
