/**
 * FilterActions Component
 *
 * Footer with Reset and Apply buttons
 */

interface FilterActionsProps {
  onReset: () => void;
  onApply: () => void;
}

export const FilterActions = ({ onReset, onApply }: FilterActionsProps) => {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3">
      <button
        onClick={onReset}
        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors touch-manipulation"
      >
        Reset
      </button>
      <button
        onClick={onApply}
        className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors touch-manipulation"
      >
        Apply Filters
      </button>
    </div>
  );
};
