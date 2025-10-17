/**
 * Category Header Component
 *
 * Displays a category title with an item count badge
 * Used in Shop, DineIn, and Services pages
 */

interface CategoryHeaderProps {
  category: string;
  count: number;
}

export const CategoryHeader = ({ category, count }: CategoryHeaderProps) => {
  return (
    <div className="flex items-center mb-3">
      <h2 className="text-lg font-bold text-gray-900 capitalize">{category}</h2>
      <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
        {count}
      </span>
    </div>
  );
};
