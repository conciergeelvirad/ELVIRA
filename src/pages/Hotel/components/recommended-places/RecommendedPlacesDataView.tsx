/**
 * Recommended Places Data View Component
 *
 * Renders recommended places in table or grid view with pagination and action handlers.
 */

import React from "react";
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
} from "../../../../components/common/data-display";
import {
  recommendedPlaceTableColumns,
  recommendedPlaceGridColumns,
} from "./RecommendedPlaceColumns";
import type { RecommendedPlace } from "../../../../hooks/queries/hotel-management/recommended-places";
import { MapPin, Navigation } from "lucide-react";

interface RecommendedPlacesDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (place: RecommendedPlace) => void;
  onEdit: (place: RecommendedPlace) => void;
  onDelete: (place: RecommendedPlace) => void;
}

/**
 * Recommended Place Card Component for Grid View
 */
const RecommendedPlaceCard: React.FC<{
  place: RecommendedPlace;
  onClick: () => void;
  onEdit?: (place: RecommendedPlace) => void;
  onDelete?: (place: RecommendedPlace) => void;
}> = ({ place, onClick, onEdit, onDelete }) => {
  const status = place.is_active ? "Active" : "Inactive";

  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [
    {
      icon: <Navigation className="w-4 h-4 mt-0.5 flex-shrink-0" />,
      content: <span className="line-clamp-2">{place.address || "N/A"}</span>,
      className: "items-start",
    },
  ];

  if (place.created_at) {
    sections.push({
      content: (
        <div className="text-xs text-gray-400">
          Added {new Date(place.created_at).toLocaleDateString()}
        </div>
      ),
    });
  }

  return (
    <GenericCard
      icon={<MapPin className="w-6 h-6 text-green-600" />}
      iconBgColor="bg-green-100"
      title={place.place_name}
      badge={{
        label: status,
        variant: "soft",
      }}
      sections={sections}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(place) : undefined}
          onDelete={onDelete ? () => onDelete(place) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};

/**
 * Recommended Places data view with table and grid rendering
 */
export const RecommendedPlacesDataView: React.FC<
  RecommendedPlacesDataViewProps
> = ({ viewMode, filteredData, handleRowClick, onEdit, onDelete }) => {
  return (
    <GenericDataView<RecommendedPlace>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={recommendedPlaceTableColumns}
      gridColumns={recommendedPlaceGridColumns}
      getItemId={(place) => place.id}
      renderCard={(place, onClick) => (
        <RecommendedPlaceCard
          place={place}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No recommended places found"
    />
  );
};
