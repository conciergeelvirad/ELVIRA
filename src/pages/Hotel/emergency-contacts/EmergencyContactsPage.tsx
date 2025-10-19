import { useEffect } from "react";
import { Plus } from "lucide-react";
import {
  PageContainer,
  PageHeader,
  SearchAndFilterBar,
  Button,
} from "../../../components/common";
import { CRUDModalContainer } from "../../../components/common/crud/CRUDModalContainer";
import {
  useEmergencyContacts,
  DEFAULT_HOTEL_ID,
} from "../../../hooks/queries/hotel-management/emergency-contacts";

// Import refactored components and hooks
import {
  EmergencyContactsDataView,
  EmergencyContactDetail,
  getTableColumns as getEmergencyContactTableColumns,
  getGridColumns as getEmergencyContactGridColumns,
  FORM_FIELDS as EMERGENCY_CONTACT_FORM_FIELDS,
  enhanceContact,
} from "./components";
import { useEmergencyContactCRUD, EnhancedEmergencyContact } from "./hooks";

export const EmergencyContactsPage = () => {
  const { data: emergencyContacts = [] } =
    useEmergencyContacts(DEFAULT_HOTEL_ID);

  // Transform the raw contacts into the expected format
  const formattedContacts = emergencyContacts.map((contact) => ({
    id: contact.id,
    contactName: contact.contact_name,
    phoneNumber: contact.phone_number,
    status: (contact.is_active ? "ACTIVE" : "INACTIVE") as
      | "ACTIVE"
      | "INACTIVE",
    type: "Emergency Services" as const,
    priority: "Medium" as const,
    created: contact.created_at
      ? new Date(contact.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A",
  }));

  // Use the custom CRUD hook for all state management
  const {
    searchAndFilter,
    modalState,
    modalActions,
    formState,
    formActions,
    handleStatusToggle,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
  } = useEmergencyContactCRUD({
    initialContacts: formattedContacts,
    formFields: EMERGENCY_CONTACT_FORM_FIELDS,
  });

  // Log filtered data to check if data is being filtered correctly

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
  const tableColumns = getEmergencyContactTableColumns({
    handleStatusToggle,
    modalActions,
    formActions,
  });

  const gridColumns = getEmergencyContactGridColumns({
    handleStatusToggle,
  });

  // Reset to first page when search changes
  useEffect(() => {
    // We don't have direct access to pagination here, but we'll handle this
    // in the DataView component
  }, [searchTerm]);

  return (
    <PageContainer>
      <PageHeader
        title="Emergency Contacts"
        toolbar={
          <SearchAndFilterBar
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search contacts..."
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
                ADD CONTACT
              </Button>
            }
          />
        }
      />

      <div className="mt-6">
        <EmergencyContactsDataView
          viewMode={viewMode}
          filteredData={filteredData}
          handleRowClick={(contact) =>
            modalActions.openDetailModal(enhanceContact(contact))
          }
          tableColumns={tableColumns}
          gridColumns={gridColumns}
          handleStatusToggle={handleStatusToggle}
          onEdit={(contact) => {
            formActions.setFormData({
              contactName: contact.contactName,
              phoneNumber: contact.phoneNumber,
              type: contact.type,
            });
            modalActions.openEditModal(enhanceContact(contact));
          }}
          onDelete={(contact) =>
            modalActions.openDeleteModal(enhanceContact(contact))
          }
          onView={(contact) =>
            modalActions.openDetailModal(enhanceContact(contact))
          }
        />
      </div>

      {/* CRUD Modals Container */}
      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={EMERGENCY_CONTACT_FORM_FIELDS}
        entityName="Emergency Contact"
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        createModalTitle="Add Emergency Contact"
        editModalTitle="Edit Emergency Contact"
        deleteModalTitle="Delete Emergency Contact"
        createButtonText="Add Contact"
        editButtonText="Save Changes"
        deleteButtonText="Delete Contact"
        detailModalTitle={
          modalState.itemToView
            ? `${
                (modalState.itemToView as EnhancedEmergencyContact).contactName
              } Details`
            : "Contact Details"
        }
        renderDetailContent={(item) => <EmergencyContactDetail item={item} />}
      />
    </PageContainer>
  );
};
