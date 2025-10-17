import { FormFieldConfig } from "../../../../hooks";
import type {
  Product,
  ProductInsert,
  ProductUpdate,
} from "../../../../hooks/queries/hotel-management/products";
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../../../hooks/queries/hotel-management/products";
import { useCRUDWithMutations, getHotelId } from "../useCRUDWithMutations";

// Define enhanced type for Product
export type EnhancedProduct = Product & {
  // Add any additional UI-specific fields here
  formattedPrice?: string;
  formattedStock?: string;
  categoryDisplay?: string;
};

// Make sure Product satisfies the Record<string, unknown> constraint
type ProductForCRUD = Product & Record<string, unknown>;

interface UseProductCRUDProps {
  initialProducts: Product[];
  formFields: FormFieldConfig[];
}

export const useProductCRUD = ({
  initialProducts,
  formFields,
}: UseProductCRUDProps) => {
  // Use the CRUD with mutations helper for database integration
  const crud = useCRUDWithMutations<
    ProductForCRUD,
    ProductInsert,
    { id: string; updates: ProductUpdate }
  >({
    initialData: initialProducts as ProductForCRUD[],
    formFields,
    searchFields: ["name", "description", "category"],
    defaultViewMode: "grid",
    createMutation: useCreateProduct(),
    updateMutation: useUpdateProduct(),
    deleteMutation: useDeleteProduct(),
    // Transform form data to database insert format
    transformCreate: (data) => ({
      name: (data.name as string) || "",
      description: (data.description as string) || undefined,
      category: (data.category as string) || "other",
      price: (data.price as number) ?? 0,
      stock_quantity: (data.stock_quantity as number) ?? 0,
      is_available: (data.is_available as boolean) ?? true,
      hotel_id: getHotelId(),
    }),
    // Transform form data to database update format
    transformUpdate: (id, data) => {
      const updatePayload = {
        id: id as string,
        updates: {
          ...(data.name !== undefined && { name: data.name as string }),
          ...(data.description !== undefined && {
            description: (data.description as string) || undefined,
          }),
          ...(data.category !== undefined && {
            category: data.category as string,
          }),
          ...(data.price !== undefined && { price: data.price as number }),
          ...(data.stock_quantity !== undefined && {
            stock_quantity: data.stock_quantity as number,
          }),
          ...(data.is_active !== undefined && {
            is_active: data.is_active as boolean,
          }),
        },
      };
      console.log("🔄 transformUpdate PRODUCT:", { id, data, updatePayload });
      return updatePayload;
    },
    // Transform ID for delete operation
    transformDelete: (id) => id as string,
    // Optional: Customize how new entities appear in local state
    formatNewEntity: (formData) => ({
      ...formData,
      created_at: new Date().toISOString(),
      is_available: (formData.is_available as boolean) ?? true,
      stock_quantity: (formData.stock_quantity as number) ?? 0,
    }),
    formatUpdatedEntity: (formData) => formData,
  });

  // Map crud result to the expected return structure
  return {
    data: crud.data as Product[],
    searchAndFilter: crud.searchAndFilter,
    modalState: crud.modalState,
    modalActions: crud.modalActions,
    formState: crud.formState,
    formActions: crud.formActions,
    handleStatusToggle: crud.handleStatusToggle,
    handleCreateSubmit: crud.handleCreateSubmit,
    handleEditSubmit: crud.handleEditSubmit,
    handleDeleteConfirm: crud.handleDeleteConfirm,
  };
};
