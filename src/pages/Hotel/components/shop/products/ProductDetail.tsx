import React from "react";
import { Product } from "../../../../../hooks/queries/hotel-management/products";
import { getDetailFields } from "./ProductColumns";

interface ProductDetailProps {
  item: Product | Record<string, unknown>;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ item }) => {
  const product = item as unknown as Product;

  return (
    <div className="space-y-2">
      {/* Product Image */}
      {product.image_url && (
        <div className="mb-4">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Product Details */}
      {getDetailFields(product).map((field, index) => (
        <div
          key={index}
          className="py-2 border-b border-gray-100 last:border-b-0"
        >
          <div className="grid grid-cols-2 items-center">
            <div>
              <span className="text-sm font-medium text-gray-500 uppercase">
                {field.label}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">
                {field.value?.toString() || "-"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
