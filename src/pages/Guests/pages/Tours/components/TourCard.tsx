/**
 * TourCard Component
 *
 * Displays a tour/activity card using the reusable ExperienceCard component
 * Transforms Amadeus tour data to ExperienceCard props
 */

import { ExperienceCard } from "../../../components/ExperienceCard";
import type { AmadeusActivity } from "../../../../../services/amadeusActivities.service";

interface TourCardProps {
  tour: AmadeusActivity;
  onClick: () => void;
}

export const TourCard = ({ tour, onClick }: TourCardProps) => {
  // Transform Amadeus activity to ExperienceCard props
  const imageUrl =
    tour.pictures && tour.pictures.length > 0 ? tour.pictures[0] : undefined;

  // Parse price
  const priceString = tour.price ? `$${tour.price.amount}` : undefined;

  // Parse minimum duration to estimated time
  const estimatedTime = tour.minimumDuration
    ? formatDuration(tour.minimumDuration)
    : undefined;

  return (
    <ExperienceCard
      id={tour.id}
      title={tour.name}
      description={tour.shortDescription || tour.description}
      imageUrl={imageUrl}
      category="Tour"
      rating={tour.rating}
      reviewCount={undefined} // Amadeus doesn't provide review count
      price={priceString}
      estimatedTime={estimatedTime}
      onClick={onClick}
    />
  );
};

/**
 * Format ISO 8601 duration to human-readable format
 * Example: "PT2H30M" -> "2h 30min"
 */
function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const hours = match[1] ? `${match[1]}h` : "";
  const minutes = match[2] ? `${match[2]}min` : "";

  return [hours, minutes].filter(Boolean).join(" ") || duration;
}
