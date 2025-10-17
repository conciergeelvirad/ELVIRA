/**
 * Amenities Tab Component
 *
 * Handles the display and management of hotel amenities.
 * Includes search, filter, view modes, and CRUD operations.
 */

import { Plus } from "lucide-react";
import {
  SearchAndFilterBar,
  Button,
  CRUDModalContainer,
  LoadingState,
} from "../../../../../components/common";
import {
  AmenitiesDataView,
  AmenityDetail,
  AMENITY_FORM_FIELDS,
  enhanceAmenity,
} from "../index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface AmenitiesTabProps {
  isLoading: boolean;
  crud: ReturnType<
    typeof import("../../../hooks/useAmenityCRUD").useAmenityCRUD
  >;
  tableColumns: any;
  gridColumns: any;
  currency?: string;
}

export const AmenitiesTab = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}: AmenitiesTabProps) => {
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

  return (
    <div className="space-y-4">
      <SearchAndFilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search amenities..."
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
            ADD AMENITY
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <AmenitiesDataView
          viewMode={viewMode}
          filteredData={filteredData}
          handleRowClick={(amenity) =>
            modalActions.openDetailModal(enhanceAmenity(amenity))
          }
          tableColumns={tableColumns}
          gridColumns={gridColumns}
          currency={currency}
          onEdit={(amenity) => {
            formActions.setFormData({
              name: amenity.name,
              description: amenity.description,
              category: amenity.category,
              price: amenity.price,
              recommended: amenity.recommended,
              is_active: amenity.is_active,
              image_url: amenity.image_url,
            });
            modalActions.openEditModal(enhanceAmenity(amenity));
          }}
          onDelete={(amenity) =>
            modalActions.openDeleteModal(enhanceAmenity(amenity))
          }
          handleRecommendedToggle={(id, newValue) =>
            crud.handleRecommendedToggle(id, newValue, "recommended")
          }
        />
      )}

      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={AMENITY_FORM_FIELDS}
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        entityName="Amenity"
        renderDetailContent={(item) => <AmenityDetail item={item} />}
      />
    </div>
  );
};
