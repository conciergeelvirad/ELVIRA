/**
 * REFACTORED EXAMPLE: QA Recommendations Queries
 *
 * This is an example of how to refactor the query files using the reusable utilities
 * from queryUtils.ts to reduce duplication and improve maintainability.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import {
  Tables,
  Insert,
  Update,
  createQueryKeys,
  createQueryOptions,
  createMutationOptions,
} from "../queryUtils";

// ============================================================================
// TYPES
// ============================================================================

export type QARecommendation = Tables<"qa_recommendations">;
export type QARecommendationInsert = Insert<"qa_recommendations">;
export type QARecommendationUpdate = Update<"qa_recommendations">;

export type QARecommendationType = "Q&A" | "Recommendation";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const qaKeys = createQueryKeys("qa-recommendations");

// Additional custom keys for this resource
export const qaRecommendationKeys = {
  ...qaKeys,
  byType: (hotelId: string, type: QARecommendationType) =>
    [...qaKeys.all, "type", hotelId, type] as const,
  byCategory: (hotelId: string, category: string) =>
    [...qaKeys.all, "category", hotelId, category] as const,
  categories: (hotelId: string) =>
    [...qaKeys.all, "categories", hotelId] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Fetch all QA recommendations for a hotel
 */
export const useQARecommendations = (hotelId: string) => {
  return useQuery({
    queryKey: qaKeys.list(hotelId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as QARecommendation[];
    },
    ...createQueryOptions.withHotelId(hotelId),
  });
};

/**
 * Fetch only active QA recommendations
 */
export const useActiveQARecommendations = (hotelId: string) => {
  return useQuery({
    queryKey: qaKeys.active(hotelId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("category", { ascending: true });

      if (error) throw error;
      return data as QARecommendation[];
    },
    ...createQueryOptions.withHotelId(hotelId),
  });
};

/**
 * Fetch QA recommendations by type
 */
export const useQARecommendationsByType = (
  hotelId: string,
  type: QARecommendationType
) => {
  return useQuery({
    queryKey: qaRecommendationKeys.byType(hotelId, type),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("type", type)
        .eq("is_active", true)
        .order("category", { ascending: true });

      if (error) throw error;
      return data as QARecommendation[];
    },
    ...createQueryOptions.withConditions(hotelId, type),
  });
};

/**
 * Fetch QA recommendations by category
 */
export const useQARecommendationsByCategory = (
  hotelId: string,
  category: string
) => {
  return useQuery({
    queryKey: qaRecommendationKeys.byCategory(hotelId, category),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("category", category)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as QARecommendation[];
    },
    ...createQueryOptions.withConditions(hotelId, category),
  });
};

/**
 * Fetch a single QA recommendation by ID
 */
export const useQARecommendationById = (id: string | undefined) => {
  return useQuery({
    queryKey: qaKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("ID is required");

      const { data, error } = await supabase
        .from("qa_recommendations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as QARecommendation;
    },
    ...createQueryOptions.withId(id),
  });
};

/**
 * Search QA recommendations
 */
export const useSearchQARecommendations = (
  hotelId: string,
  searchText: string
) => {
  return useQuery({
    queryKey: qaKeys.search(hotelId, searchText),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select("*")
        .eq("hotel_id", hotelId)
        .or(`question.ilike.%${searchText}%,answer.ilike.%${searchText}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as QARecommendation[];
    },
    ...createQueryOptions.withConditions(hotelId, searchText.length > 0),
  });
};

/**
 * Get unique categories for a hotel
 */
export const useQACategories = (hotelId: string) => {
  return useQuery({
    queryKey: qaRecommendationKeys.categories(hotelId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .select("category")
        .eq("hotel_id", hotelId)
        .eq("is_active", true);

      if (error) throw error;

      const uniqueCategories = [
        ...new Set(data.map((item) => item.category)),
      ].sort();

      return uniqueCategories;
    },
    ...createQueryOptions.withHotelId(hotelId),
  });
};

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new QA recommendation
 */
export const useCreateQARecommendation = () => {
  const queryClient = useQueryClient();
  const mutationHelpers = createMutationOptions<QARecommendation>(
    qaRecommendationKeys,
    queryClient
  );

  return useMutation({
    mutationFn: async (newItem: QARecommendationInsert) => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .insert(newItem)
        .select()
        .single();

      if (error) throw error;
      return data as QARecommendation;
    },
    onSuccess: mutationHelpers.onCreateSuccess,
  });
};

/**
 * Update an existing QA recommendation
 */
export const useUpdateQARecommendation = () => {
  const queryClient = useQueryClient();
  const mutationHelpers = createMutationOptions<QARecommendation>(
    qaRecommendationKeys,
    queryClient
  );

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
      return data as QARecommendation;
    },
    onSuccess: mutationHelpers.onUpdateSuccess,
  });
};

/**
 * Delete a QA recommendation
 */
export const useDeleteQARecommendation = () => {
  const queryClient = useQueryClient();
  const mutationHelpers = createMutationOptions<QARecommendation>(
    qaRecommendationKeys,
    queryClient
  );

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("qa_recommendations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: mutationHelpers.onDeleteSuccess,
  });
};

/**
 * Toggle active status
 */
export const useToggleQARecommendationActive = () => {
  const queryClient = useQueryClient();
  const mutationHelpers = createMutationOptions<QARecommendation>(
    qaRecommendationKeys,
    queryClient
  );

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("qa_recommendations")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as QARecommendation;
    },
    onSuccess: mutationHelpers.onUpdateSuccess,
  });
};
