import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { supabase } from "../../lib/supabase";

// Helper function to convert currency code to symbol
const getCurrencySymbol = (currencyCode: string | null): string => {
  const currencyMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CHF: "CHF",
    CAD: "C$",
    AUD: "A$",
    // Add more currencies as needed
  };

  if (!currencyCode) return "$"; // Default to USD
  return currencyMap[currencyCode.toUpperCase()] || currencyCode;
};

export interface HotelStaff {
  id: string;
  hotel_id: string;
  created_at: string;
  position: string;
  department: string;
}

export interface Hotel {
  id: string;
  name: string;
  currency: string;
  // Add other hotel fields as needed
}

export interface HotelStaffContextType {
  hotelId: string | null;
  isLoading: boolean;
  error: Error | null;
  hotelStaff: HotelStaff | null;
  hotel: Hotel | null;
  currency: string; // Currency symbol (€, $, £, etc.)
  currencyCode: string; // Currency code (EUR, USD, GBP, etc.)
}

export const HotelStaffContext = createContext<HotelStaffContextType | null>(
  null
);

// Custom hook to use the hotel staff context
export function useHotelStaff() {
  const context = useContext(HotelStaffContext);
  if (!context) {
    throw new Error("useHotelStaff must be used within HotelStaffProvider");
  }
  return context;
}

export function HotelStaffProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [hotelStaff, setHotelStaff] = useState<HotelStaff | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHotelStaff() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch hotel staff data
        const { data: staffData, error: staffError } = await supabase
          .from("hotel_staff")
          .select("*")
          .eq("id", user.id)
          .single();

        if (staffError) throw staffError;

        setHotelStaff(staffData);

        // Fetch hotel data (including currency)
        if (staffData?.hotel_id) {
          const { data: hotelData, error: hotelError } = await supabase
            .from("hotels")
            .select("id, name, currency")
            .eq("id", staffData.hotel_id)
            .single();

          if (hotelError) {
            console.warn("Failed to fetch hotel data:", hotelError);
            // Don't throw error, just log it - staff data is more critical
          } else {
            setHotel(hotelData);
          }
        }
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
        hotel,
        currency: getCurrencySymbol(hotel?.currency || null),
        currencyCode: hotel?.currency || "USD",
      }}
    >
      {children}
    </HotelStaffContext.Provider>
  );
}
