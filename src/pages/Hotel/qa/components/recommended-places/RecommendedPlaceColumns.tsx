/**
 * Recommended Place Columns Configuration
 *
 * Defines column configurations for recommended places table/grid views and detail fields.
 */

import { MapPin, Navigation, FileText, Clock } from "lucide-react";
import type { Column } from "../../../../../types/table";
import type { RecommendedPlace } from "../../../../../hooks/queries/hotel-management/recommended-places";
import { StatusBadge } from "../../../../../components/common";

/**
 * Table columns for recommended places
 */
export const recommendedPlaceTableColumns: Column<RecommendedPlace>[] = [
  {
    key: "place_name",
    header: "Place Name",
    accessor: "place_name",
  },
  {
    key: "address",
    header: "Address",
    accessor: "address",
  },
  {
    key: "description",
    header: "Description",
    accessor: (place) => {
      const description = place.description || "-";
      return description.length > 80
        ? `${description.substring(0, 80)}...`
        : description;
    },
  },
  {
    key: "is_active",
    header: "Status",
    accessor: (place) => (
      <StatusBadge
        status={place.is_active ? "active" : "inactive"}
        label={place.is_active ? "Active" : "Inactive"}
      />
    ),
  },
  {
    key: "created_at",
    header: "Created",
    accessor: (place) =>
      place.created_at ? new Date(place.created_at).toLocaleDateString() : "-",
  },
];

/**
 * Grid columns for recommended places (card view)
 */
export const recommendedPlaceGridColumns = [
  { key: "place_name", label: "Place Name" },
  { key: "address", label: "Address" },
  { key: "description", label: "Description" },
  { key: "is_active", label: "Status" },
];

/**
 * Detail view fields for recommended place modal
 */
export const recommendedPlaceDetailFields = [
  {
    key: "place_name",
    label: "Place Name",
    icon: MapPin,
    accessor: (place: RecommendedPlace) => place.place_name || "N/A",
  },
  {
    key: "address",
    label: "Address",
    icon: Navigation,
    accessor: (place: RecommendedPlace) => place.address || "N/A",
  },
  {
    key: "description",
    label: "Description",
    icon: FileText,
    accessor: (place: RecommendedPlace) => place.description || "N/A",
  },
  {
    key: "is_active",
    label: "Status",
    accessor: (place: RecommendedPlace) => (
      <StatusBadge
        status={place.is_active ? "active" : "inactive"}
        label={place.is_active ? "Active" : "Inactive"}
      />
    ),
  },
  {
    key: "created_at",
    label: "Created",
    icon: Clock,
    accessor: (place: RecommendedPlace) => {
      if (!place.created_at) return "N/A";
      return new Date(place.created_at).toLocaleString();
    },
  },
];
