import { HotelStaff } from "../../types/hotel-staff";

const ADMIN_ONLY_ROUTES = ["overview", "third-party-management", "ai-support"];

export const canAccessRoute = (
  staff: HotelStaff | null,
  routeId: string
): boolean => {
  if (ADMIN_ONLY_ROUTES.includes(routeId)) {
    // Only allow access if user is Hotel Admin or Manager
    return (
      staff?.position === "Hotel Admin" ||
      (staff?.position === "Hotel Staff" && staff?.department === "Manager")
    );
  }

  // All other routes are accessible by default
  return true;
};
