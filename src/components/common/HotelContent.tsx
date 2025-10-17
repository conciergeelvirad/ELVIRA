import { useHotelStaff } from "../../hooks/hotel/useHotelStaff";
import { HotelProvider } from "../../contexts";

interface HotelContentProps {
  children: React.ReactNode;
}

export function HotelContent({ children }: HotelContentProps) {
  const { hotelId, isLoading, error } = useHotelStaff();

  if (isLoading) {
    return <div>Loading hotel data...</div>;
  }

  if (error) {
    return <div>Error loading hotel data: {error.message}</div>;
  }

  if (!hotelId) {
    return <div>No hotel assigned to this staff member</div>;
  }

  return <HotelProvider initialHotelId={hotelId}>{children}</HotelProvider>;
}
