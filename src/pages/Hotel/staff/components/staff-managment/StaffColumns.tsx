/**
 * Staff Columns Configuration
 *
 * Defines table columns, grid columns, and detail fields for staff members.
 */

import { Column } from "../../../../../types/table";
import type { StaffMember } from "../../../../../types/staff-types";
import { StatusBadge } from "../../../../../components/common";

/**
 * Table columns for staff list view
 */
export const staffTableColumns: Column<StaffMember>[] = [
  {
    key: "status",
    header: "Status",
    accessor: "status",
    render: (_, row: StaffMember) => {
      const status = String(row.status || "inactive").toLowerCase();
      return (
        <StatusBadge
          status={status as "active" | "inactive"}
          label={status.charAt(0).toUpperCase() + status.slice(1)}
          variant="soft"
          size="sm"
        />
      );
    },
  },
  {
    key: "employeeId",
    header: "Employee ID",
    accessor: "employeeId",
  },
  {
    key: "position",
    header: "Position",
    accessor: "position",
  },
  {
    key: "department",
    header: "Department",
    accessor: "department",
  },
  {
    key: "name",
    header: "Name",
    accessor: "name",
  },
  {
    key: "phone",
    header: "Phone",
    accessor: "phone",
  },
  {
    key: "email",
    header: "Email",
    accessor: "email",
  },
  {
    key: "hireDate",
    header: "Hire Date",
    accessor: "hireDate",
  },
];

/**
 * Grid columns for staff grid view
 */
export const staffGridColumns = [
  { key: "name", label: "Name" },
  { key: "position", label: "Position" },
  { key: "department", label: "Department" },
  { key: "status", label: "Status" },
];

/**
 * Detail fields for staff detail modal
 */
export const staffDetailFields = [
  { key: "name", label: "Full Name" },
  { key: "employeeId", label: "Employee ID" },
  { key: "position", label: "Position" },
  { key: "department", label: "Department" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "hireDate", label: "Hire Date" },
  { key: "status", label: "Status" },
];
