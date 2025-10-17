/**
 * Amenity Entity Configuration
 *
 * Defines amenity-specific behavior for the shared EntityTab component.
 * This configuration approach allows us to reuse the same base components
 * across different entity types while maintaining entity-specific customizations.
 */

import React from "react";
import { AmenityCard } from "../../../../../components/amenities";
import { getDetailFields } from "../amenities/AmenityColumns";
import { AMENITY_FORM_FIELDS } from "../amenities/AmenityFormFields";
import type { Amenity } from "../../../../../hooks/queries/hotel-management/amenities";
import { EntityDetail } from "../../shared/entity";

/**
 * Amenity Entity Configuration
 */
export const amenityConfig = {
  // Entity metadata
  entityName: "Amenity",
  searchPlaceholder: "Search amenities...",
  addButtonLabel: "ADD AMENITY",
  emptyMessage: "No amenities found",

  // Form fields
  formFields: AMENITY_FORM_FIELDS,

  // Detail rendering using shared EntityDetail component
  renderDetail: (item: any) => (
    <EntityDetail<Amenity>
      item={item}
      getDetailFields={getDetailFields}
      getImageUrl={(amenity) => amenity.image_url}
      getImageName={(amenity) => amenity.name}
    />
  ),

  // Card rendering function
  renderCard: (
    amenity: Amenity,
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
    <AmenityCard
      amenity={amenity}
      onClick={onClick}
      onEdit={handlers.onEdit}
      onDelete={handlers.onDelete}
      onRecommendedToggle={handlers.handleRecommendedToggle}
      currency={handlers.currency}
    />
  ),
};
