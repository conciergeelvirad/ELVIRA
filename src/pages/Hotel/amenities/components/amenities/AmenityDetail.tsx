import React from "react";
import { Amenity } from "../../../../../hooks/queries/hotel-management/amenities";
import { getDetailFields } from "./AmenityColumns";
import {
  ItemDetailView,
  ItemDetailField,
} from "../../../../../components/common/detail-view";

interface AmenityDetailProps {
  item: Amenity | Record<string, unknown>;
}

export const AmenityDetail: React.FC<AmenityDetailProps> = ({ item }) => {
  const amenity = item as unknown as Amenity;

  // Convert getDetailFields output to ItemDetailField format
  const fields: ItemDetailField[] = getDetailFields(amenity).map((field) => ({
    label: field.label,
    value: field.value,
  }));

  return (
    <ItemDetailView
      imageUrl={amenity.image_url}
      imageName={amenity.name}
      fields={fields}
    />
  );
};
