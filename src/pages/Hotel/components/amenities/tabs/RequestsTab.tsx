/**
 * Requests Tab Component
 *
 * Handles the display and management of amenity requests.
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
  AmenityRequestsDataView,
  AmenityRequestDetail,
  AMENITY_REQUEST_FORM_FIELDS,
  enhanceAmenityRequest,
} from "../index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface RequestsTabProps {
  isLoading: boolean;
  crud: ReturnType<
    typeof import("../../../hooks/useAmenityRequestCRUD").useAmenityRequestCRUD
  >;
  tableColumns: any;
}

export const RequestsTab = ({
  isLoading,
  crud,
  tableColumns,
}: RequestsTabProps) => {
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
        searchPlaceholder="Search requests..."
        filterActive={Boolean(filterValue)}
        onFilterToggle={() => setFilterValue(filterValue ? "" : "pending")}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        rightActions={
          <Button
            variant="dark"
            leftIcon={Plus}
            onClick={modalActions.openCreateModal}
          >
            ADD REQUEST
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <AmenityRequestsDataView
          viewMode={viewMode}
          filteredData={filteredData}
          handleRowClick={(request) =>
            modalActions.openDetailModal(enhanceAmenityRequest(request))
          }
          tableColumns={tableColumns}
          onEdit={(request) => {
            const requestData = enhanceAmenityRequest(request);
            formActions.setFormData(requestData);
            modalActions.openEditModal(requestData);
          }}
          onDelete={(request) =>
            modalActions.openDeleteModal(enhanceAmenityRequest(request))
          }
        />
      )}

      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={AMENITY_REQUEST_FORM_FIELDS}
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        entityName="Amenity Request"
        renderDetailContent={(item) => <AmenityRequestDetail item={item} />}
      />
    </div>
  );
};
