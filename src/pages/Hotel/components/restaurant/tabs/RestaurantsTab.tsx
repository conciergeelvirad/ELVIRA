import React from "react";
import { Plus } from "lucide-react";
import {
  SearchAndFilterBar,
  Button,
  CRUDModalContainer,
  LoadingState,
} from "../../../../../components/common";
import { RestaurantsDataView, RESTAURANT_FORM_FIELDS } from "../index";
import type { useRestaurantCRUD } from "../../../hooks/restaurant/useRestaurantCRUD";

interface RestaurantsTabProps {
  isLoading: boolean;
  crud: ReturnType<typeof useRestaurantCRUD>;
}

/**
 * Restaurants Tab Component
 *
 * Displays and manages restaurants with:
 * - Search and filter functionality
 * - Grid/List view modes
 * - CRUD operations (create, edit, delete, view)
 */
export const RestaurantsTab: React.FC<RestaurantsTabProps> = ({
  isLoading,
  crud,
}) => {
  const {
    searchAndFilter,
    modalState,
    modalActions,
    formState,
    formActions,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
  } = crud;

  const {
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    mode: viewMode,
    setViewMode,
    filteredData,
  } = searchAndFilter;

  if (isLoading) {
    return <LoadingState message="Loading restaurants..." />;
  }

  return (
    <div className="space-y-4">
      <SearchAndFilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search restaurants..."
        filterActive={Boolean(filterValue)}
        onFilterToggle={() => setFilterValue(filterValue ? "" : "active")}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        rightActions={
          <Button
            variant="dark"
            leftIcon={Plus}
            onClick={modalActions.openCreateModal}
          >
            Add Restaurant
          </Button>
        }
      />

      <RestaurantsDataView
        viewMode={viewMode}
        filteredData={filteredData}
        handleRowClick={modalActions.openDetailModal}
        onEdit={modalActions.openEditModal}
        onDelete={modalActions.openDeleteModal}
      />

      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={RESTAURANT_FORM_FIELDS}
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        entityName="Restaurant"
      />
    </div>
  );
};
