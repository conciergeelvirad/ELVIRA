import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase";

type Hotel = Database["public"]["Tables"]["hotels"]["Row"];

export function useHotels() {
  return useQuery<Hotel[]>({
    queryKey: ["hotels"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hotels").select("*");

      if (error) throw error;
      return data;
    },
  });
}
