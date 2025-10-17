/**
 * Generic Item Detail View Component
 *
 * Reusable component for displaying detail information for any item type.
 * Used by: Products, Amenities, Menu Items, and other entities.
 *
 * Features:
 * - Optional image display at the top
 * - Grid layout for label-value pairs
 * - Support for React elements (e.g., StatusBadge)
 * - Consistent styling across all detail views
 */

import React from "react";

export interface ItemDetailField {
  label: string;
  value: React.ReactNode | string | number | boolean | null | undefined;
}

export interface ItemDetailViewProps {
  imageUrl?: string | null;
  imageName?: string;
  fields: ItemDetailField[];
  imageHeight?: string; // Tailwind class, default: "h-48"
}

/**
 * Generic Item Detail View Component
 *
 * @example
 * ```tsx
 * <ItemDetailView
 *   imageUrl={product.image_url}
 *   imageName={product.name}
 *   fields={[
 *     { label: "Product Name", value: product.name },
 *     { label: "Price", value: `$${product.price}` },
 *     { label: "Active", value: <StatusBadge status={product.is_active} /> }
 *   ]}
 * />
 * ```
 */
export const ItemDetailView: React.FC<ItemDetailViewProps> = ({
  imageUrl,
  imageName = "Item",
  fields,
  imageHeight = "h-48",
}) => {
  return (
    <div className="space-y-2">
      {/* Image Section */}
      {imageUrl && (
        <div className="mb-4">
          <img
            src={imageUrl}
            alt={imageName}
            className={`w-full ${imageHeight} object-cover rounded-lg`}
          />
        </div>
      )}

      {/* Details Section */}
      {fields.map((field, index) => {
        // Check if the value is a React element (like StatusBadge)
        const isReactElement = React.isValidElement(field.value);

        return (
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
                {isReactElement ? (
                  field.value
                ) : (
                  <span className="text-sm font-medium text-gray-900">
                    {field.value?.toString() || "-"}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
