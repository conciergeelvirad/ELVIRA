import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../../utils';
import { Column } from '../../../types/table';
import { CHECKBOX_STYLES, TABLE_CELL_PADDING } from '../../../constants/styles';

interface TableHeaderProps<T> {
  columns: Column<T>[];
  selectable?: boolean;
  expandable?: boolean;
  sortable?: boolean;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  onSortChange?: (key: string) => void;
  allSelected?: boolean;
  someSelected?: boolean;
  onSelectAll?: () => void;
}

export const TableHeader = <T extends Record<string, any>>({
  columns,
  selectable,
  expandable,
  sortable,
  sortConfig,
  onSortChange,
  allSelected,
  someSelected,
  onSelectAll,
}: TableHeaderProps<T>) => {
  const renderSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronsUpDown size={14} className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} className="text-gray-700" />
    ) : (
      <ChevronDown size={14} className="text-gray-700" />
    );
  };

  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        {selectable && (
          <th className={cn(TABLE_CELL_PADDING, 'text-left w-12')}>
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = someSelected || false;
                }
              }}
              onChange={onSelectAll}
              className={CHECKBOX_STYLES}
            />
          </th>
        )}
        {expandable && <th className={cn(TABLE_CELL_PADDING, 'w-12')} />}
        {columns.map((column) => (
          <th
            key={column.key}
            className={cn(
              TABLE_CELL_PADDING,
              'text-left text-xs font-semibold text-gray-700 uppercase tracking-wider',
              column.width && `w-${column.width}`
            )}
          >
            {sortable && column.sortable !== false ? (
              <button
                onClick={() => onSortChange?.(column.key)}
                className="flex items-center gap-2 hover:text-gray-900 transition-colors group"
              >
                <span>{column.header}</span>
                {renderSortIcon(column.key)}
              </button>
            ) : (
              column.header
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};
