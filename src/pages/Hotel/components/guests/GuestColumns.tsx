/**
 * Guest Columns Configuration
 *
 * Defines column configurations for guest table/grid views and detail fields.
 */

import { Users, Mail, Phone, Building2 } from "lucide-react";
import type { Column } from "../../../../types/table";
import type { GuestWithPersonalData } from "../../../../hooks/queries/hotel-management/guests";
import { StatusBadge } from "../../../../components/common";

/**
 * Helper to get personal data from guest (handles both single object and array)
 */
const getPersonalData = (guest: GuestWithPersonalData) => {
  if (!guest.guest_personal_data) return null;
  return Array.isArray(guest.guest_personal_data)
    ? guest.guest_personal_data[0]
    : guest.guest_personal_data;
};

/**
 * Table columns for guests
 * Displaying only: room_number, is_active, dnd_status from guests table
 * and first_name, last_name, guest_email, phone_number, country, language from guest_personal_data
 */
export const guestTableColumns: Column<GuestWithPersonalData>[] = [
  {
    key: "room_number",
    header: "Room",
    accessor: "room_number",
  },
  {
    key: "is_active",
    header: "Active",
    accessor: (guest) => (
      <StatusBadge
        status={guest.is_active ? "active" : "inactive"}
        label={guest.is_active ? "Yes" : "No"}
      />
    ),
  },
  {
    key: "dnd_status",
    header: "DND",
    accessor: (guest) => (
      <StatusBadge
        status={guest.dnd_status ? "active" : "inactive"}
        label={guest.dnd_status ? "Yes" : "No"}
      />
    ),
  },
  {
    key: "first_name",
    header: "First Name",
    accessor: (guest) => {
      const personalData = getPersonalData(guest);
      return personalData?.first_name || "N/A";
    },
  },
  {
    key: "last_name",
    header: "Last Name",
    accessor: (guest) => {
      const personalData = getPersonalData(guest);
      return personalData?.last_name || "N/A";
    },
  },
  {
    key: "guest_email",
    header: "Email",
    accessor: (guest) => {
      const personalData = getPersonalData(guest);
      return personalData?.guest_email || "N/A";
    },
  },
  {
    key: "phone_number",
    header: "Phone",
    accessor: (guest) => {
      const personalData = getPersonalData(guest);
      return personalData?.phone_number || "N/A";
    },
  },
  {
    key: "country",
    header: "Country",
    accessor: (guest) => {
      const personalData = getPersonalData(guest);
      return personalData?.country || "N/A";
    },
  },
  {
    key: "language",
    header: "Language",
    accessor: (guest) => {
      const personalData = getPersonalData(guest);
      return personalData?.language || "N/A";
    },
  },
];

/**
 * Grid columns for guests (card view)
 * Displaying only: room_number, is_active, dnd_status from guests table
 * and first_name, last_name, guest_email, phone_number, country, language from guest_personal_data
 */
export const guestGridColumns = [
  { key: "room_number", label: "Room" },
  { key: "is_active", label: "Active" },
  { key: "dnd_status", label: "DND" },
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "guest_email", label: "Email" },
  { key: "phone_number", label: "Phone" },
  { key: "country", label: "Country" },
  { key: "language", label: "Language" },
];

/**
 * Detail view fields for guest modal
 * Displaying only relevant data: room_number, is_active, dnd_status, created_by from guests table
 * and first_name, last_name, guest_email, phone_number, country, language from guest_personal_data
 */
export const guestDetailFields = [
  {
    key: "room_number",
    label: "Room Number",
    icon: Building2,
    accessor: (guest: GuestWithPersonalData) => guest.room_number || "N/A",
  },
  {
    key: "is_active",
    label: "Active",
    accessor: (guest: GuestWithPersonalData) => (
      <StatusBadge
        status={guest.is_active ? "active" : "inactive"}
        label={guest.is_active ? "Yes" : "No"}
      />
    ),
  },
  {
    key: "dnd_status",
    label: "DND",
    accessor: (guest: GuestWithPersonalData) => (
      <StatusBadge
        status={guest.dnd_status ? "active" : "inactive"}
        label={guest.dnd_status ? "Yes" : "No"}
      />
    ),
  },
  {
    key: "first_name",
    label: "First Name",
    icon: Users,
    accessor: (guest: GuestWithPersonalData) => {
      const personalData = getPersonalData(guest);
      return personalData?.first_name || "N/A";
    },
  },
  {
    key: "last_name",
    label: "Last Name",
    icon: Users,
    accessor: (guest: GuestWithPersonalData) => {
      const personalData = getPersonalData(guest);
      return personalData?.last_name || "N/A";
    },
  },
  {
    key: "guest_email",
    label: "Email",
    icon: Mail,
    accessor: (guest: GuestWithPersonalData) => {
      const personalData = getPersonalData(guest);
      return personalData?.guest_email || "N/A";
    },
  },
  {
    key: "phone_number",
    label: "Phone",
    icon: Phone,
    accessor: (guest: GuestWithPersonalData) => {
      const personalData = getPersonalData(guest);
      return personalData?.phone_number || "N/A";
    },
  },
  {
    key: "country",
    label: "Country",
    icon: Building2,
    accessor: (guest: GuestWithPersonalData) => {
      const personalData = getPersonalData(guest);
      return personalData?.country || "N/A";
    },
  },
  {
    key: "language",
    label: "Language",
    icon: Users,
    accessor: (guest: GuestWithPersonalData) => {
      const personalData = getPersonalData(guest);
      return personalData?.language || "N/A";
    },
  },
  {
    key: "created_by",
    label: "Created By",
    icon: Users,
    accessor: (guest: GuestWithPersonalData) => {
      // If no created_by ID, show N/A
      if (!guest.created_by) {
        return "N/A";
      }

      // If we have creator data, show the name
      if (guest.creator?.staff_personal_data) {
        const { first_name, last_name } = guest.creator.staff_personal_data;
        return `${first_name} ${last_name}`.trim() || "Not available";
      }

      // If created_by exists but staff no longer in database
      return "Not available";
    },
  },
];
