import { GenericCard, CardActionFooter } from "../common/data-display";
import { MegaphoneIcon } from "lucide-react";
import type { Announcement } from "../../hooks/queries/hotel-management/announcements";
import { formatDistanceToNow } from "date-fns";

interface AnnouncementCardProps {
  announcement: Announcement;
  onEdit: () => void;
  onDelete: () => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onEdit,
  onDelete,
}) => {
  const status = announcement.is_active ? "Active" : "Inactive";
  const timeAgo = formatDistanceToNow(
    new Date(announcement.created_at || new Date()),
    {
      addSuffix: true,
    }
  );

  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [
    {
      content: <p className="text-sm text-gray-500">{timeAgo}</p>,
    },
    {
      content: (
        <p className="text-gray-700 line-clamp-3">{announcement.description}</p>
      ),
    },
  ];

  return (
    <GenericCard
      icon={<MegaphoneIcon className="h-6 w-6 text-blue-600" />}
      iconBgColor="bg-blue-100"
      title={announcement.title}
      badge={
        !announcement.is_active
          ? {
              label: status,
              variant: "soft",
            }
          : undefined
      }
      sections={sections}
      footer={<CardActionFooter onEdit={onEdit} onDelete={onDelete} />}
      onClick={() => {
        // Click handler - could trigger onEdit
        if (onEdit) onEdit();
      }}
    />
  );
};
