/**
 * Generic Categories Section Component
 *
 * Displays formatted categories/types for any third-party type
 */

export const createCategoriesSection = (
  categories: string[],
  maxDisplay: number = 2
) => {
  const displayCategories = categories
    .filter(
      // Filter out generic categories
      (cat) =>
        !cat.includes("point_of_interest") && !cat.includes("establishment")
    )
    .slice(0, maxDisplay)
    .map((cat) => cat.replace(/_/g, " "))
    .join(", ");

  if (!displayCategories) return null;

  return {
    content: (
      <span className="text-xs text-gray-500 italic">{displayCategories}</span>
    ),
  };
};
