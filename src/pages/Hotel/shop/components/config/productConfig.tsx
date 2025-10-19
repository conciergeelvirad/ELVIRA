/**
 * Product Entity Configuration
 *
 * Defines product-specific behavior for the shared EntityTab component.
 * This configuration approach allows us to reuse the same base components
 * across different entity types while maintaining entity-specific customizations.
 */

import React from "react";
import { ProductCard } from "../shared";
import { getDetailFields } from "../products/ProductColumns";
import { PRODUCT_FORM_FIELDS } from "../products/ProductFormFields";
import type { Product } from "../../../../../hooks/queries/hotel-management/products";
import { EntityDetail } from "../../../components/shared/entity";

/**
 * Product Entity Configuration
 */
export const productConfig = {
  // Entity metadata
  entityName: "Product",
  searchPlaceholder: "Search products...",
  addButtonLabel: "ADD PRODUCT",
  emptyMessage: "No products found",

  // Form fields
  formFields: PRODUCT_FORM_FIELDS,

  // Detail rendering using shared EntityDetail component
  renderDetail: (item: any) => (
    <EntityDetail<Product>
      item={item}
      getDetailFields={getDetailFields}
      getImageUrl={(product) => product.image_url}
      getImageName={(product) => product.name}
    />
  ),

  // Card rendering function
  renderCard: (
    product: Product,
    onClick: () => void,
    handlers: {
      onEdit: () => void;
      onDelete: () => void;
      currency?: string;
      handleRecommendedToggle?: (
        id: string | number,
        newValue: boolean,
        fieldName?: "recommended" | "hotel_recommended"
      ) => Promise<void>;
    }
  ) => (
    <ProductCard
      product={product}
      onClick={onClick}
      onEdit={handlers.onEdit}
      onDelete={handlers.onDelete}
      onRecommendedToggle={handlers.handleRecommendedToggle}
      currency={handlers.currency}
    />
  ),
};
