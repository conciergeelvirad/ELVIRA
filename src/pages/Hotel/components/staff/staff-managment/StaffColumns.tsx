/**
 * Staff Columns Configuration
 *
 * Defines table columns, grid columns, and detail fields for staff members.
 */

import { Column } from "../../../../../types/table";
import type { StaffMember } from "../../../../../types/staff-types";

/**
 * Table columns for staff list view
 */
export const staffTableColumns: Column<StaffMember>[] = [
  {
    key: "status",
    header: "Status",
    accessor: "status",
    render: (_, row: StaffMember) => {
      const status = String(row.status || "");
      const color =
        status === "active"
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800";
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {status}
        </span>
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
