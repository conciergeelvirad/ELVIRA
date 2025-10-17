import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase";

type Hotel = Database["public"]["Tables"]["hotels"]["Row"];
type HotelInsert = Database["public"]["Tables"]["hotels"]["Insert"];

export function useCreateHotel() {
  const queryClient = useQueryClient();

  return useMutation<Hotel, Error, HotelInsert>({
    mutationFn: async (newHotel) => {
      const { data, error } = await supabase
        .from("hotels")
        .insert(newHotel)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch hotels query
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
}
