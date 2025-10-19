import { ShoppingBag } from "lucide-react";
import { Column, GridColumn } from "../../../../../types/table";
import { ItemWithImage, StatusBadge } from "../../../../../components/common";
import { Product } from "../../../../../hooks/queries/hotel-management/products";

type EnhancedProduct = Product & Record<string, unknown>;

// Helper function to convert Product to EnhancedProduct
export const enhanceProduct = (product: Product): EnhancedProduct => {
  return product as unknown as EnhancedProduct;
};

interface GetColumnsOptions {
  handleStatusToggle: (id: string, newStatus: boolean) => void;
  currency?: string;
}

export const getTableColumns = ({
  handleStatusToggle,
  currency = "$",
}: GetColumnsOptions): Column<Product>[] => {
  return [
    {
      key: "product",
      header: "PRODUCT",
      sortable: true,
      render: (_value, product) => (
        <ItemWithImage
          imageUrl={product.image_url}
          title={product.name}
          description={product.description}
          fallbackIcon={<ShoppingBag className="w-5 h-5" />}
          isRecommended={product.recommended}
          badge={product.mini_bar ? "MINI BAR" : undefined}
        />
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
          {currency}
          {typeof value === "number" ? value.toFixed(2) : "0.00"}
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
      header: "STATUS",
      sortable: true,
      render: (value, product) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            console.log("🖱️ PRODUCT STATUS BADGE CLICKED:", {
              productId: product.id,
              currentStatus: value,
              newStatus: !value,
              product: product.name,
            });
            handleStatusToggle(product.id, !value);
          }}
          className="cursor-pointer"
        >
          <StatusBadge status={value ? "active" : "inactive"} size="sm" />
        </div>
      ),
    },
  ];
};

export const getGridColumns = ({
  handleStatusToggle,
  currency = "$",
}: GetColumnsOptions): GridColumn[] => {
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
      render: (value: number) => `${currency}${value.toFixed(2)}`,
    },
    {
      key: "stock_quantity",
      label: "Stock",
      accessor: "stock_quantity",
    },
    {
      key: "is_active",
      label: "Status",
      accessor: "is_active",
      render: (value: boolean, item: Product) => (
        <div
          onClick={async (e) => {
            e.stopPropagation();
            console.log("🖱️ STATUS BADGE CLICKED (Product Grid):", {
              productId: item.id,
              productName: item.name,
              currentValue: value,
              newValue: !value,
            });
            try {
              await handleStatusToggle(item.id, !value);
            } catch (error) {
              console.error("❌ Status toggle failed:", error);
            }
          }}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={value ? "active" : "inactive"} size="sm" />
        </div>
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
  {
    label: "Status",
    value: (
      <StatusBadge
        status={product.is_active ? "active" : "inactive"}
        size="sm"
      />
    ),
  },
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
