import { useState } from "react";
import { Trash2, Edit, Eye, UserCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TableView } from "../common/data-display/TableView";
import { Button } from "../common/ui/Button";
import { useConfirmDialog } from "../../hooks/ui/useConfirmDialog";
import { useToast } from "../../hooks/ui/useToast";
import {
  type GuestWithPersonalData as Guest,
  useGuests,
  useUpdateGuest,
  useDeleteGuest,
} from "../../hooks/queries/hotel-management/guests";
import { StatusBadge } from "../common/data-display/StatusBadge";

interface GuestsTableProps {
  hotelId: string;
  onEdit?: (guest: Guest) => void;
  onView?: (guest: Guest) => void;
}

// Helper to get personal data from guest (handles both single object and array)
const getPersonalData = (guest: Guest) => {
  if (!guest.guest_personal_data) return null;
  return Array.isArray(guest.guest_personal_data)
    ? guest.guest_personal_data[0]
    : guest.guest_personal_data;
};

export const GuestsTable = ({ hotelId, onEdit, onView }: GuestsTableProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");
  const { data: guests = [] } = useGuests(hotelId);
  const { mutate: updateGuest } = useUpdateGuest();
  const { mutate: deleteGuest } = useDeleteGuest();
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();

  const handleToggleActive = async (guest: Guest) => {
    const confirmed = await confirm({
      title: `${guest.is_active ? "Deactivate" : "Activate"} Guest`,
      message: `Are you sure you want to ${
        guest.is_active ? "deactivate" : "activate"
      } this guest?`,
      confirmText: "Yes",
      cancelText: "No",
    });

    if (confirmed) {
      updateGuest(
        {
          id: guest.id,
          guestData: { is_active: !guest.is_active },
          hotelId,
        },
        {
          onSuccess: () => {
            toast({
              message: `Guest ${
                guest.is_active ? "deactivated" : "activated"
              } successfully`,
              type: "success",
            });
          },
          onError: (error) => {
            toast({
              message: `Failed to update status: ${error.message}`,
              type: "error",
            });
          },
        }
      );
    }
  };

  const handleToggleDND = async (guest: Guest) => {
    updateGuest(
      {
        id: guest.id,
        guestData: { dnd_status: !guest.dnd_status },
        hotelId,
      },
      {
        onSuccess: () => {
          toast({
            message: `Do Not Disturb ${
              guest.dnd_status ? "disabled" : "enabled"
            }`,
            type: "success",
          });
        },
        onError: (error) => {
          toast({
            message: `Failed to update DND status: ${error.message}`,
            type: "error",
          });
        },
      }
    );
  };

  const handleDelete = async (guest: Guest) => {
    const personalData = getPersonalData(guest);
    const confirmed = await confirm({
      title: "Delete Guest",
      message: `Are you sure you want to delete ${
        personalData?.first_name || guest.guest_name || "this guest"
      }? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      deleteGuest(
        { id: guest.id, hotelId },
        {
          onSuccess: () => {
            toast({
              message: "Guest deleted successfully",
              type: "success",
            });
          },
          onError: (error) => {
            toast({
              message: `Failed to delete guest: ${error.message}`,
              type: "error",
            });
          },
        }
      );
    }
  };

  const filteredGuests =
    selectedStatus === "all"
      ? guests
      : selectedStatus === "active"
      ? guests.filter((guest) => guest.is_active)
      : guests.filter((guest) => !guest.is_active);

  const columns = [
    {
      key: "guest_name",
      header: "Guest Name",
      sortable: true,
      render: (row: { id: string; data: Guest }) => {
        const guest = row.data;
        const personalData = getPersonalData(guest);
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-700">
                {personalData?.first_name?.charAt(0) ||
                  guest.guest_name?.charAt(0) ||
                  "?"}
                {personalData?.last_name?.charAt(0) || ""}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {personalData?.first_name || guest.guest_name || "N/A"}{" "}
                {personalData?.last_name || ""}
              </div>
              <div className="text-sm text-gray-500">
                {personalData?.guest_email || "No email"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "room_number",
      header: "Room",
      sortable: true,
      render: (row: { id: string; data: Guest }) => (
        <span className="font-medium text-gray-900">
          {row.data.room_number}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (row: { id: string; data: Guest }) => {
        const personalData = getPersonalData(row.data);
        return (
          <span className="text-gray-700">
            {personalData?.phone_number || "N/A"}
          </span>
        );
      },
    },
    {
      key: "country",
      header: "Country",
      render: (row: { id: string; data: Guest }) => {
        const personalData = getPersonalData(row.data);
        return (
          <span className="text-gray-700">
            {personalData?.country || "N/A"}
          </span>
        );
      },
    },
    {
      key: "is_active",
      header: "Status",
      sortable: true,
      render: (row: { id: string; data: Guest }) => (
        <StatusBadge
          status={row.data.is_active ? "success" : "default"}
          label={row.data.is_active ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "dnd_status",
      header: "DND",
      sortable: true,
      render: (row: { id: string; data: Guest }) => (
        <button
          onClick={() => handleToggleDND(row.data)}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          title="Click to toggle Do Not Disturb"
        >
          <StatusBadge
            status={row.data.dnd_status ? "warning" : "default"}
            label={row.data.dnd_status ? "Do Not Disturb" : "Available"}
          />
        </button>
      ),
    },
    {
      key: "created_at",
      header: "Registered",
      sortable: true,
      render: (row: { id: string; data: Guest }) =>
        row.data.created_at
          ? formatDistanceToNow(new Date(row.data.created_at), {
              addSuffix: true,
            })
          : "N/A",
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: { id: string; data: Guest }) => {
        const guest = row.data;
        return (
          <div className="flex items-center gap-1">
            {onView && (
              <Button
                size="sm"
                variant="ghost"
                leftIcon={Eye}
                onClick={() => onView(guest)}
                title="View Details"
              >
                View
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                leftIcon={Edit}
                onClick={() => onEdit(guest)}
                title="Edit Guest"
              >
                Edit
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              leftIcon={UserCheck}
              onClick={() => handleToggleActive(guest)}
              title={guest.is_active ? "Deactivate" : "Activate"}
            >
              {guest.is_active ? "Deactivate" : "Activate"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={Trash2}
              onClick={() => handleDelete(guest)}
              className="text-red-600 hover:text-red-800"
              title="Delete Guest"
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={selectedStatus === "all" ? "dark" : "ghost"}
          onClick={() => setSelectedStatus("all")}
        >
          All ({guests.length})
        </Button>
        <Button
          size="sm"
          variant={selectedStatus === "active" ? "dark" : "ghost"}
          onClick={() => setSelectedStatus("active")}
        >
          Active ({guests.filter((g) => g.is_active).length})
        </Button>
        <Button
          size="sm"
          variant={selectedStatus === "inactive" ? "dark" : "ghost"}
          onClick={() => setSelectedStatus("inactive")}
        >
          Inactive ({guests.filter((g) => !g.is_active).length})
        </Button>
      </div>

      <TableView
        rows={filteredGuests.map((guest) => ({ id: guest.id, data: guest }))}
        columns={columns}
      />
    </div>
  );
};
