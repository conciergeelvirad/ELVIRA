import { ShoppingBag } from "lucide-react";
import { Column, GridColumn } from "../../../../../types/table";
import {
  UnifiedToggle,
  ActionButtonGroup,
} from "../../../../../components/common";
import { Product } from "../../../../../hooks/queries/hotel-management/products";
import { CRUDModalActions, CRUDFormActions } from "../../../../../hooks";

type EnhancedProduct = Product & Record<string, unknown>;

// Helper function to convert Product to EnhancedProduct
export const enhanceProduct = (product: Product): EnhancedProduct => {
  return product as unknown as EnhancedProduct;
};

interface GetColumnsOptions {
  handleStatusToggle: (id: string, newStatus: boolean) => void;
  modalActions: CRUDModalActions<EnhancedProduct>;
  formActions: CRUDFormActions;
}

export const getTableColumns = ({
  handleStatusToggle,
  modalActions,
  formActions,
}: GetColumnsOptions): Column<Product>[] => {
  return [
    {
      key: "name",
      header: "PRODUCT NAME",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "CATEGORY",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {value}
        </span>
      ),
    },
    {
      key: "price",
      header: "PRICE",
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-green-600">
          ${typeof value === "number" ? value.toFixed(2) : "0.00"}
        </span>
      ),
    },
    {
      key: "stock_quantity",
      header: "STOCK",
      sortable: true,
      render: (value) => {
        const quantity = typeof value === "number" ? value : 0;
        const isLowStock = quantity < 10;
        return (
          <span
            className={`font-medium ${
              isLowStock ? "text-red-600" : "text-gray-900"
            }`}
          >
            {quantity}
          </span>
        );
      },
    },
    {
      key: "is_active",
      header: "ACTIVE",
      sortable: true,
      render: (value, product) => (
        <div onClick={(e) => e.stopPropagation()}>
          <UnifiedToggle
            checked={value === true}
            onChange={(checked) => handleStatusToggle(product.id, checked)}
            variant="compact"
            size="sm"
          />
        </div>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      render: (_, product) => (
        <ActionButtonGroup
          actions={[
            {
              type: "edit",
              onClick: (e) => {
                e.stopPropagation();
                formActions.setFormData({
                  name: product.name,
                  description: product.description,
                  category: product.category,
                  price: product.price,
                  stock_quantity: product.stock_quantity,
                  image_url: product.image_url,
                });
                modalActions.openEditModal(enhanceProduct(product));
              },
            },
            {
              type: "delete",
              onClick: (e) => {
                e.stopPropagation();
                modalActions.openDeleteModal(enhanceProduct(product));
              },
              variant: "danger",
            },
          ]}
          size="sm"
          compact
        />
      ),
    },
  ];
};

export const getGridColumns = ({
  handleStatusToggle,
}: Pick<GetColumnsOptions, "handleStatusToggle">): GridColumn[] => {
  return [
    {
      key: "name",
      label: "Product Name",
      accessor: "name",
    },
    {
      key: "category",
      label: "Category",
      accessor: "category",
    },
    {
      key: "price",
      label: "Price",
      accessor: "price",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "stock_quantity",
      label: "Stock",
      accessor: "stock_quantity",
    },
    {
      key: "is_active",
      label: "Active",
      accessor: "is_active",
      render: (value: boolean, item: Product) => (
        <UnifiedToggle
          checked={value}
          onChange={(checked) => handleStatusToggle(item.id, checked)}
          variant="compact"
          size="sm"
        />
      ),
    },
  ];
};

// Detail fields for the modal
export const getDetailFields = (product: Product) => [
  { label: "Product Name", value: product.name },
  { label: "Description", value: product.description || "N/A" },
  { label: "Category", value: product.category },
  { label: "Price", value: `$${product.price.toFixed(2)}` },
  {
    label: "Stock Quantity",
    value: product.stock_quantity?.toString() || "0",
  },
  { label: "Active", value: product.is_active ? "Yes" : "No" },
  {
    label: "Created",
    value: product.created_at
      ? new Date(product.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A",
  },
];
