/**
 * Hotel Staff Module
 * Barrel export for all staff-related functionality
 */

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  HotelStaff,
  HotelStaffPersonalData,
  HotelStaffInsert,
  HotelStaffPersonalDataInsert,
  HotelStaffUpdate,
  HotelStaffPersonalDataUpdate,
  StaffWithPersonalData,
  StaffMember,
  StaffCreationData,
  StaffUpdateData,
  StaffStatus,
} from "./staff.types";

// ============================================================================
// CONSTANT EXPORTS
// ============================================================================

export {
  DEFAULT_HOTEL_ID,
  hotelStaffKeys,
  STAFF_WITH_PERSONAL_DATA_SELECT,
  STAFF_WITH_FULL_PERSONAL_DATA_SELECT,
  STAFF_SIMPLE_SELECT,
} from "./staff.constants";

// ============================================================================
// TRANSFORMER EXPORTS
// ============================================================================

export {
  // Transformation
  transformStaffMember,
  transformStaffMembers,
  // Name utilities
  getStaffFullName,
  getStaffInitials,
  // Filtering
  filterByStatus,
  filterActiveStaff,
  filterByDepartment,
  filterByPosition,
  searchStaff,
  // Sorting
  sortByName,
  sortByHireDate,
  sortByDepartment,
  // Grouping
  groupByDepartment,
  groupByPosition,
  groupByStatus,
  // Data extraction
  extractDepartments,
  extractPositions,
  getStaffById,
  getStaffByEmployeeId,
  // Formatting
  formatHireDate,
  calculateYearsOfService,
  formatStatus,
} from "./staff.transformers";

// ============================================================================
// QUERY HOOK EXPORTS
// ============================================================================

export { useHotelStaffWithPersonalData, useStaffById } from "./useStaffQueries";

// ============================================================================
// MUTATION HOOK EXPORTS
// ============================================================================

export {
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "./useStaffQueries";
