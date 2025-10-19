import { Megaphone } from "lucide-react";
import { Column, GridColumn } from "../../../../types/table";
import {
  UnifiedToggle,
  ActionButtonGroup,
} from "../../../../components/common";
import { Announcement } from "../../../../hooks/queries/hotel-management/announcements";
import { CRUDModalActions, CRUDFormActions } from "../../../../hooks";

type EnhancedAnnouncement = Announcement & Record<string, unknown>;

// Helper function to convert Announcement to EnhancedAnnouncement
export const enhanceAnnouncement = (
  announcement: Announcement
): EnhancedAnnouncement => {
  return announcement as unknown as EnhancedAnnouncement;
};

interface GetColumnsOptions {
  handleStatusToggle: (id: string, newStatus: boolean) => void;
  modalActions: CRUDModalActions<EnhancedAnnouncement>;
  formActions: CRUDFormActions;
}

export const getTableColumns = ({
  handleStatusToggle,
  modalActions,
  formActions,
}: GetColumnsOptions): Column<Announcement>[] => {
  return [
    {
      key: "title",
      header: "TITLE",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: "description",
      header: "DESCRIPTION",
      sortable: false,
      render: (value) => (
        <span className="text-sm text-gray-600 truncate max-w-md block">
          {value}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "ACTIVE",
      sortable: true,
      render: (value, announcement) => (
        <div onClick={(e) => e.stopPropagation()}>
          <UnifiedToggle
            checked={value === true}
            onChange={(checked) => handleStatusToggle(announcement.id, checked)}
            variant="compact"
            size="sm"
          />
        </div>
      ),
    },
    {
      key: "created_at",
      header: "CREATED",
      sortable: true,
      render: (value) => {
        const date = value ? new Date(value as string) : null;
        return (
          <span className="text-sm text-gray-600">
            {date
              ? date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "ACTIONS",
      render: (_, announcement) => (
        <ActionButtonGroup
          actions={[
            {
              type: "edit",
              onClick: (e) => {
                e.stopPropagation();
                formActions.setFormData({
                  title: announcement.title,
                  description: announcement.description,
                  is_active: announcement.is_active,
                });
                modalActions.openEditModal(enhanceAnnouncement(announcement));
              },
            },
            {
              type: "delete",
              onClick: (e) => {
                e.stopPropagation();
                modalActions.openDeleteModal(enhanceAnnouncement(announcement));
              },
              variant: "danger",
            },
          ]}
          size="sm"
          compact
        />
      ),
    },
  ];
};

export const getGridColumns = ({
  handleStatusToggle,
}: Pick<GetColumnsOptions, "handleStatusToggle">): GridColumn[] => {
  return [
    {
      key: "title",
      label: "Title",
      accessor: "title",
    },
    {
      key: "description",
      label: "Description",
      accessor: "description",
    },
    {
      key: "is_active",
      label: "Active",
      accessor: "is_active",
      render: (value: boolean, item: Announcement) => (
        <div onClick={(e) => e.stopPropagation()}>
          <UnifiedToggle
            checked={value === true}
            onChange={(checked) => handleStatusToggle(item.id, checked)}
            variant="compact"
            size="sm"
          />
        </div>
      ),
    },
  ];
};

// Detail fields for the modal
export const getDetailFields = (announcement: Announcement) => [
  { label: "Title", value: announcement.title },
  { label: "Description", value: announcement.description },
  { label: "Active", value: announcement.is_active ? "Yes" : "No" },
  {
    label: "Created",
    value: announcement.created_at
      ? new Date(announcement.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A",
  },
];

// Export functions with common naming pattern
export const getAnnouncementTableColumns = getTableColumns;
export const getAnnouncementGridColumns = getGridColumns;
export const getAnnouncementDetailFields = getDetailFields;
