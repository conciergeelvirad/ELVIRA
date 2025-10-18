import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type { GuestMetrics } from "../types/overview.types";

/**
 * Hook to fetch guest-related metrics
 */
export const useGuestMetrics = () => {
  const [metrics, setMetrics] = useState<GuestMetrics>({
    totalActiveGuests: 0,
    guestsByCountry: [],
    totalGuests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGuestMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch total active guests
        const { count: activeCount, error: activeError } = await supabase
          .from("guests")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);

        if (activeError) throw activeError;

        // Fetch total guests
        const { count: totalCount, error: totalError } = await supabase
          .from("guests")
          .select("*", { count: "exact", head: true });

        if (totalError) throw totalError;

        // Fetch guests with personal data to get country info
        const { data: guestData, error: guestDataError } = await supabase
          .from("guest_personal_data")
          .select("country")
          .not("country", "is", null);

        if (guestDataError) throw guestDataError;

        // Aggregate by country
        const countryMap = new Map<string, number>();
        guestData?.forEach((guest) => {
          const country = guest.country || "Unknown";
          countryMap.set(country, (countryMap.get(country) || 0) + 1);
        });

        const guestsByCountry = Array.from(countryMap.entries())
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Top 5 countries

        setMetrics({
          totalActiveGuests: activeCount || 0,
          totalGuests: totalCount || 0,
          guestsByCountry,
        });
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching guest metrics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuestMetrics();
  }, []);

  return { metrics, isLoading, error };
};
