import { Plus } from "lucide-react";
import {
  PageContainer,
  PageHeader,
  SearchAndFilterBar,
  Button,
  CRUDModalContainer,
} from "../../../components/common";
import { useTableSubscription } from "../../../hooks/useTableSubscription";
import {
  useAnnouncements,
  announcementKeys,
} from "../../../hooks/queries/hotel-management/announcements";
import { useHotelStaff } from "../../../hooks/hotel/useHotelStaff";

// Import refactored components and hooks
import {
  AnnouncementsDataView,
  AnnouncementDetail,
  getAnnouncementTableColumns,
  getAnnouncementGridColumns,
  ANNOUNCEMENT_FORM_FIELDS,
  enhanceAnnouncement,
} from "./components";
import { useAnnouncementCRUD } from "../hooks/useAnnouncementCRUD";

export const AnnouncementsPage = () => {
  // 1. Staff Context Hook
  const {
    hotelId,
    hotelStaff,
    isLoading: staffLoading,
    error: staffError,
  } = useHotelStaff();
  const safeHotelId = hotelId || "";

  // 2. Data Fetching Hooks
  const { data: announcements = [], isLoading: announcementsLoading } =
    useAnnouncements(safeHotelId);

  // 3. CRUD Hook
  const announcementCRUD = useAnnouncementCRUD({
    initialAnnouncements: announcements,
    formFields: ANNOUNCEMENT_FORM_FIELDS,
  });

  // 4. Subscription Hook (with safety check built in)
  useTableSubscription({
    table: "announcements",
    filter: `hotel_id=eq.${safeHotelId}`,
    queryKey: announcementKeys.list(safeHotelId),
    enabled: Boolean(safeHotelId) && !staffLoading, // Only enable when we have a hotel ID and staff is loaded
  });

  // After all hooks are setup, we can do our conditional returns
  if (staffLoading || announcementsLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Early return for error state
  if (staffError || !hotelId || !hotelStaff) {
    return (
      <div className="flex justify-center items-center h-full text-red-600">
        Error: Unable to load staff data
      </div>
    );
  }

  // Log the complete staff context for debugging
  console.log("AnnouncementsPage - Staff Context:", {
    hotelId,
    staffId: hotelStaff.id,
    position: hotelStaff.position,
    department: hotelStaff.department,
    announcementsCount: announcements.length,
    timestamp: new Date().toISOString(),
  });

  // Destructure CRUD hook states after loading checks
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
  } = announcementCRUD;

  const {
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    mode: viewMode,
    setViewMode,
    filteredData,
  } = searchAndFilter;

  // Get columns based on current state with proper hotel ID
  const tableColumns = getAnnouncementTableColumns({
    handleStatusToggle,
    modalActions,
    formActions,
  });

  const gridColumns = getAnnouncementGridColumns({
    handleStatusToggle,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Announcements"
        toolbar={
          <SearchAndFilterBar
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search announcements..."
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
                ADD ANNOUNCEMENT
              </Button>
            }
          />
        }
      />

      <div className="mt-6">
        {announcementsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : (
          <AnnouncementsDataView
            viewMode={viewMode}
            filteredData={filteredData}
            handleRowClick={(announcement) =>
              modalActions.openDetailModal(
                enhanceAnnouncement({ ...announcement, hotel_id: safeHotelId })
              )
            }
            tableColumns={tableColumns}
            gridColumns={gridColumns}
            onEdit={(announcement) => {
              const formData = {
                title: announcement.title,
                description: announcement.description,
                is_active: announcement.is_active,
                hotel_id: safeHotelId,
              };
              formActions.setFormData(formData);
              modalActions.openEditModal(
                enhanceAnnouncement({ ...announcement, hotel_id: safeHotelId })
              );
            }}
            onDelete={(announcement) =>
              modalActions.openDeleteModal(
                enhanceAnnouncement({ ...announcement, hotel_id: safeHotelId })
              )
            }
          />
        )}
      </div>

      {/* CRUD Modal Container for Announcements */}
      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={ANNOUNCEMENT_FORM_FIELDS}
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        entityName="Announcement"
        renderDetailContent={(item) => <AnnouncementDetail item={item} />}
      />
    </PageContainer>
  );
};
