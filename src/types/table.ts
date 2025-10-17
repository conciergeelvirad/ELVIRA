import { ReactNode } from 'react';

export interface Column<T = any> {
  key: string;
  header: string;
  accessor?: keyof T | ((item: T) => any);
  sortable?: boolean;
  width?: string;
  render?: (value: any, item: T, index: number) => ReactNode;
}

export interface TableRow<T = any> {
  id: string | number;
  data: T;
  expandedContent?: ReactNode;
  editable?: boolean;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface SelectionConfig {
  selectedIds: Set<string | number>;
  onSelect: (id: string | number) => void;
  onSelectAll: (ids: (string | number)[]) => void;
  onClearAll: () => void;
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface ExpandedConfig {
  expandedIds: Set<string | number>;
  onToggle: (id: string | number) => void;
  singleExpand?: boolean;
}

export interface EditConfig {
  editingId: string | number | null;
  onStartEdit: (id: string | number) => void;
  onSaveEdit: (id: string | number, data: any) => void;
  onCancelEdit: () => void;
}

export interface GridItem<T = any> {
  id: string | number;
  data: T;
  expandedContent?: ReactNode;
  editable?: boolean;
}

export interface GridColumn {
  key: string;
  label: string;
  accessor?: string | ((item: any) => any);
  editable?: boolean;
  render?: (value: any, item: any) => ReactNode;
}
