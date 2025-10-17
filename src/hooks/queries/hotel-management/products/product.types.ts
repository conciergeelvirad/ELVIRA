/**
 * Product Type Definitions
 *
 * TypeScript types for product/shop inventory management.
 */

import type { Database } from "../../../../types/supabase";

// Base database types
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

// Operation payloads
export interface ProductUpdateData {
  id: string;
  updates: ProductUpdate;
}

export interface ProductDeletionData {
  id: string;
}
