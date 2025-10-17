/**
 * Tour Details Component
 *
 * Displays tour/activity information including rating and booking link
 */

import { CardRating } from "../../../../../components/common/CardRating";
import type { AmadeusActivity } from "../../../../../../../services/amadeus/types";

interface TourDetailsProps {
  tour: AmadeusActivity;
}

export const TourDetails = ({ tour }: TourDetailsProps) => {
  return (
    <div className="mb-4 space-y-3">
      {tour.rating && <CardRating rating={tour.rating} size="md" />}
      {tour.bookingLink && (
        <a
          href={tour.bookingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Book this tour →
        </a>
      )}
    </div>
  );
};
