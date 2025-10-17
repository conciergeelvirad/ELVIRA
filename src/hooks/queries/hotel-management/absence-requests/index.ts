/**
 * Absence Requests Module
 *
 * Centralized exports for all absence request related functionality.
 * Import from this file to access types, hooks, and utilities.
 *
 * @example
 * ```ts
 * import {
 *   useAbsenceRequests,
 *   AbsenceRequestWithStaff,
 *   transformAbsenceRequest
 * } from './absence-requests';
 * ```
 */

// Types
export type {
  AbsenceRequest,
  AbsenceRequestInsert,
  AbsenceRequestUpdate,
  ExtendedAbsenceRequest,
  AbsenceRequestWithStaff,
  AbsenceRequestType,
  AbsenceRequestStatus,
} from "./absenceRequest.types";

export {
  ABSENCE_REQUEST_TYPES,
  ABSENCE_REQUEST_STATUSES,
} from "./absenceRequest.types";

// Constants
export {
  absenceRequestKeys,
  DEFAULT_HOTEL_ID,
  ABSENCE_REQUEST_WITH_STAFF_SELECT,
} from "./absenceRequest.constants";

// Transformers
export {
  transformAbsenceRequest,
  transformAbsenceRequests,
  getStaffFullName,
  formatAbsenceDateRange,
  calculateAbsenceDuration,
} from "./absenceRequest.transformers";

// Query Hooks
export {
  useAbsenceRequests,
  useAbsenceRequestsByStatus,
  useAbsenceRequestsByStaff,
  useAbsenceRequest,
  useCreateAbsenceRequest,
  useUpdateAbsenceRequest,
  useUpdateAbsenceRequestStatus,
  useDeleteAbsenceRequest,
} from "./useAbsenceRequestQueries";
