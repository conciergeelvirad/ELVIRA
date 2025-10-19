import { useCRUD } from "../../../../hooks";
import { FormFieldConfig } from "../../../../hooks";
import type { ShopOrder } from "../../../../hooks/queries/hotel-management/shop-orders";
import {
  useUpdateShopOrder,
  useDeleteShopOrder,
} from "../../../../hooks/queries/hotel-management/shop-orders";

// Define enhanced type for ShopOrder
export type EnhancedShopOrder = ShopOrder & {
  // Add any additional UI-specific fields here
  formattedAmount?: string;
  formattedDate?: string;
  guestName?: string;
};

// Make sure ShopOrder satisfies the Record<string, unknown> constraint
type ShopOrderForCRUD = ShopOrder & Record<string, unknown>;

interface UseShopOrderCRUDProps {
  initialOrders: ShopOrder[];
  formFields: FormFieldConfig[];
  hotelId: string;
}

export const useShopOrderCRUD = ({
  initialOrders,
  formFields,
  hotelId,
}: UseShopOrderCRUDProps) => {
  // Cast initialOrders to satisfy the CRUDEntity constraint
  const initialDataForCRUD = initialOrders as ShopOrderForCRUD[];

  // Get mutation hooks for database operations
  const updateMutation = useUpdateShopOrder();
  const deleteMutation = useDeleteShopOrder();

  // Use the generic CRUD hook with our ShopOrder type
  const crud = useCRUD<ShopOrderForCRUD>({
    initialData: initialDataForCRUD,
    formFields,
    searchFields: ["guest_id", "room_number", "status"],
    defaultViewMode: "list",
    // Connect database mutations
    customOperations: {
      update: async (id, data) => {
        console.log("🔄 useShopOrderCRUD - Calling update mutation:", {
          id,
          data,
          hotelId,
        });
        await updateMutation.mutateAsync({
          id: id as string,
          updates: data,
          hotelId,
        });
        console.log("✅ useShopOrderCRUD - Update mutation completed");
      },
      delete: async (id) => {
        await deleteMutation.mutateAsync({
          id: id as string,
          hotelId,
        });
      },
    },
    // Customize how new entities are created
    formatNewEntity: (formData) => ({
      ...formData,
      created_at: new Date().toISOString(),
      status: (formData.status as string) || "PENDING",
    }),
    // Customize how entities are updated
    formatUpdatedEntity: (formData) => formData,
  });

  // Map crud result to the expected return structure
  return {
    data: crud.data as ShopOrder[],
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
