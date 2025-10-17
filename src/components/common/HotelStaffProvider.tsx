import { createContext, useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { supabase } from "../../lib/supabase";

export interface HotelStaff {
  id: string;
  hotel_id: string;
  created_at: string;
  position: string;
  department: string;
}

export interface HotelStaffContextType {
  hotelId: string | null;
  isLoading: boolean;
  error: Error | null;
  hotelStaff: HotelStaff | null;
}

export const HotelStaffContext = createContext<HotelStaffContextType | null>(
  null
);

export function HotelStaffProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [hotelStaff, setHotelStaff] = useState<HotelStaff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHotelStaff() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("hotel_staff")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setHotelStaff(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch hotel staff data")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchHotelStaff();
  }, [user]);

  return (
    <HotelStaffContext.Provider
      value={{
        hotelId: hotelStaff?.hotel_id ?? null,
        isLoading,
        error,
        hotelStaff,
      }}
    >
      {children}
    </HotelStaffContext.Provider>
  );
}
