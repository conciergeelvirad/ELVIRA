import React from "react";
import { Plus } from "lucide-react";
import {
  SearchAndFilterBar,
  Button,
  CRUDModalContainer,
  LoadingState,
} from "../../../../../components/common";
import {
  ProductsDataView,
  ProductDetail,
  enhanceProduct,
  PRODUCT_FORM_FIELDS,
} from "../index";
import type { useProductCRUD } from "../../../hooks/shop/useProductCRUD";

interface ProductsTabProps {
  isLoading: boolean;
  crud: ReturnType<typeof useProductCRUD>;
  tableColumns: any[];
  gridColumns: any[];
}

/**
 * Products Tab Component
 *
 * Displays and manages hotel shop products with:
 * - Search and filter functionality
 * - Grid/List view modes
 * - CRUD operations (create, edit, delete, view)
 * - Real-time updates
 */
export const ProductsTab: React.FC<ProductsTabProps> = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
}) => {
  const {
    searchAndFilter,
    modalState,
    modalActions,
    formState,
    formActions,
    handleStatusToggle,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
  } = crud;

  const {
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    mode: viewMode,
    setViewMode,
    filteredData,
  } = searchAndFilter;

  if (isLoading) {
    return <LoadingState message="Loading products..." />;
  }

  return (
    <div className="space-y-4">
      <SearchAndFilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search products..."
        filterActive={Boolean(filterValue)}
        onFilterToggle={() => setFilterValue(filterValue ? "" : "active")}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        rightActions={
          <Button
            variant="dark"
            leftIcon={Plus}
            onClick={modalActions.openCreateModal}
          >
            ADD PRODUCT
          </Button>
        }
      />

      <ProductsDataView
        viewMode={viewMode}
        filteredData={filteredData}
        handleRowClick={(product) =>
          modalActions.openDetailModal(enhanceProduct(product))
        }
        tableColumns={tableColumns}
        gridColumns={gridColumns}
        handleStatusToggle={handleStatusToggle}
        handleRecommendedToggle={(id, newValue) =>
          crud.handleRecommendedToggle(id, newValue, "recommended")
        }
        onEdit={(product) => {
          formActions.setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            stock_quantity: product.stock_quantity,
            image_url: product.image_url,
          });
          modalActions.openEditModal(enhanceProduct(product));
        }}
        onDelete={(product) =>
          modalActions.openDeleteModal(enhanceProduct(product))
        }
        onView={(product) =>
          modalActions.openDetailModal(enhanceProduct(product))
        }
      />

      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={PRODUCT_FORM_FIELDS}
        entityName="Product"
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        renderDetailContent={(item) => <ProductDetail item={item} />}
      />
    </div>
  );
};
