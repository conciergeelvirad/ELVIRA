import React from "react";
import { Announcement } from "../../../../hooks/queries/hotel-management/announcements";
import { getDetailFields } from "./AnnouncementColumns";

interface AnnouncementDetailProps {
  item: Announcement | Record<string, unknown>;
}

export const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({
  item,
}) => {
  const announcement = item as unknown as Announcement;

  return (
    <div className="space-y-2">
      {/* Announcement Details */}
      {getDetailFields(announcement).map((field, index) => (
        <div
          key={index}
          className="py-2 border-b border-gray-100 last:border-b-0"
        >
          <div className="grid grid-cols-2 items-center">
            <div>
              <span className="text-sm font-medium text-gray-500 uppercase">
                {field.label}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">
                {field.value?.toString() || "-"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
