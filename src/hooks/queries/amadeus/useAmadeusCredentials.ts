/**
 * Amadeus Credentials Query Hook
 *
 * Retrieves Amadeus API credentials from environment variables or Supabase secrets.
 */

import { useQuery } from "@tanstack/react-query";
import { amadeusKeys } from "./queryKeys";
import { supabase } from "../../../lib/supabase";

interface AmadeusCredentials {
  clientId: string;
  clientSecret: string;
}

const SECRET_KEY_NAME = "TEST.API.AMADEUS_API";

export const useAmadeusCredentials = () => {
  return useQuery<AmadeusCredentials>({
    queryKey: amadeusKeys.credentials(),
    queryFn: async () => {
      // First try environment variables
      const envClientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
      const envClientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

      if (envClientId && envClientSecret) {
        return {
          clientId: envClientId,
          clientSecret: envClientSecret,
        };
      }

      // Fallback to Supabase secrets
      const { data, error } = await supabase
        .from("secrets")
        .select("secret_value")
        .eq("secret_key", SECRET_KEY_NAME)
        .single();

      if (error) {
        throw new Error("Failed to retrieve Amadeus API credentials");
      }

      if (!data?.secret_value) {
        throw new Error(
          "Amadeus API credentials not found. Add them to .env.local or Supabase secrets table."
        );
      }

      const credentials = JSON.parse(data.secret_value);

      if (!credentials.clientId || !credentials.clientSecret) {
        throw new Error("Invalid Amadeus API credentials format");
      }

      return credentials;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
