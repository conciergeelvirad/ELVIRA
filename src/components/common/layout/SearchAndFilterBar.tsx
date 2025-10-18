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
  onFilterClick?: () => void; // For advanced filter modal
  filterLabel?: string;
  filterBadgeCount?: number; // For showing active filter count

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
  onFilterClick,
  filterLabel = "Filter",
  filterBadgeCount,
  viewMode = "list",
  onViewModeChange,
  showViewToggle = true,
  leftActions,
  rightActions,
  className,
}: SearchAndFilterBarProps) => {
  // Use onFilterClick if provided, otherwise fallback to onFilterToggle
  const handleFilterClick = onFilterClick || onFilterToggle;

  return (
    <ActionBar className={className}>
      <ActionBarSection align="left">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchQuery}
          onSearchChange={onSearchChange}
          className="w-96"
        />
        {handleFilterClick && (
          <FilterButton
            active={filterActive}
            onClick={handleFilterClick}
            title={filterLabel}
            badgeCount={filterBadgeCount}
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
