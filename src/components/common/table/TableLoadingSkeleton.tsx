import { Column } from '../../../types/table';
import { SKELETON_BASE, TABLE_CELL_PADDING } from '../../../constants/styles';

interface TableLoadingSkeletonProps<T> {
  columns: Column<T>[];
  selectable?: boolean;
  expandable?: boolean;
  rows?: number;
}

export const TableLoadingSkeleton = <T extends Record<string, any>>({
  columns,
  selectable,
  expandable,
  rows = 5,
}: TableLoadingSkeletonProps<T>) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={`skeleton-${index}`} className="border-b border-gray-200">
          {selectable && (
            <td className={TABLE_CELL_PADDING}>
              <div className={`w-4 h-4 ${SKELETON_BASE}`} />
            </td>
          )}
          {expandable && (
            <td className={TABLE_CELL_PADDING}>
              <div className={`w-4 h-4 ${SKELETON_BASE}`} />
            </td>
          )}
          {columns.map((column) => (
            <td key={column.key} className={TABLE_CELL_PADDING}>
              <div className={`h-4 ${SKELETON_BASE}`} style={{ width: '80%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
