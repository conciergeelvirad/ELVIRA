import React from "react";
import { GenericDataView } from "../../../../../components/common/data-display";
import { Column, GridColumn } from "../../../../../types/table";
import { Product } from "../../../../../hooks/queries/hotel-management/products";
import { ProductCard } from "../shared";

interface ProductsDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (product: Product) => void;
  tableColumns: Column<Product>[];
  gridColumns: GridColumn[];
  handleStatusToggle?: (id: string, checked: boolean) => void;
  handleRecommendedToggle?: (id: string, newValue: boolean) => Promise<void>;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView?: (product: Product) => void;
  currency?: string;
}

/**
 * Products Data View Component
 *
 * Displays hotel shop products in table or grid view using GenericDataView.
 * Handles product listing, pagination, and CRUD operations.
 */
export const ProductsDataView: React.FC<ProductsDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  gridColumns,
  onEdit,
  onDelete,
  handleRecommendedToggle,
  currency,
}) => {
  return (
    <GenericDataView<Product>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      getItemId={(product) => product.id}
      renderCard={(product, onClick) => (
        <ProductCard
          product={product}
          onClick={onClick}
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product)}
          onRecommendedToggle={handleRecommendedToggle}
          currency={currency}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No products found"
    />
  );
};
