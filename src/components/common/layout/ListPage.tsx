import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { Plus, Grid3x3, List } from "lucide-react";
import {
  PageContainer,
  PageHeader,
  ActionBar,
  ActionBarSection,
} from "../layout";
import {
  SearchInput,
  FilterButton,
  IconButton,
  Button,
  EmptyState,
} from "../ui";

interface ListPageProps {
  title: string;
  searchPlaceholder: string;
  emptyStateMessage: string;
  emptyStateIcon: LucideIcon;
  addButtonLabel?: string;
  onAddClick?: () => void;
  filterTitle?: string;
}

export const ListPage = ({
  title,
  searchPlaceholder,
  emptyStateMessage,
  emptyStateIcon,
  addButtonLabel,
  onAddClick,
  filterTitle = "Filter items",
}: ListPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  return (
    <PageContainer>
      <PageHeader
        title={title}
        toolbar={
          <ActionBar>
            <ActionBarSection align="left">
              <SearchInput
                placeholder={searchPlaceholder}
                value={searchQuery}
                onSearchChange={setSearchQuery}
                className="w-80"
              />
              <FilterButton
                active={filterActive}
                onClick={() => setFilterActive(!filterActive)}
                title={filterTitle}
              />
            </ActionBarSection>

            <ActionBarSection align="right">
              <IconButton
                icon={Grid3x3}
                variant={viewMode === "grid" ? "solid" : "default"}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              />
              <IconButton
                icon={List}
                variant={viewMode === "list" ? "solid" : "default"}
                onClick={() => setViewMode("list")}
                title="List view"
              />
              {addButtonLabel && onAddClick && (
                <Button variant="dark" leftIcon={Plus} onClick={onAddClick}>
                  {addButtonLabel}
                </Button>
              )}
            </ActionBarSection>
          </ActionBar>
        }
      />

      <div className="mt-6">
        <EmptyState message={emptyStateMessage} icon={emptyStateIcon} />
      </div>
    </PageContainer>
  );
};
