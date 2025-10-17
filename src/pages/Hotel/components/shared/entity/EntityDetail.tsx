import React from "react";
import {
  ItemDetailView,
  ItemDetailField,
} from "../../../../../components/common/detail-view";

interface EntityDetailProps<T> {
  item: T | Record<string, unknown>;
  getDetailFields: (item: T) => Array<{ label: string; value: any }>;
  getImageUrl?: (item: T) => string | null | undefined;
  getImageName?: (item: T) => string;
}

/**
 * Generic Entity Detail Component
 *
 * Shared component for displaying entity details in modals.
 * Uses ItemDetailView for consistent layout across all entity types.
 *
 * This component replaces:
 * - AmenityDetail
 * - ProductDetail
 * - RestaurantDetail
 * - MenuItemDetail
 *
 * @example
 * ```tsx
 * <EntityDetail<Amenity>
 *   item={amenity}
 *   getDetailFields={getAmenityDetailFields}
 *   getImageUrl={(item) => item.image_url}
 *   getImageName={(item) => item.name}
 * />
 * ```
 */
export const EntityDetail = <T extends Record<string, unknown>>({
  item,
  getDetailFields,
  getImageUrl,
  getImageName,
}: EntityDetailProps<T>) => {
  const typedItem = item as unknown as T;

  // Convert detail fields to ItemDetailField format
  const fields: ItemDetailField[] = getDetailFields(typedItem).map((field) => ({
    label: field.label,
    value: field.value,
  }));

  // Get image info if functions provided
  const imageUrl = getImageUrl ? getImageUrl(typedItem) : undefined;
  const imageName = getImageName ? getImageName(typedItem) : undefined;

  return (
    <ItemDetailView imageUrl={imageUrl} imageName={imageName} fields={fields} />
  );
};
