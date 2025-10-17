import { useContext } from "react";
import { HotelStaffContext } from "../../components/common/HotelStaffProvider";

export function useHotelStaff() {
  const context = useContext(HotelStaffContext);
  if (!context) {
    throw new Error("useHotelStaff must be used within a HotelStaffProvider");
  }
  return context;
}
