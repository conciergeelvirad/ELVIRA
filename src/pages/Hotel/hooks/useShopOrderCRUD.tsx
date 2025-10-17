import { useCRUD } from "../../../hooks";
import { FormFieldConfig } from "../../../hooks";
import type { ShopOrder } from "../../../hooks/queries/hotel-management/shop-orders";

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
}

export const useShopOrderCRUD = ({
  initialOrders,
  formFields,
}: UseShopOrderCRUDProps) => {
  // Cast initialOrders to satisfy the CRUDEntity constraint
  const initialDataForCRUD = initialOrders as ShopOrderForCRUD[];

  // Use the generic CRUD hook with our ShopOrder type
  const crud = useCRUD<ShopOrderForCRUD>({
    initialData: initialDataForCRUD,
    formFields,
    searchFields: ["guest_id", "room_number", "status"],
    defaultViewMode: "list",
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
