/**
 * QA Recommendations Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  qaRecommendationsKeys,
  QA_RECOMMENDATION_WITH_DETAILS_SELECT,
  QA_RECOMMENDATION_SIMPLE_SELECT,
} from "./qaRecommendation.constants";
import { extractUniqueCategories } from "./qaRecommendation.transformers";
import type {
  QARecommendation,
  QARecommendationInsert,
  QARecommendationUpdate,
  QARecommendationWithDetails,
  QARecommendationType,
} from "./qaRecommendation.types";

// ============================================================================
// QUERY HOOKS
// ============================================================================

export const useQARecommendations = (hotelId: string) => {
  return useQuery({
    queryKey: qaRecommendationsKeys.list(hotelId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select(QA_RECOMMENDATION_WITH_DETAILS_SELECT)
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as QARecommendationWithDetails[];
    },
    enabled: !!hotelId,
  });
};

export const useActiveQARecommendations = (hotelId: string) => {
  return useQuery({
    queryKey: qaRecommendationsKeys.active(hotelId),
    queryFn: async () => {
      console.log("🔍 [useActiveQARecommendations] Starting query", {
        hotelId,
        enabled: !!hotelId,
      });

      const { data, error } = await supabase
        .from("qa_recommendations")
        .select(QA_RECOMMENDATION_WITH_DETAILS_SELECT)
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("category", { ascending: true });

      console.log("📥 [useActiveQARecommendations] Query result", {
        hasData: !!data,
        dataLength: data?.length || 0,
        hasError: !!error,
        error: error?.message,
        firstItem: data?.[0]
          ? {
              id: data[0].id,
              question: data[0].question,
              category: data[0].category,
              isActive: data[0].is_active,
            }
          : null,
      });

      if (error) {
        console.error("❌ [useActiveQARecommendations] Query error:", error);
        throw error;
      }

      return data as QARecommendationWithDetails[];
    },
    enabled: !!hotelId,
  });
};

export const useQARecommendationsByCategory = (
  hotelId: string,
  category: string
) => {
  return useQuery({
    queryKey: qaRecommendationsKeys.byCategory(hotelId, category),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select(QA_RECOMMENDATION_WITH_DETAILS_SELECT)
        .eq("hotel_id", hotelId)
        .eq("category", category)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as QARecommendationWithDetails[];
    },
    enabled: !!hotelId && !!category,
  });
};

export const useQARecommendationsByType = (
  hotelId: string,
  type: QARecommendationType
) => {
  return useQuery({
    queryKey: qaRecommendationsKeys.byType(hotelId, type),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select(QA_RECOMMENDATION_SIMPLE_SELECT)
        .eq("hotel_id", hotelId)
        .eq("type", type)
        .eq("is_active", true)
        .order("category", { ascending: true });

      if (error) throw error;
      return data as QARecommendation[];
    },
    enabled: !!hotelId && !!type,
  });
};

export const useQARecommendationById = (
  recommendationId: string | undefined
) => {
  return useQuery({
    queryKey: qaRecommendationsKeys.detail(recommendationId || ""),
    queryFn: async () => {
      if (!recommendationId) {
        throw new Error("Recommendation ID is required");
      }

      const { data, error } = await supabase
        .from("qa_recommendations")
        .select(QA_RECOMMENDATION_WITH_DETAILS_SELECT)
        .eq("id", recommendationId)
        .single();

      if (error) throw error;
      return data as QARecommendationWithDetails;
    },
    enabled: !!recommendationId,
  });
};

export const useSearchQARecommendations = (
  hotelId: string,
  searchText: string
) => {
  return useQuery({
    queryKey: qaRecommendationsKeys.search(hotelId, searchText),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select(QA_RECOMMENDATION_WITH_DETAILS_SELECT)
        .eq("hotel_id", hotelId)
        .or(`question.ilike.%${searchText}%,answer.ilike.%${searchText}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as QARecommendationWithDetails[];
    },
    enabled: !!hotelId && searchText.length > 0,
  });
};

export const useQACategories = (hotelId: string) => {
  return useQuery({
    queryKey: qaRecommendationsKeys.categories(hotelId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true);

      if (error) throw error;

      return extractUniqueCategories(data);
    },
    enabled: !!hotelId,
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export const useCreateQARecommendation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRecommendation: QARecommendationInsert) => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .insert(newRecommendation)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.active(data.hotel_id),
      });
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.byCategory(
          data.hotel_id,
          data.category
        ),
      });
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.byType(
          data.hotel_id,
          data.type as QARecommendationType
        ),
      });
    },
  });
};

export const useUpdateQARecommendation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: QARecommendationUpdate;
    }) => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.active(data.hotel_id),
      });
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.byCategory(
          data.hotel_id,
          data.category
        ),
      });
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.byType(
          data.hotel_id,
          data.type as QARecommendationType
        ),
      });
    },
  });
};

export const useDeleteQARecommendation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("qa_recommendations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.all,
      });
    },
  });
};

export const useToggleQARecommendationActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.active(data.hotel_id),
      });
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.byCategory(
          data.hotel_id,
          data.category
        ),
      });
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.byType(
          data.hotel_id,
          data.type as QARecommendationType
        ),
      });
    },
  });
};

export const useBulkCreateQARecommendations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recommendations: QARecommendationInsert[]) => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .insert(recommendations)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: qaRecommendationsKeys.all,
      });
    },
  });
};
