/**
 * Hotel Settings Query Hook
 *
 * Fetches hotel settings from the database for a specific hotel.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase";

type HotelSetting = Database["public"]["Tables"]["hotel_settings"]["Row"];

/**
 * Fetches all settings for a specific hotel
 *
 * @param hotelId - The ID of the hotel
 * @returns Query result with array of hotel settings
 *
 * @example
 * const { data: settings, isLoading } = useHotelSettings("hotel-123");
 */
export function useHotelSettings(hotelId: string) {
  return useQuery<HotelSetting[]>({
    queryKey: ["hotel-settings", hotelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotel_settings")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("setting_key", { ascending: true });

      if (error) {
        console.error("[useHotelSettings] Error fetching settings:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!hotelId,
  });
}

/**
 * Fetches a specific setting for a hotel by key
 *
 * @param hotelId - The ID of the hotel
 * @param settingKey - The setting key to fetch
 * @returns Query result with the setting value
 *
 * @example
 * const { data: setting } = useHotelSetting("hotel-123", "about_us");
 */
export function useHotelSetting(hotelId: string, settingKey: string) {
  return useQuery<HotelSetting | null>({
    queryKey: ["hotel-settings", hotelId, settingKey],
    queryFn: async () => {
      console.log(
        `[useHotelSetting] Fetching setting for hotelId: ${hotelId}, key: ${settingKey}`
      );

      const { data, error } = await supabase
        .from("hotel_settings")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("setting_key", settingKey)
        .single();

      if (error) {
        // Return null if not found instead of throwing
        if (error.code === "PGRST116") {
          console.log(
            `[useHotelSetting] Setting not found for key: ${settingKey}`
          );
          return null;
        }
        console.error(
          `[useHotelSetting] Error fetching setting ${settingKey}:`,
          error
        );
        throw error;
      }

      console.log(`[useHotelSetting] Fetched setting ${settingKey}:`, data);
      return data;
    },
    enabled: !!hotelId && !!settingKey,
  });
}
