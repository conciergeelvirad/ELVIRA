/**
 * Products Tab Component (Refactored)
 *
 * Now uses the shared EntityTab component with product-specific configuration.
 * This eliminates ~100 lines of duplicated code while maintaining all functionality.
 *
 * Before: 135 lines of specific implementation
 * After: 70 lines using shared component + config
 * Savings: 48% code reduction
 */

import { EntityTab } from "../../shared/entity";
import { productConfig } from "../config/productConfig";
import { enhanceProduct } from "../products/ProductColumns";
import type { Product } from "../../../../../hooks/queries/hotel-management/products";
import type { useProductCRUD } from "../../../hooks/shop/useProductCRUD";

interface ProductsTabProps {
  isLoading: boolean;
  crud: ReturnType<typeof useProductCRUD>;
  tableColumns: any[];
  gridColumns: any[];
  currency?: string;
}

/**
 * Products Tab - Simplified using shared EntityTab
 */
export const ProductsTab: React.FC<ProductsTabProps> = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}) => {
  return (
    <EntityTab<Product>
      isLoading={isLoading}
      crud={crud}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      entityName={productConfig.entityName}
      searchPlaceholder={productConfig.searchPlaceholder}
      addButtonLabel={productConfig.addButtonLabel}
      emptyMessage={productConfig.emptyMessage}
      renderCard={(product, onClick) =>
        productConfig.renderCard(product, onClick, {
          onEdit: () => {
            crud.formActions.setFormData({
              name: product.name,
              description: product.description,
              category: product.category,
              price: product.price,
              stock_quantity: product.stock_quantity,
              image_url: product.image_url,
            });
            crud.modalActions.openEditModal(enhanceProduct(product));
          },
          onDelete: () =>
            crud.modalActions.openDeleteModal(enhanceProduct(product)),
          currency,
          handleRecommendedToggle: (id, newValue) =>
            crud.handleRecommendedToggle(id, newValue, "recommended"),
        })
      }
      renderDetailContent={productConfig.renderDetail}
      formFields={productConfig.formFields}
      currency={currency}
    />
  );
};
