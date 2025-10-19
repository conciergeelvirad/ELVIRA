/**
 * Restaurant Categories Section Component
 *
 * Displays formatted restaurant types/categories
 */

export const createRestaurantCategoriesSection = (
  types: string[],
  maxDisplay: number = 2
) => {
  const displayTypes = types
    .filter(
      (t) => !t.includes("point_of_interest") && !t.includes("establishment")
    )
    .slice(0, maxDisplay)
    .map((t) => t.replace(/_/g, " "))
    .join(", ");

  if (!displayTypes) return null;

  return {
    content: (
      <span className="text-xs text-gray-500 italic">{displayTypes}</span>
    ),
  };
};
