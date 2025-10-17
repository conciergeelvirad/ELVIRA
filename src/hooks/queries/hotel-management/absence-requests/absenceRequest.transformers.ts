/**
 * Absence Request Transformers
 *
 * Contains data transformation functions to convert between different representations.
 */

import type {
  ExtendedAbsenceRequest,
  AbsenceRequestWithStaff,
} from "./absenceRequest.types";

// ============================================================================
// TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transform extended absence request (with joins) to UI-friendly format
 *
 * Flattens nested staff data and converts snake_case to camelCase for easier
 * consumption in React components.
 *
 * @param request - Absence request with nested staff relationship
 * @returns Transformed absence request with flattened staff data
 *
 * @example
 * ```ts
 * const apiData = await supabase.from("absence_requests").select("*, staff(...)");
 * const uiData = transformAbsenceRequest(apiData);
 * // Now you can use: uiData.staffName instead of request.staff?.personal_data[0]?.first_name
 * ```
 */
export const transformAbsenceRequest = (
  request: ExtendedAbsenceRequest
): AbsenceRequestWithStaff => {
  // Extract first personal data item (staff can have multiple, but we use primary)
  const personalData = Array.isArray(request.staff?.hotel_staff_personal_data)
    ? request.staff.hotel_staff_personal_data[0]
    : request.staff?.hotel_staff_personal_data;

  return {
    // Core request data
    id: request.id,
    staffId: request.staff_id,
    hotelId: request.hotel_id,
    requestType: request.request_type as
      | "vacation"
      | "sick"
      | "personal"
      | "training"
      | "other",
    startDate: request.start_date,
    endDate: request.end_date,
    status: request.status as "pending" | "approved" | "rejected" | "cancelled",
    notes: request.notes,
    createdAt: request.created_at,
    updatedAt: request.updated_at,
    dataProcessingConsent: request.data_processing_consent,
    consentDate: request.consent_date,

    // Flattened staff information
    staffName: personalData
      ? `${personalData.first_name} ${personalData.last_name}`
      : null,
    staffEmail: personalData?.email ?? null,
    staffPosition: request.staff?.position ?? null,
    staffDepartment: request.staff?.department ?? null,
    staffEmployeeId: request.staff?.employee_id ?? null,
    staffAvatar: personalData?.avatar_url ?? null,
  };
};

/**
 * Transform multiple absence requests
 *
 * @param requests - Array of absence requests with staff data
 * @returns Array of transformed requests
 */
export const transformAbsenceRequests = (
  requests: ExtendedAbsenceRequest[]
): AbsenceRequestWithStaff[] => {
  return requests.map(transformAbsenceRequest);
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get full staff name from personal data
 *
 * @param firstName - Staff first name
 * @param lastName - Staff last name
 * @returns Full name or null if data missing
 */
export const getStaffFullName = (
  firstName?: string | null,
  lastName?: string | null
): string | null => {
  if (!firstName && !lastName) return null;
  return `${firstName || ""} ${lastName || ""}`.trim();
};

/**
 * Format absence request date range
 *
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Formatted date range (e.g., "Jan 1 - Jan 5, 2024")
 */
export const formatAbsenceDateRange = (
  startDate: string,
  endDate: string
): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const startFormatted = start.toLocaleDateString("en-US", options);
  const endFormatted = end.toLocaleDateString("en-US", {
    ...options,
    year: "numeric",
  });

  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Calculate duration of absence in days
 *
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Number of days (inclusive)
 */
export const calculateAbsenceDuration = (
  startDate: string,
  endDate: string
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // +1 to include both start and end day
};
