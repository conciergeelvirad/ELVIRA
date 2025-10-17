/**
 * CRUDPageTemplate Component
 *
 * A reusable template for CRUD (Create, Read, Update, Delete) pages.
 * Now uses focused sub-components from the page-template folder.
 */

import { useState } from "react";
import { PageContainer } from "../layout/PageContainer";
import {
  CRUDPageHeader,
  CRUDGridView,
  CRUDTableView,
  useCRUDFiltering,
  type CRUDPageTemplateProps,
  type ViewMode,
} from "./page-template";

export const CRUDPageTemplate = <T extends { id: string | number }>({
  config,
}: CRUDPageTemplateProps<T>) => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(
    config.defaultViewMode || "list"
  );

  // Use custom filtering hook
  const filteredData = useCRUDFiltering(config.data, searchQuery);

  // Event handlers
  const handleAddClick = () => {
    // TODO: Implement modal opening
  };

  const handleEditClick = (_item: T) => {
    // TODO: Implement modal opening
  };

  return (
    <PageContainer>
      <CRUDPageHeader
        title={config.title}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={config.searchPlaceholder}
        filterActive={filterActive}
        onFilterToggle={() => setFilterActive(!filterActive)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddClick={handleAddClick}
        addButtonText={config.addButtonText}
      />

      <div className="bg-white rounded-lg shadow">
        {viewMode === "grid" ? (
          <CRUDGridView
            data={filteredData}
            columns={config.columns}
            gridCols={config.gridCols}
            onEdit={handleEditClick}
            onView={config.onView}
            onDelete={config.onDelete}
          />
        ) : (
          <CRUDTableView
            data={filteredData}
            columns={config.columns}
            onEdit={handleEditClick}
            onView={config.onView}
            onDelete={config.onDelete}
          />
        )}
      </div>
    </PageContainer>
  );
};
