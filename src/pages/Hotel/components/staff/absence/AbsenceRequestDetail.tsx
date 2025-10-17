/**
 * Absence Request Detail Component
 *
 * Displays detailed information about an absence request with staff member avatar
 */

import { AbsenceRequestWithStaff } from "../../../../../hooks/queries/hotel-management/absence-requests";
import { Avatar } from "../../../../../components/common/ui";
import {
  DetailField,
  DetailBadge,
} from "../../../../../components/common/detail";
import type { BadgeColor } from "../../../../../components/common/detail/DetailBadge";

export const AbsenceRequestDetail = ({
  item,
}: {
  item: AbsenceRequestWithStaff;
}) => {
  // Format request type labels
  const typeLabels: Record<string, string> = {
    vacation: "Vacation",
    sick: "Sick Leave",
    personal: "Personal",
    training: "Training",
    other: "Other",
  };

  // Map status to badge color
  const statusColorMap: Record<string, BadgeColor> = {
    pending: "yellow",
    approved: "green",
    rejected: "red",
    cancelled: "gray",
  };

  // Capitalize status
  const statusDisplay =
    item.status.charAt(0).toUpperCase() + item.status.slice(1);

  // Data Processing Consent display
  const consentDisplay = item.dataProcessingConsent
    ? `Provided${
        item.consentDate
          ? ` on ${new Date(item.consentDate).toLocaleDateString()}`
          : ""
      }`
    : null;

  return (
    <div className="space-y-6 -mx-6 -my-4">
      {/* Avatar Section - Staff Member */}
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
          label="Status"
          value={statusDisplay}
          color={statusColorMap[item.status]}
        />

        <DetailField
          label="Type"
          value={typeLabels[item.requestType]}
          fontWeight="medium"
        />

        <DetailField
          label="Staff Member"
          value={item.staffName || "N/A"}
          fontWeight="medium"
        />

        <DetailField label="Start Date" value={item.startDate} />

        <DetailField label="End Date" value={item.endDate} />

        <DetailField label="Notes" value={item.notes} />

        <DetailField label="Position" value={item.staffPosition} />

        <DetailField label="Department" value={item.staffDepartment} />

        <DetailField label="Email" value={item.staffEmail} />

        <DetailField label="Employee ID" value={item.staffEmployeeId} mono />

        <DetailField
          label="Created At"
          value={
            item.createdAt ? new Date(item.createdAt).toLocaleString() : null
          }
        />

        {/* Data Processing Consent - Special Badge Display */}
        {item.dataProcessingConsent && (
          <DetailBadge
            label="Data Processing Consent"
            value={consentDisplay || "Provided"}
            color="green"
          />
        )}
      </div>
    </div>
  );
};
