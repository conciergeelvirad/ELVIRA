/**
 * Staff Data View Component
 *
 * Renders staff members in table or grid view with pagination and action handlers.
 */

import React from "react";
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";
import { staffTableColumns, staffGridColumns } from "./StaffColumns";
import type { StaffMember } from "../../../../../types/staff-types";
import { User, Mail, Phone, Briefcase } from "lucide-react";

interface StaffDataViewProps {
  viewMode: "list" | "grid";
  filteredData: unknown[];
  handleRowClick: (staff: StaffMember) => void;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (staff: StaffMember) => void;
  currentUserId?: string; // Current logged-in user's staff ID
  isAdminOrManager?: boolean; // Whether current user is admin/manager
}

/**
 * Staff Card Component for Grid View
 */
const StaffCard: React.FC<{
  staff: StaffMember;
  onClick: () => void;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (staff: StaffMember) => void;
  currentUserId?: string;
  isAdminOrManager?: boolean;
}> = ({
  staff,
  onClick,
  onEdit,
  onDelete,
  currentUserId,
  isAdminOrManager,
}) => {
  const status = String(staff.status || "");

  // Determine which actions to show
  // Admin/Manager: can edit and delete anyone
  // Hotel Staff: can only edit their own profile, no delete
  const canEdit = isAdminOrManager || staff.id === currentUserId;
  const canDelete = isAdminOrManager;

  console.log(`🎴 [StaffCard] ${staff.name}:`, {
    staffId: staff.id,
    currentUserId,
    isAdminOrManager,
    canEdit,
    canDelete,
  });

  return (
    <GenericCard
      icon={<User className="w-6 h-6 text-blue-600" />}
      iconBgColor="bg-blue-100"
      title={staff.name}
      subtitle={`ID: ${staff.employeeId}`}
      badge={{
        label: status,
        variant: "soft",
      }}
      sections={[
        {
          icon: <Briefcase className="w-4 h-4" />,
          content: staff.position,
        },
        {
          content: <span className="font-medium">{staff.department}</span>,
        },
        {
          icon: <Mail className="w-4 h-4" />,
          content: <span className="truncate">{staff.email}</span>,
        },
        {
          icon: <Phone className="w-4 h-4" />,
          content: staff.phone,
        },
      ]}
      footer={
        <CardActionFooter
          onEdit={canEdit && onEdit ? () => onEdit(staff) : undefined}
          onDelete={canDelete && onDelete ? () => onDelete(staff) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};

/**
 * Staff data view with table and grid rendering
 */
export const StaffDataView: React.FC<StaffDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  onEdit,
  onDelete,
  currentUserId,
  isAdminOrManager = false,
}) => {
  console.log("📊 [StaffDataView] Rendering with:", {
    currentUserId,
    isAdminOrManager,
    itemCount: filteredData.length,
  });

  return (
    <GenericDataView<StaffMember>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={staffTableColumns}
      gridColumns={staffGridColumns}
      getItemId={(staff) => staff.employeeId}
      renderCard={(staff, onClick) => (
        <StaffCard
          staff={staff}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
          isAdminOrManager={isAdminOrManager}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No staff members found"
    />
  );
};
