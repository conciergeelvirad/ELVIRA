/**
 * Utility functions for AmenityRequestsTable
 */

import type { AmenityRequest } from "../../../hooks/queries/hotel-management/amenity-requests/amenity-request.types";
import type { StatusType } from "../../common/data-display/StatusBadge";

/**
 * Convert AmenityRequest status to StatusBadge status type
 *
 * Maps business logic statuses to UI badge variants:
 * - pending → pending (yellow)
 * - approved → info (blue)
 * - rejected → error (red)
 * - delivered → success (green)
 *
 * @param status - The amenity request status
 * @returns The corresponding StatusBadge status type
 */
export const getStatusBadgeType = (
  status: AmenityRequest["status"]
): StatusType => {
  switch (status) {
    case "pending":
      return "pending";
    case "approved":
      return "info";
    case "rejected":
      return "error";
    case "delivered":
      return "success";
    default:
      return "default";
  }
};
