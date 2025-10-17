/**
 * Google Places API Key Query Hook
 *
 * Fetches the Google Places API key from environment variables or Supabase secrets.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { googlePlacesKeys } from "./queryKeys";

/**
 * Fetches Google Places API key from Supabase secrets table or environment variable
 *
 * Priority:
 * 1. Environment variable (VITE_GOOGLE_PLACES_API_KEY) - for development
 * 2. Supabase secrets table (PLACES_GOOGLE_API) - for production
 *
 * @returns Query result with API key string
 *
 * @example
 * const { data: apiKey, isLoading } = useGooglePlacesApiKey();
 */
export const useGooglePlacesApiKey = () => {
  return useQuery<string>({
    queryKey: googlePlacesKeys.apiKey(),
    queryFn: async () => {
      // First, try to get from environment variable (for development)
      const envKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
      if (envKey) {
        console.log("Using Google Places API key from environment");
        return envKey;
      }

      // Otherwise, fetch from Supabase secrets table
      console.log("Fetching Google Places API key from Supabase...");
      const { data, error } = await supabase
        .from("secrets")
        .select("value")
        .eq("key", "PLACES_GOOGLE_API")
        .single();

      if (error) {
        console.error("Error fetching Google Places API key:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw new Error(
          `Google Places API key not found in Supabase secrets table. Error: ${error.message}`
        );
      }

      if (!data?.value) {
        throw new Error("Google Places API key value is empty");
      }

      console.log("Successfully fetched API key from Supabase");
      return data.value as string;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - API key doesn't change often
    retry: 1, // Only retry once
  });
};
