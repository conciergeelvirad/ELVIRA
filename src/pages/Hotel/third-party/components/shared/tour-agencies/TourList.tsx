/**
 * Tour List Component
 *
 * Displays a grid of tour cards
 */

import { TourCard } from "./TourCard";
import type { AmadeusActivity } from "../../../../../../services/amadeusActivities.service";
import type { ApprovalStatus } from "../../../../../../types/approved-third-party-places";
import { LoadingSpinner } from "../../../../../../components/common";

interface TourListProps {
  tours: AmadeusActivity[];
  loading?: boolean;
  onView?: (tour: AmadeusActivity) => void;
  onApprove?: (tour: AmadeusActivity) => void;
  onReject?: (tour: AmadeusActivity) => void;
  onToggleRecommended?: (tour: AmadeusActivity) => void;
  getStatus?: (tour: AmadeusActivity) => ApprovalStatus | null;
  isRecommended?: (tour: AmadeusActivity) => boolean;
}

export const TourList = ({
  tours,
  loading = false,
  onView,
  onApprove,
  onReject,
  onToggleRecommended,
  getStatus,
  isRecommended,
}: TourListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center p-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No tours found</p>
        <p className="text-sm text-gray-400 mt-2">
          Try adjusting your search criteria or radius
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <TourCard
          key={tour.id}
          tour={tour}
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
          onToggleRecommended={onToggleRecommended}
          currentStatus={getStatus ? getStatus(tour) : null}
          isRecommended={isRecommended ? isRecommended(tour) : false}
        />
      ))}
    </div>
  );
};
