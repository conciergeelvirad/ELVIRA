/**
 * FilterTagList Component
 *
 * Reusable tag selection list (categories, restaurants, service types)
 */

interface FilterTagListProps {
  title: string;
  items: Array<{ id: string; label: string }>;
  selectedItems: string[];
  onToggle: (id: string) => void;
}

export const FilterTagList = ({
  title,
  items,
  selectedItems,
  onToggle,
}: FilterTagListProps) => {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors touch-manipulation ${
              selectedItems.includes(item.id)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
