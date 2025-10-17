/**
 * Staff Schedule Queries
 *
 * React Query hooks for managing staff schedules
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";

// Types matching the actual database schema
export interface StaffSchedule {
  id: string;
  staff_id: string;
  hotel_id: string;
  schedule_start_date: string; // date
  schedule_finish_date: string; // date
  shift_start: string; // time
  shift_end: string; // time
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes: string | null;
  is_confirmed: boolean;
  confirmed_by: string | null;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Insert type - only fields that exist in the database
export interface StaffScheduleInsert {
  staff_id: string;
  hotel_id: string;
  schedule_start_date: string;
  schedule_finish_date: string;
  shift_start: string;
  shift_end: string;
  status?: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string | null;
  created_by?: string | null;
  // Note: is_confirmed, confirmed_by, confirmed_at should not be set on insert
  // They are controlled by the confirmation workflow
}

export interface StaffScheduleUpdate {
  schedule_start_date?: string;
  schedule_finish_date?: string;
  shift_start?: string;
  shift_end?: string;
  status?: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string | null;
  is_confirmed?: boolean;
  confirmed_by?: string | null;
  confirmed_at?: string | null;
}

// Query Keys
export const staffScheduleKeys = {
  all: ["staff-schedules"] as const,
  lists: () => [...staffScheduleKeys.all, "list"] as const,
  list: (hotelId?: string) =>
    [...staffScheduleKeys.lists(), { hotelId }] as const,
  byStaff: (staffId: string) =>
    [...staffScheduleKeys.all, "byStaff", staffId] as const,
  byDateRange: (hotelId: string, startDate: string, endDate: string) =>
    [
      ...staffScheduleKeys.all,
      "dateRange",
      { hotelId, startDate, endDate },
    ] as const,
  byStatus: (hotelId: string, status: string) =>
    [...staffScheduleKeys.all, "status", { hotelId, status }] as const,
  detail: (id: string) => [...staffScheduleKeys.all, "detail", id] as const,
};

/**
 * Get all schedules for a hotel
 */
export const useStaffSchedules = (hotelId?: string) => {
  return useQuery({
    queryKey: staffScheduleKeys.list(hotelId),
    queryFn: async () => {
      console.log("====================================");
      console.log("🔍 [useStaffSchedules] QUERY STARTING");
      console.log("====================================");
      console.log("Hotel ID:", hotelId);
      console.log("Query enabled:", !!hotelId);

      let query = supabase
        .from("staff_schedules")
        .select("*")
        .order("schedule_start_date", { ascending: false });

      if (hotelId) {
        query = query.eq("hotel_id", hotelId);
      }

      console.log("📤 [useStaffSchedules] Executing Supabase query...");
      const { data, error } = await query;

      console.log("====================================");
      console.log("📊 [useStaffSchedules] QUERY RESULT");
      console.log("====================================");
      console.log("Error:", error);
      console.log("Data count:", data?.length || 0);
      console.log("Data:", data);
      console.log("====================================");

      if (error) {
        console.error("❌ [useStaffSchedules] Query error:", error);
        throw error;
      }
      return (data as StaffSchedule[]) || [];
    },
    enabled: !!hotelId,
  });
};

/**
 * Get schedules for a specific staff member
 */
export const useStaffSchedulesByStaff = (staffId: string) => {
  return useQuery({
    queryKey: staffScheduleKeys.byStaff(staffId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .select("*")
        .eq("staff_id", staffId)
        .order("schedule_start_date", { ascending: false });

      if (error) throw error;
      return (data as StaffSchedule[]) || [];
    },
    enabled: !!staffId,
  });
};

/**
 * Get schedules by date range
 */
export const useStaffSchedulesByDateRange = (
  hotelId: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: staffScheduleKeys.byDateRange(hotelId, startDate, endDate),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .select("*")
        .eq("hotel_id", hotelId)
        .gte("schedule_start_date", startDate)
        .lte("schedule_start_date", endDate)
        .order("schedule_start_date", { ascending: true });

      if (error) throw error;
      return (data as StaffSchedule[]) || [];
    },
    enabled: !!hotelId && !!startDate && !!endDate,
  });
};

/**
 * Get schedules by status
 */
export const useStaffSchedulesByStatus = (
  hotelId: string,
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
) => {
  return useQuery({
    queryKey: staffScheduleKeys.byStatus(hotelId, status),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("status", status)
        .order("schedule_start_date", { ascending: false });

      if (error) throw error;
      return (data as StaffSchedule[]) || [];
    },
    enabled: !!hotelId && !!status,
  });
};

/**
 * Get a single schedule by ID
 */
export const useStaffSchedule = (id: string) => {
  return useQuery({
    queryKey: staffScheduleKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as StaffSchedule;
    },
    enabled: !!id,
  });
};

/**
 * Create a new schedule
 */
export const useCreateStaffSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schedule: StaffScheduleInsert) => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .insert([schedule])
        .select()
        .single();

      if (error) {
        console.error("❌ Schedule creation failed:", error.message);
        throw error;
      }

      return data as StaffSchedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffScheduleKeys.all });
    },
  });
};

/**
 * Update an existing schedule
 */
export const useUpdateStaffSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: StaffScheduleUpdate;
    }) => {
      const { data: updated, error } = await supabase
        .from("staff_schedules")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("❌ Schedule update failed:", error.message);
        throw error;
      }

      return updated as StaffSchedule;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: staffScheduleKeys.all });
      queryClient.invalidateQueries({
        queryKey: staffScheduleKeys.detail(data.id),
      });
    },
  });
};

/**
 * Confirm a schedule
 */
export const useConfirmStaffSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      confirmedBy,
    }: {
      id: string;
      confirmedBy: string;
    }) => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .update({
          is_confirmed: true,
          confirmed_by: confirmedBy,
          confirmed_at: new Date().toISOString(),
          status: "CONFIRMED",
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("❌ Schedule confirmation failed:", error.message);
        throw error;
      }

      return data as StaffSchedule;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: staffScheduleKeys.all });
      queryClient.invalidateQueries({
        queryKey: staffScheduleKeys.detail(data.id),
      });
    },
  });
};

/**
 * Cancel a schedule
 */
export const useCancelStaffSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .update({
          status: "CANCELLED",
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("❌ Schedule cancellation failed:", error.message);
        throw error;
      }

      return data as StaffSchedule;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: staffScheduleKeys.all });
      queryClient.invalidateQueries({
        queryKey: staffScheduleKeys.detail(data.id),
      });
    },
  });
};

/**
 * Complete a schedule
 */
export const useCompleteStaffSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .update({
          status: "COMPLETED",
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("❌ Schedule completion failed:", error.message);
        throw error;
      }

      return data as StaffSchedule;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: staffScheduleKeys.all });
      queryClient.invalidateQueries({
        queryKey: staffScheduleKeys.detail(data.id),
      });
    },
  });
};

/**
 * Delete a schedule
 */
export const useDeleteStaffSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("staff_schedules")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("❌ Schedule deletion failed:", error.message);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffScheduleKeys.all });
    },
  });
};
