import { Grid3x3, List } from "lucide-react";
import { SearchInput, FilterButton, IconButton } from "../ui";
import { ActionBar, ActionBarSection } from "./ActionBar";

interface SearchAndFilterBarProps {
  // Search functionality
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;

  // Filter functionality
  filterActive?: boolean;
  onFilterToggle?: () => void;
  filterLabel?: string;

  // View mode toggle
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  showViewToggle?: boolean;

  // Additional actions
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;

  // Styling
  className?: string;
}

export const SearchAndFilterBar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterActive = false,
  onFilterToggle,
  filterLabel = "Filter",
  viewMode = "list",
  onViewModeChange,
  showViewToggle = true,
  leftActions,
  rightActions,
  className,
}: SearchAndFilterBarProps) => {
  return (
    <ActionBar className={className}>
      <ActionBarSection align="left">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchQuery}
          onSearchChange={onSearchChange}
          className="w-96"
        />
        {onFilterToggle && (
          <FilterButton
            active={filterActive}
            onClick={onFilterToggle}
            title={filterLabel}
          />
        )}
        {leftActions}
      </ActionBarSection>

      <ActionBarSection align="right">
        {showViewToggle && onViewModeChange && (
          <>
            <IconButton
              icon={List}
              variant={viewMode === "list" ? "solid" : "outline"}
              onClick={() => onViewModeChange("list")}
              title="List view"
            />
            <IconButton
              icon={Grid3x3}
              variant={viewMode === "grid" ? "solid" : "outline"}
              onClick={() => onViewModeChange("grid")}
              title="Grid view"
            />
          </>
        )}
        {rightActions}
      </ActionBarSection>
    </ActionBar>
  );
};
