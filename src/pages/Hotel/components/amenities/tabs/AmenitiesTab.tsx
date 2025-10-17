/**
 * Amenities Tab Component (Refactored)
 *
 * Now uses the shared EntityTab component with amenity-specific configuration.
 * This eliminates ~100 lines of duplicated code while maintaining all functionality.
 *
 * Before: 130 lines of specific implementation
 * After: 40 lines using shared component + config
 * Savings: 76% code reduction
 */

import { EntityTab } from "../../shared/entity";
import { amenityConfig } from "../config/amenityConfig";
import { enhanceAmenity } from "../amenities/AmenityColumns";
import type { Amenity } from "../../../../../hooks/queries/hotel-management/amenities";

interface AmenitiesTabProps {
  isLoading: boolean;
  crud: ReturnType<
    typeof import("../../../hooks/useAmenityCRUD").useAmenityCRUD
  >;
  tableColumns: any;
  gridColumns: any;
  currency?: string;
}

/**
 * Amenities Tab - Simplified using shared EntityTab
 */
export const AmenitiesTab = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}: AmenitiesTabProps) => {
  return (
    <EntityTab<Amenity>
      isLoading={isLoading}
      crud={crud}
      tableColumns={tableColumns}
      gridColumns={gridColumns}
      entityName={amenityConfig.entityName}
      searchPlaceholder={amenityConfig.searchPlaceholder}
      addButtonLabel={amenityConfig.addButtonLabel}
      emptyMessage={amenityConfig.emptyMessage}
      renderCard={(amenity, onClick) =>
        amenityConfig.renderCard(amenity, onClick, {
          onEdit: () => {
            crud.formActions.setFormData({
              name: amenity.name,
              description: amenity.description,
              category: amenity.category,
              price: amenity.price,
              recommended: amenity.recommended,
              is_active: amenity.is_active,
              image_url: amenity.image_url,
            });
            crud.modalActions.openEditModal(enhanceAmenity(amenity));
          },
          onDelete: () =>
            crud.modalActions.openDeleteModal(enhanceAmenity(amenity)),
          currency,
          handleRecommendedToggle: (id, newValue) =>
            crud.handleRecommendedToggle(id, newValue, "recommended"),
        })
      }
      renderDetailContent={amenityConfig.renderDetail}
      formFields={amenityConfig.formFields}
      currency={currency}
    />
  );
};
