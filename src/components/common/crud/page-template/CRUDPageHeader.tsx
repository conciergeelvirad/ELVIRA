/**
 * CRUDPageHeader Component
 *
 * Displays the page title, search input, filter button, view mode toggles,
 * and add new button for CRUD pages.
 */

import { SearchInput } from "../../ui/SearchInput";
import { FilterButton } from "../../ui/FilterButton";
import { Button } from "../../ui/Button";
import type { ViewMode } from "./types";

interface CRUDPageHeaderProps {
  title: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterActive: boolean;
  onFilterToggle: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddClick: () => void;
  addButtonText?: string;
}

/**
 * Header section for CRUD pages with all controls
 *
 * @param title - Page title
 * @param searchQuery - Current search query value
 * @param onSearchChange - Search input change handler
 * @param searchPlaceholder - Placeholder text for search input
 * @param filterActive - Whether filter is active
 * @param onFilterToggle - Filter button click handler
 * @param viewMode - Current view mode (grid or list)
 * @param onViewModeChange - View mode toggle handler
 * @param onAddClick - Add button click handler
 * @param addButtonText - Text for add button
 */
export const CRUDPageHeader: React.FC<CRUDPageHeaderProps> = ({
  title,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterActive,
  onFilterToggle,
  viewMode,
  onViewModeChange,
  onAddClick,
  addButtonText = "Add New",
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
        />
        <FilterButton active={filterActive} onClick={onFilterToggle} />
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => onViewModeChange("list")}
            className={`px-3 py-2 text-sm ${
              viewMode === "list"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            List
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            className={`px-3 py-2 text-sm border-l border-gray-200 ${
              viewMode === "grid"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Grid
          </button>
        </div>
        <Button onClick={onAddClick}>{addButtonText}</Button>
      </div>
    </div>
  );
};
