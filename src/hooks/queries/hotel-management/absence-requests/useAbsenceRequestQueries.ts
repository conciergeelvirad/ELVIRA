/**
 * Absence Request Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  absenceRequestKeys,
  DEFAULT_HOTEL_ID,
  ABSENCE_REQUEST_WITH_STAFF_SELECT,
} from "./absenceRequest.constants";
import {
  transformAbsenceRequest,
  transformAbsenceRequests,
} from "./absenceRequest.transformers";
import type {
  AbsenceRequest,
  AbsenceRequestInsert,
  AbsenceRequestUpdate,
} from "./absenceRequest.types";

// ============================================================================
// QUERY HOOKS
// ============================================================================

export const useAbsenceRequests = (hotelId: string = DEFAULT_HOTEL_ID) => {
  return useQuery({
    queryKey: absenceRequestKeys.list({ hotelId }),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("absence_requests")
        .select(ABSENCE_REQUEST_WITH_STAFF_SELECT)
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return transformAbsenceRequests(data ?? []);
    },
  });
};

export const useAbsenceRequestsByStatus = (
  status: AbsenceRequest["status"],
  hotelId: string = DEFAULT_HOTEL_ID
) => {
  return useQuery({
    queryKey: absenceRequestKeys.list({ hotelId, status }),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("absence_requests")
        .select(ABSENCE_REQUEST_WITH_STAFF_SELECT)
        .eq("hotel_id", hotelId)
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return transformAbsenceRequests(data ?? []);
    },
  });
};

export const useAbsenceRequestsByStaff = (staffId: string) => {
  return useQuery({
    queryKey: absenceRequestKeys.list({ staffId }),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("absence_requests")
        .select(ABSENCE_REQUEST_WITH_STAFF_SELECT)
        .eq("staff_id", staffId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return transformAbsenceRequests(data ?? []);
    },
  });
};

export const useAbsenceRequest = (requestId: string) => {
  return useQuery({
    queryKey: absenceRequestKeys.detail(requestId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("absence_requests")
        .select(ABSENCE_REQUEST_WITH_STAFF_SELECT)
        .eq("id", requestId)
        .single();

      if (error) throw error;
      return transformAbsenceRequest(data);
    },
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export const useCreateAbsenceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: AbsenceRequestInsert) => {
      const { data, error } = await supabase
        .from("absence_requests")
        .insert([request])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: absenceRequestKeys.list({ hotelId: variables.hotel_id }),
      });
      queryClient.invalidateQueries({
        queryKey: absenceRequestKeys.list({ staffId: variables.staff_id }),
      });
    },
  });
};

export const useUpdateAbsenceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: AbsenceRequestUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("absence_requests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: absenceRequestKeys.list({ hotelId: data.hotel_id }),
      });
      queryClient.invalidateQueries({
        queryKey: absenceRequestKeys.list({ staffId: data.staff_id }),
      });
      queryClient.invalidateQueries({
        queryKey: absenceRequestKeys.detail(data.id),
      });
    },
  });
};

export const useUpdateAbsenceRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: AbsenceRequest["status"];
      hotelId: string;
    }) => {
      const { data, error } = await supabase
        .from("absence_requests")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: absenceRequestKeys.list({ hotelId: variables.hotelId }),
      });
      queryClient.invalidateQueries({
        queryKey: absenceRequestKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteAbsenceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; hotelId: string }) => {
      const { error } = await supabase
        .from("absence_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: absenceRequestKeys.list({ hotelId: variables.hotelId }),
      });
    },
  });
};
