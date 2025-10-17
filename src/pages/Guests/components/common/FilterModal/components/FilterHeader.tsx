/**
 * FilterHeader Component
 *
 * Modal header with title, active filter count, and close button
 */

import { X } from "lucide-react";

interface FilterHeaderProps {
  activeFilterCount: number;
  onClose: () => void;
}

export const FilterHeader = ({
  activeFilterCount,
  onClose,
}: FilterHeaderProps) => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {activeFilterCount > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};
