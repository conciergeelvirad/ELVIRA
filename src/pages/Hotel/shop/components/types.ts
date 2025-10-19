import type { Column, GridColumn } from "../../../../types/table";
import type { Product } from "../../../../hooks/queries/hotel-management/products";
import type { ShopOrder } from "../../../../hooks/queries/hotel-management/shop-orders";

// Common Types
export type CRUDModalActions<T> = {
  openCreateModal: () => void;
  openEditModal: (item: T) => void;
  openDeleteModal: (item: T) => void;
  openDetailModal: (item: T) => void;
  closeModal: () => void;
};

export type CRUDFormActions = {
  setFormData: (data: Record<string, unknown>) => void;
  resetForm: () => void;
};

export type CRUDState = {
  isOpen: boolean;
  mode: "create" | "edit" | "delete" | "detail";
  itemToEdit: Record<string, unknown> | null;
  itemToDelete: Record<string, unknown> | null;
  itemToView: Record<string, unknown> | null;
};

export type FormState = {
  data: Record<string, unknown>;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
};

// Product Types
export type EnhancedProduct = Product & Record<string, unknown>;

export interface ProductColumnsOptions {
  handleStatusToggle: (id: string, checked: boolean) => void;
  modalActions?: CRUDModalActions<EnhancedProduct>;
  formActions?: CRUDFormActions;
}

export interface ProductsDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (product: Product) => void;
  tableColumns: Column<Product>[];
  gridColumns: GridColumn[];
  handleStatusToggle: (id: string, checked: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

// Order Types
export type EnhancedShopOrder = ShopOrder & Record<string, unknown>;

export interface ShopOrderColumnsOptions {
  handleStatusToggle: (id: string, checked: boolean) => void;
  modalActions?: CRUDModalActions<EnhancedShopOrder>;
  formActions?: CRUDFormActions;
}

export interface ShopOrdersDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (order: ShopOrder) => void;
  tableColumns: Column<ShopOrder>[];
  gridColumns: GridColumn[];
  onEdit: (order: ShopOrder) => void;
  onDelete: (order: ShopOrder) => void;
  onView: (order: ShopOrder) => void;
}
