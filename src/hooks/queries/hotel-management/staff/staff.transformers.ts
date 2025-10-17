/**
 * Hotel Staff Transformers
 * Utility functions for data transformation and filtering
 */

import type {
  StaffWithPersonalData,
  StaffMember,
  HotelStaffPersonalData,
  StaffStatus,
} from "./staff.types";

// ============================================================================
// DATA TRANSFORMATION
// ============================================================================

/**
 * Transform database staff record to UI-friendly StaffMember
 */
export const transformStaffMember = (
  staff: StaffWithPersonalData
): StaffMember => {
  // Handle personal_data being either an array or a single object
  const personalData: HotelStaffPersonalData | undefined = Array.isArray(
    staff.personal_data
  )
    ? staff.personal_data[0]
    : staff.personal_data;

  const name =
    personalData?.first_name && personalData?.last_name
      ? `${personalData.first_name} ${personalData.last_name}`
      : "Unknown";

  return {
    id: staff.id,
    employeeId: staff.employee_id,
    name,
    position: staff.position,
    department: staff.department,
    email: personalData?.email || "",
    phone: personalData?.phone_number || "",
    hireDate: staff.hire_date,
    status: staff.status as StaffStatus,
    photo: personalData?.avatar_url || "",
    dateOfBirth: personalData?.date_of_birth || undefined,
    city: personalData?.city || undefined,
    zipCode: personalData?.zip_code || undefined,
    address: personalData?.address || undefined,
    emergencyContactName: personalData?.emergency_contact_name || undefined,
    emergencyContactNumber: personalData?.emergency_contact_number || undefined,
  };
};

/**
 * Transform multiple staff records
 */
export const transformStaffMembers = (
  staffList: StaffWithPersonalData[]
): StaffMember[] => {
  return staffList.map(transformStaffMember);
};

// ============================================================================
// NAME UTILITIES
// ============================================================================

/**
 * Get full name from personal data
 */
export const getStaffFullName = (
  personalData?: HotelStaffPersonalData | HotelStaffPersonalData[]
): string => {
  const data = Array.isArray(personalData) ? personalData[0] : personalData;

  if (data?.first_name && data?.last_name) {
    return `${data.first_name} ${data.last_name}`;
  }

  return "Unknown";
};

/**
 * Get initials from name
 */
export const getStaffInitials = (name: string): string => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

// ============================================================================
// FILTERING
// ============================================================================

/**
 * Filter staff by status
 */
export const filterByStatus = (
  staffList: StaffMember[],
  status: StaffStatus
): StaffMember[] => {
  return staffList.filter((staff) => staff.status === status);
};

/**
 * Filter active staff only
 */
export const filterActiveStaff = (staffList: StaffMember[]): StaffMember[] => {
  return filterByStatus(staffList, "active");
};

/**
 * Filter staff by department
 */
export const filterByDepartment = (
  staffList: StaffMember[],
  department: string
): StaffMember[] => {
  return staffList.filter((staff) => staff.department === department);
};

/**
 * Filter staff by position
 */
export const filterByPosition = (
  staffList: StaffMember[],
  position: string
): StaffMember[] => {
  return staffList.filter((staff) => staff.position === position);
};

/**
 * Search staff by name, email, or employee ID
 */
export const searchStaff = (
  staffList: StaffMember[],
  searchText: string
): StaffMember[] => {
  if (!searchText.trim()) return staffList;

  const lowerSearch = searchText.toLowerCase().trim();

  return staffList.filter((staff) => {
    const matchesName = staff.name.toLowerCase().includes(lowerSearch);
    const matchesEmail = staff.email.toLowerCase().includes(lowerSearch);
    const matchesEmployeeId = staff.employeeId
      .toLowerCase()
      .includes(lowerSearch);
    const matchesPosition = staff.position.toLowerCase().includes(lowerSearch);
    const matchesDepartment = staff.department
      .toLowerCase()
      .includes(lowerSearch);

    return (
      matchesName ||
      matchesEmail ||
      matchesEmployeeId ||
      matchesPosition ||
      matchesDepartment
    );
  });
};

// ============================================================================
// SORTING
// ============================================================================

/**
 * Sort staff by name (alphabetically)
 */
export const sortByName = (staffList: StaffMember[]): StaffMember[] => {
  return [...staffList].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Sort staff by hire date (newest first)
 */
export const sortByHireDate = (staffList: StaffMember[]): StaffMember[] => {
  return [...staffList].sort((a, b) => {
    const dateA = new Date(a.hireDate).getTime();
    const dateB = new Date(b.hireDate).getTime();
    return dateB - dateA;
  });
};

/**
 * Sort staff by department
 */
export const sortByDepartment = (staffList: StaffMember[]): StaffMember[] => {
  return [...staffList].sort((a, b) =>
    a.department.localeCompare(b.department)
  );
};

// ============================================================================
// GROUPING
// ============================================================================

/**
 * Group staff by department
 */
export const groupByDepartment = (
  staffList: StaffMember[]
): Record<string, StaffMember[]> => {
  const grouped: Record<string, StaffMember[]> = {};

  staffList.forEach((staff) => {
    if (!grouped[staff.department]) {
      grouped[staff.department] = [];
    }
    grouped[staff.department].push(staff);
  });

  return grouped;
};

/**
 * Group staff by position
 */
export const groupByPosition = (
  staffList: StaffMember[]
): Record<string, StaffMember[]> => {
  const grouped: Record<string, StaffMember[]> = {};

  staffList.forEach((staff) => {
    if (!grouped[staff.position]) {
      grouped[staff.position] = [];
    }
    grouped[staff.position].push(staff);
  });

  return grouped;
};

/**
 * Group staff by status
 */
export const groupByStatus = (
  staffList: StaffMember[]
): Record<StaffStatus, StaffMember[]> => {
  const grouped: Record<string, StaffMember[]> = {
    active: [],
    inactive: [],
    terminated: [],
  };

  staffList.forEach((staff) => {
    grouped[staff.status].push(staff);
  });

  return grouped as Record<StaffStatus, StaffMember[]>;
};

// ============================================================================
// DATA EXTRACTION
// ============================================================================

/**
 * Extract unique departments
 */
export const extractDepartments = (staffList: StaffMember[]): string[] => {
  const departments = new Set(staffList.map((staff) => staff.department));
  return Array.from(departments).sort();
};

/**
 * Extract unique positions
 */
export const extractPositions = (staffList: StaffMember[]): string[] => {
  const positions = new Set(staffList.map((staff) => staff.position));
  return Array.from(positions).sort();
};

/**
 * Get staff by ID
 */
export const getStaffById = (
  staffList: StaffMember[],
  staffId: string
): StaffMember | undefined => {
  return staffList.find((staff) => staff.id === staffId);
};

/**
 * Get staff by employee ID
 */
export const getStaffByEmployeeId = (
  staffList: StaffMember[],
  employeeId: string
): StaffMember | undefined => {
  return staffList.find((staff) => staff.employeeId === employeeId);
};

// ============================================================================
// FORMATTING
// ============================================================================

/**
 * Format hire date for display
 */
export const formatHireDate = (hireDate: string): string => {
  return new Date(hireDate).toLocaleDateString();
};

/**
 * Calculate years of service
 */
export const calculateYearsOfService = (hireDate: string): number => {
  const hire = new Date(hireDate);
  const now = new Date();
  const diffMs = now.getTime() - hire.getTime();
  const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(years);
};

/**
 * Format status for display
 */
export const formatStatus = (status: StaffStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
