/**
 * Guest Management Page
 *
 * Manages hotel guests with CRUD operations.
 */

import { Users, Plus } from "lucide-react";
import {
  PageContainer,
  PageHeader,
  SearchAndFilterBar,
  Button,
  EmptyState,
  CRUDModalContainer,
} from "../../components/common";
import { useHotel } from "../../contexts/HotelContext";
import {
  useGuests,
  guestKeys,
  type GuestWithPersonalData,
} from "../../hooks/queries/hotel-management/guests";
import { useTableSubscription } from "../../hooks/useTableSubscription";
import { useGuestCRUD } from "./hooks";
import { GuestsDataView, GUEST_FORM_FIELDS, GuestDetail } from "./components";

export const GuestManagementPage = () => {
  const { currentHotel } = useHotel();

  // Query hooks
  const { data: guests = [], isLoading } = useGuests(currentHotel?.id || "");

  // Real-time subscription for guests
  useTableSubscription({
    table: "guests",
    filter: `hotel_id=eq.${currentHotel?.id}`,
    queryKey: guestKeys.list({ hotelId: currentHotel?.id || "" }),
  });

  // CRUD hook
  const guestCRUD = useGuestCRUD({
    initialGuests: guests,
    formFields: GUEST_FORM_FIELDS,
    hotelId: currentHotel?.id || "",
  });

  const {
    searchAndFilter,
    modalState,
    modalActions,
    formState,
    formActions,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
  } = guestCRUD;

  return (
    <PageContainer>
      <PageHeader
        title="Guest Management"
        subtitle="Manage hotel guests and their information"
      />

      <div className="space-y-4">
        <SearchAndFilterBar
          searchQuery={searchAndFilter.searchTerm}
          onSearchChange={searchAndFilter.setSearchTerm}
          searchPlaceholder="Search guests by name, email, or room..."
          filterActive={Boolean(searchAndFilter.filterValue)}
          onFilterToggle={() =>
            searchAndFilter.setFilterValue(
              searchAndFilter.filterValue ? "" : "active"
            )
          }
          viewMode={searchAndFilter.mode}
          onViewModeChange={searchAndFilter.setViewMode}
          rightActions={
            <Button
              variant="dark"
              leftIcon={Plus}
              onClick={modalActions.openCreateModal}
            >
              ADD GUEST
            </Button>
          }
        />

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            Loading guests...
          </div>
        ) : searchAndFilter.filteredData.length > 0 ? (
          <>
            <div className="mb-2 text-sm text-gray-500">
              Found {searchAndFilter.filteredData.length} guest(s)
            </div>
            <GuestsDataView
              viewMode={searchAndFilter.mode}
              filteredData={searchAndFilter.filteredData}
              handleRowClick={(guest) =>
                modalActions.openDetailModal(
                  guest as unknown as GuestWithPersonalData & { id: string }
                )
              }
              onEdit={(guest) => {
                // Flatten guest data for form fields
                const personalData = guest.guest_personal_data;

                // Create a flattened guest object that openEditModal can understand
                // Put explicit fields AFTER the spread so they override any existing properties
                const flattenedGuest = {
                  id: guest.id,
                  hotel_id: guest.hotel_id,
                  guest_name: guest.guest_name,
                  access_code_expires_at: guest.access_code_expires_at,
                  created_at: guest.created_at,
                  created_by: guest.created_by,
                  updated_at: guest.updated_at,
                  hashed_verification_code: guest.hashed_verification_code,
                  // Now add the fields that should be flattened - these will override
                  room_number: guest.room_number || "",
                  is_active: guest.is_active ?? true,
                  dnd_status: guest.dnd_status ?? false,
                  first_name: personalData?.first_name || "",
                  last_name: personalData?.last_name || "",
                  guest_email: personalData?.guest_email || "",
                  phone_number: personalData?.phone_number || "",
                  date_of_birth: personalData?.date_of_birth || "",
                  country: personalData?.country || "",
                  language: personalData?.language || "",
                };

                console.log(
                  "🔧 [GuestManagementPage] flattenedGuest:",
                  flattenedGuest
                );
                console.log(
                  "🔧 [GuestManagementPage] flattenedGuest.first_name:",
                  flattenedGuest.first_name
                );

                // Pass the flattened guest so openEditModal can extract the right fields
                modalActions.openEditModal(
                  flattenedGuest as unknown as GuestWithPersonalData & {
                    id: string;
                  }
                );
              }}
              onDelete={(guest) =>
                modalActions.openDeleteModal(
                  guest as unknown as GuestWithPersonalData & { id: string }
                )
              }
            />
          </>
        ) : (
          <EmptyState
            message="No guests found. Add your first guest to get started!"
            icon={Users}
          />
        )}
      </div>

      {/* CRUD Modals */}
      <CRUDModalContainer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        modalState={modalState as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        modalActions={modalActions as any}
        formState={formState}
        formActions={formActions}
        formFields={GUEST_FORM_FIELDS}
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        entityName="Guest"
        enableMultiGuest={true}
        renderDetailContent={(guest) => (
          <GuestDetail guest={guest as unknown as GuestWithPersonalData} />
        )}
      />
    </PageContainer>
  );
};
