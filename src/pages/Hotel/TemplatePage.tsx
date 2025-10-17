import { useEffect } from "react";
import { Plus } from "lucide-react";
import {
  PageContainer,
  PageHeader,
  SearchAndFilterBar,
  Button,
} from "../../components/common";
import { CRUDModalContainer } from "../../components/common/crud/CRUDModalContainer";

// TODO: Replace with your actual data import
import { sampleTemplateData } from "../../data/templateData";

// TODO: Replace with your actual components
import {
  TemplateDataView,
  TemplateDetail,
  getTemplateTableColumns,
  getTemplateGridColumns,
  TEMPLATE_FORM_FIELDS,
  enhanceTemplate,
} from "./components";
import { useTemplateCRUD, EnhancedTemplate } from "./hooks/useTemplateCRUD";

// TODO: Update the page name and configuration
export const TemplatePage = () => {
  // Use the custom CRUD hook for all state management
  const {
    data: templateData, // TODO: Rename to match your entity (e.g., contacts, staff, amenities)
    searchAndFilter,
    modalState,
    modalActions,
    formState,
    formActions,
    handleStatusToggle,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
  } = useTemplateCRUD({
    initialData: sampleTemplateData, // TODO: Replace with your sample data
    formFields: TEMPLATE_FORM_FIELDS, // TODO: Replace with your form fields
  });

  const {
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    mode: viewMode,
    setViewMode,
    filteredData,
  } = searchAndFilter;

  // Get columns based on current state
  const tableColumns = getTemplateTableColumns({
    handleStatusToggle,
    modalActions,
    formActions,
  });

  const gridColumns = getTemplateGridColumns();

  // Reset to first page when search changes
  useEffect(() => {
    // Handle pagination reset if needed
  }, [searchTerm]);

  return (
    <PageContainer>
      <PageHeader
        title="Template Management" // TODO: Update page title
        toolbar={
          <SearchAndFilterBar
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search templates..." // TODO: Update placeholder
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
                ADD TEMPLATE {/* TODO: Update button text */}
              </Button>
            }
          />
        }
      />

      <div className="mt-6">
        <TemplateDataView
          viewMode={viewMode}
          filteredData={filteredData}
          handleRowClick={(template) =>
            modalActions.openDetailModal(enhanceTemplate(template))
          }
          tableColumns={tableColumns}
          gridColumns={gridColumns}
        />
      </div>

      {/* CRUD Modals Container */}
      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={TEMPLATE_FORM_FIELDS}
        entityName="Template" // TODO: Update entity name
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        createModalTitle="Add Template" // TODO: Update modal titles
        editModalTitle="Edit Template"
        deleteModalTitle="Delete Template"
        createButtonText="Add Template" // TODO: Update button texts
        editButtonText="Save Changes"
        deleteButtonText="Delete Template"
        detailModalTitle={
          modalState.itemToView
            ? `${(modalState.itemToView as EnhancedTemplate).name} Details` // TODO: Update field name
            : "Template Details"
        }
        renderDetailContent={(item) => <TemplateDetail item={item} />}
      />
    </PageContainer>
  );
};
