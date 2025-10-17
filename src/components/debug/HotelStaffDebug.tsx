import { useHotelStaff } from "../../hooks/hotel/useHotelStaff";

export function HotelStaffDebug() {
  const { hotelId, hotelStaff, isLoading, error } = useHotelStaff();

  if (isLoading) return <div>Loading staff data...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 mb-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Hotel Staff Debug Info</h3>
      <pre className="whitespace-pre-wrap text-sm">
        {JSON.stringify(
          {
            hotelId,
            staffId: hotelStaff?.id,
            position: hotelStaff?.position,
            department: hotelStaff?.department,
            createdAt: hotelStaff?.created_at,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
