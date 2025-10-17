import React from "react";
import { Product } from "../../../../../hooks/queries/hotel-management/products";
import { getDetailFields } from "./ProductColumns";
import {
  ItemDetailView,
  ItemDetailField,
} from "../../../../../components/common/detail-view";

interface ProductDetailProps {
  item: Product | Record<string, unknown>;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ item }) => {
  const product = item as unknown as Product;

  // Convert getDetailFields output to ItemDetailField format
  const fields: ItemDetailField[] = getDetailFields(product).map((field) => ({
    label: field.label,
    value: field.value,
  }));

  return (
    <ItemDetailView
      imageUrl={product.image_url}
      imageName={product.name}
      fields={fields}
    />
  );
};
