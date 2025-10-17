/**
 * Product Query Hooks
 *
 * React Query hooks for product/shop inventory management.
 * Provides hooks for fetching, creating, updating, and deleting products.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  Product,
  ProductInsert,
  ProductUpdateData,
  ProductDeletionData,
} from "./product.types";
import { productKeys } from "./product.constants";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetches all products for a specific hotel (both active and inactive)
 *
 * @param hotelId - ID of the hotel to fetch products for
 * @returns Query result with products array (all products)
 */
export const useProducts = (hotelId: string) => {
  return useQuery({
    queryKey: productKeys.list({ hotelId }),
    queryFn: async (): Promise<Product[]> => {
      console.log("🔍 FETCHING PRODUCTS for hotel:", hotelId);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });
      // Removed .eq("is_active", true) to show both active and inactive items
      // Added stable ordering by created_at to prevent re-sorting on updates

      if (error) {
        console.error("❌ FETCH PRODUCTS ERROR:", error);
        throw error;
      }
      console.log("✅ FETCHED PRODUCTS:", data?.length, "items");
      return data || [];
    },
  });
};

/**
 * Fetches a single product by ID
 *
 * @param id - ID of the product to fetch
 * @returns Query result with single product
 */
export const useProductDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: productKeys.detail(id || ""),
    queryFn: async (): Promise<Product> => {
      if (!id) {
        throw new Error("Product ID is required");
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Fetches unique product categories for a hotel
 *
 * @param hotelId - ID of the hotel
 * @returns Query result with categories array
 */
export const useProductCategories = (hotelId: string) => {
  return useQuery({
    queryKey: productKeys.categories(hotelId),
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("category")
        .eq("hotel_id", hotelId);
      // Removed .eq("is_active", true) to show all categories

      if (error) throw error;

      // Get unique categories
      const categories = [...new Set(data.map((item) => item.category))];
      return categories.sort();
    },
  });
};

/**
 * Fetches mini bar products for a hotel (both active and inactive)
 *
 * @param hotelId - ID of the hotel
 * @returns Query result with mini bar products array
 */
export const useMiniBarProducts = (hotelId: string) => {
  return useQuery({
    queryKey: productKeys.miniBar(hotelId),
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("mini_bar", true);
      // Removed .eq("is_active", true) to show all mini bar products

      if (error) throw error;
      return data || [];
    },
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Creates a new product
 *
 * @returns Mutation result for creating product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: ProductInsert): Promise<Product> => {
      const { data, error } = await supabase
        .from("products")
        .insert(newProduct)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.list({ hotelId: variables.hotel_id }),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.categories(variables.hotel_id),
      });
    },
  });
};

/**
 * Updates an existing product
 *
 * @returns Mutation result for updating product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: ProductUpdateData): Promise<Product> => {
      console.log("🔄 UPDATE PRODUCT MUTATION:", { id, updates });
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("❌ UPDATE PRODUCT ERROR:", error);
        throw error;
      }
      console.log("✅ UPDATE PRODUCT SUCCESS:", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("🔄 INVALIDATING QUERIES after product update");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
      queryClient.invalidateQueries({
        queryKey: productKeys.list({ hotelId: data.hotel_id }),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.categories(data.hotel_id),
      });
    },
  });
};

/**
 * Deletes a product (soft delete by setting is_active to false)
 *
 * @returns Mutation result for deleting product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: ProductDeletionData): Promise<string> => {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from("products")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
};
