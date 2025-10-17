import { useHotelStaff } from "./hotel/useHotelStaff";
import type { StaffContext } from "../pages/Hotel/hooks/useCRUDWithMutations";

/**
 * Custom hook to provide standardized staff context for CRUD operations
 * This creates a reusable way to access staff and hotel information
 * across all components that need it.
 */
export const useStaffContext = (): {
  staffContext: StaffContext | null;
  isLoading: boolean;
  error: Error | null;
} => {
  const { hotelId, hotelStaff, isLoading, error } = useHotelStaff();

  if (isLoading || !hotelId || !hotelStaff) {
    return {
      staffContext: null,
      isLoading,
      error: error || (!hotelId ? new Error("No hotel ID available") : null),
    };
  }

  // Log full hotel staff data for debugging
  console.log("Full Hotel Staff Data:", {
    hotelId,
    hotelStaff,
    isLoading,
    error,
    timestamp: new Date().toISOString(),
  });

  const staffContext: StaffContext = {
    hotelId,
    staffId: hotelStaff.id,
    position: hotelStaff.position,
    department: hotelStaff.department,
  };

  console.log("Staff Context:", staffContext);

  return {
    staffContext,
    isLoading: false,
    error: null,
  };
};
