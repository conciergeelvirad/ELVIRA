import React from "react";
import { usePagination } from "../../../../../hooks";
import { TableView, GridView } from "../../../../../components/common";
import {
  Column,
  TableRow,
  GridItem,
  GridColumn,
} from "../../../../../types/table";
import { Product } from "../../../../../hooks/queries/hotel-management/products";
import { ProductCard } from "../../../../../components/shop";

interface ProductsDataViewProps {
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

export const ProductsDataView: React.FC<ProductsDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  tableColumns,
  gridColumns,
  handleStatusToggle,
  onEdit,
  onDelete,
  onView,
}) => {
  // Convert filtered data to typed format
  const filteredProductsWithTypes = filteredData as unknown as Product[];

  // Create table rows and grid items
  const tableRows: TableRow<Product>[] = filteredProductsWithTypes.map(
    (product) => ({
      id: product.id,
      data: product,
    })
  );

  const gridItems: GridItem<Product>[] = filteredProductsWithTypes.map(
    (product) => ({
      id: product.id,
      data: product,
    })
  );

  // Pagination
  const pagination = usePagination({
    totalItems: filteredData.length,
    initialPageSize: 12,
  });

  // Paginated data helper
  const getPaginatedData = (items: unknown[]) =>
    items.slice(
      (pagination.currentPage - 1) * pagination.pageSize,
      pagination.currentPage * pagination.pageSize
    );

  const paginatedRows = getPaginatedData(tableRows) as TableRow<Product>[];

  const paginatedGridItems = getPaginatedData(gridItems) as GridItem<Product>[];

  return (
    <>
      {viewMode === "list" ? (
        <TableView
          columns={tableColumns as unknown as Column<Record<string, unknown>>[]}
          rows={paginatedRows as unknown as TableRow<Record<string, unknown>>[]}
          sortable
          striped
          hoverable
          emptyMessage="No products found"
          onRowClick={(row) => {
            const product = filteredProductsWithTypes.find(
              (p) => p.id === row.id
            );
            if (product) handleRowClick(product);
          }}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            pageSize: pagination.pageSize,
            totalItems: tableRows.length,
            onPageChange: pagination.goToPage,
            onPageSizeChange: pagination.setPageSize,
          }}
        />
      ) : (
        <GridView
          items={paginatedGridItems}
          columns={gridColumns}
          renderCard={(gridItem) => {
            const product = gridItem.data;
            return (
              <ProductCard
                product={product}
                onEdit={() => onEdit(product)}
                onDelete={() => onDelete(product)}
              />
            );
          }}
          emptyMessage="No products found"
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            pageSize: pagination.pageSize,
            totalItems: gridItems.length,
            onPageChange: pagination.goToPage,
            onPageSizeChange: pagination.setPageSize,
          }}
        />
      )}
    </>
  );
};
