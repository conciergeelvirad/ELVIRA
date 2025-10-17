/**
 * Task Detail Component
 *
 * Displays detailed information about a task with staff member avatar
 */

import { TaskWithStaff } from "../../../../../hooks/queries/hotel-management/tasks";
import { Avatar } from "../../../../../components/common/ui";
import {
  DetailField,
  DetailBadge,
} from "../../../../../components/common/detail";
import type { BadgeColor } from "../../../../../components/common/detail/DetailBadge";

export const TaskDetail = ({ item }: { item: TaskWithStaff }) => {
  // Map priority to badge color
  const priorityColorMap: Record<string, BadgeColor> = {
    Low: "blue",
    Medium: "yellow",
    High: "red",
  };

  // Map status to badge color
  const statusColorMap: Record<string, BadgeColor> = {
    PENDING: "gray",
    IN_PROGRESS: "blue",
    COMPLETED: "green",
    CANCELLED: "red",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  // Format due date with time
  const formattedDueDate = item.dueDate
    ? `${new Date(item.dueDate).toLocaleDateString()}${
        item.dueTime ? ` at ${item.dueTime}` : ""
      }`
    : null;

  return (
    <div className="space-y-6 -mx-6 -my-4">
      {/* Avatar Section - Staff Member Assigned */}
      {item.staffName && (
        <div className="flex flex-col items-center space-y-3 pb-6 border-b border-gray-200 px-6 pt-4">
          <Avatar
            src={item.staffAvatar || undefined}
            name={item.staffName}
            size="2xl"
            alt={`${item.staffName}'s avatar`}
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {item.staffName}
            </h2>
            <p className="text-sm text-gray-500">{item.staffPosition}</p>
          </div>
        </div>
      )}

      {/* Details Section */}
      <div className="space-y-4 px-6 pb-4">
        <DetailBadge
          label="Priority"
          value={item.priority}
          color={priorityColorMap[item.priority]}
        />

        <DetailBadge
          label="Status"
          value={statusLabels[item.status]}
          color={statusColorMap[item.status]}
        />

        <DetailField label="Due Date" value={formattedDueDate} />

        <DetailField
          label="Assigned To"
          value={item.staffName || "Unassigned"}
        />

        <DetailField label="Task" value={item.title} fontWeight="medium" />

        <DetailField label="Description" value={item.description} />

        <DetailField label="Department" value={item.staffDepartment} />

        <DetailField label="Email" value={item.staffEmail} />

        <DetailField
          label="Created At"
          value={
            item.createdAt ? new Date(item.createdAt).toLocaleString() : null
          }
        />

        <DetailField label="Created By" value={item.createdByEmail} />
      </div>
    </div>
  );
};
