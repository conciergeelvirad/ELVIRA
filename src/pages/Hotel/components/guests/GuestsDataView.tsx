/**
 * Guests Data View Component
 *
 * Renders guests in table or grid view with pagination and action handlers.
 */

import React from "react";
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
  StatusBadge,
} from "../../../../components/common/data-display";
import { guestTableColumns, guestGridColumns } from "./GuestColumns";
import type { GuestWithPersonalData } from "../../../../hooks/queries/hotel-management/guests";
import { Phone, Building2 } from "lucide-react";

interface GuestsDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (guest: GuestWithPersonalData) => void;
  onEdit: (guest: GuestWithPersonalData) => void;
  onDelete: (guest: GuestWithPersonalData) => void;
}

/**
 * Helper to get personal data from guest
 */
const getPersonalData = (guest: GuestWithPersonalData) => {
  if (!guest.guest_personal_data) return null;
  return Array.isArray(guest.guest_personal_data)
    ? guest.guest_personal_data[0]
    : guest.guest_personal_data;
};

/**
 * Guest Card Component for Grid View
 * Displaying only: room_number, is_active, dnd_status from guests table
 * and first_name, last_name, guest_email, phone_number, country, language from guest_personal_data
 * Order: Room, Active, DND, First Name, Last Name, Email, Phone, Country, Language
 */
const GuestCard: React.FC<{
  guest: GuestWithPersonalData;
  onClick: () => void;
  onEdit?: (guest: GuestWithPersonalData) => void;
  onDelete?: (guest: GuestWithPersonalData) => void;
}> = ({ guest, onClick, onEdit, onDelete }) => {
  const personalData = getPersonalData(guest);
  const firstName = personalData?.first_name || "N/A";
  const lastName = personalData?.last_name || "N/A";
  const email = personalData?.guest_email || "N/A";
  const phone = personalData?.phone_number || "N/A";
  const country = personalData?.country || "N/A";
  const language = personalData?.language || "N/A";

  // Build sections array with all required fields in order
  // Note: Room number in icon area, Guest name in title, Email in subtitle
  // First Name and Last Name removed as they're already in the title
  const sections = [
    {
      icon: <Building2 className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Active:</span>{" "}
          <StatusBadge
            status={guest.is_active ? "active" : "inactive"}
            label={guest.is_active ? "Yes" : "No"}
            size="sm"
          />
        </>
      ),
    },
    {
      icon: <Building2 className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">DND:</span>{" "}
          <StatusBadge
            status={guest.dnd_status ? "active" : "inactive"}
            label={guest.dnd_status ? "Yes" : "No"}
            size="sm"
          />
        </>
      ),
    },
    {
      icon: <Phone className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Phone:</span> {phone}
        </>
      ),
    },
    {
      icon: <Building2 className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Country:</span> {country}
        </>
      ),
    },
    {
      icon: <Building2 className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Language:</span> {language}
        </>
      ),
    },
  ];

  return (
    <GenericCard
      icon={
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-lg font-bold text-blue-600">
            {guest.room_number || "N/A"}
          </span>
        </div>
      }
      iconBgColor="bg-blue-100"
      title={`${firstName} ${lastName}`}
      subtitle={email}
      sections={sections}
      gridColumns={2}
      footer={
        <CardActionFooter
          onEdit={
            onEdit
              ? () => {
                  console.log(
                    "[GuestsDataView] About to call onEdit with guest:",
                    guest
                  );
                  console.log(
                    "[GuestsDataView] guest.guest_personal_data:",
                    guest.guest_personal_data
                  );
                  onEdit(guest);
                }
              : undefined
          }
          onDelete={onDelete ? () => onDelete(guest) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};

/**
 * Guests data view with table and grid rendering
 */
export const GuestsDataView: React.FC<GuestsDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  onEdit,
  onDelete,
}) => {
  return (
    <GenericDataView<GuestWithPersonalData>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={guestTableColumns}
      gridColumns={guestGridColumns}
      getItemId={(guest) => guest.id}
      renderCard={(guest, onClick) => (
        <GuestCard
          guest={guest}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No guests found"
    />
  );
};
