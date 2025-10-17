/**
 * CRUD with Mutations Helper
 *
 * A reusable helper function that integrates Supabase mutations with the generic useCRUD hook.
 * This reduces code duplication across entity-specific CRUD hooks.
 */

import { useCRUD, FormFieldConfig } from "../../../hooks";

/**
 * Staff context interface for CRUD operations
 */
export interface StaffContext {
  hotelId: string;
  staffId: string;
  position?: string;
  department?: string;
}

/**
 * Configuration for CRUD operations with mutations
 */
export interface CRUDWithMutationsConfig<TEntity, TCreate, TUpdate> {
  // Data configuration
  initialData: TEntity[];
  formFields: FormFieldConfig[];
  searchFields?: string[];
  defaultViewMode?: "list" | "grid";

  // Staff context for operations (optional)
  staffContext?: StaffContext;

  // Mutation hooks - accept any mutation result with mutateAsync
  createMutation: {
    mutateAsync: (data: TCreate) => Promise<any>;
  };
  updateMutation: {
    mutateAsync: (data: TUpdate) => Promise<any>;
  };
  deleteMutation: {
    mutateAsync: (data: any) => Promise<any>;
  };

  // Data transformation functions
  transformCreate: (
    formData: Partial<TEntity & Record<string, unknown>>
  ) => TCreate;
  transformUpdate: (
    id: string | number,
    formData: Partial<TEntity & Record<string, unknown>>
  ) => TUpdate;
  transformDelete?: (
    id: string | number
  ) => string | { id: string; hotelId: string };

  // Optional format functions (for local state)
  formatNewEntity?: (
    formData: Partial<TEntity & Record<string, unknown>>
  ) => Partial<TEntity & Record<string, unknown>>;
  formatUpdatedEntity?: (
    formData: Partial<TEntity & Record<string, unknown>>
  ) => Partial<TEntity & Record<string, unknown>>;
}

/**
 * Creates a CRUD hook with integrated database mutations
 *
 * This helper eliminates the need to manually write customOperations for each entity.
 * It provides a standardized way to integrate Supabase mutations with the generic useCRUD hook.
 *
 * @example
 * ```typescript
 * export const useTasksCRUD = (props) => {
 *   const createMutation = useCreateTask();
 *   const updateMutation = useUpdateTask();
 *   const deleteMutation = useDeleteTask();
 *
 *   return useCRUDWithMutations({
 *     initialData: props.initialTasks,
 *     formFields: props.formFields,
 *     searchFields: ["title", "description"],
 *     createMutation,
 *     updateMutation,
 *     deleteMutation,
 *     transformCreate: (data) => ({
 *       title: data.title,
 *       hotel_id: HOTEL_ID,
 *     }),
 *     transformUpdate: (id, data) => ({
 *       id,
 *       title: data.title,
 *     }),
 *   });
 * };
 * ```
 */
export function useCRUDWithMutations<
  TEntity extends { id: string | number } & Record<string, unknown>,
  TCreate,
  TUpdate
>(config: CRUDWithMutationsConfig<TEntity, TCreate, TUpdate>) {
  const {
    initialData,
    formFields,
    searchFields,
    defaultViewMode = "list",
    createMutation,
    updateMutation,
    deleteMutation,
    transformCreate,
    transformUpdate,
    transformDelete,
    formatNewEntity,
    formatUpdatedEntity,
  } = config;

  // Use the generic CRUD hook with custom operations
  const crud = useCRUD<TEntity>({
    initialData,
    formFields,
    searchFields,
    defaultViewMode,
    formatNewEntity: formatNewEntity as any,
    formatUpdatedEntity: formatUpdatedEntity as any,
    customOperations: {
      create: async (data) => {
        const createData = transformCreate(data);
        await createMutation.mutateAsync(createData);
      },
      update: async (id, data) => {
        const updateData = transformUpdate(id as string, data);
        await updateMutation.mutateAsync(updateData);
      },
      delete: async (id) => {
        const deleteParam = transformDelete
          ? transformDelete(id as string)
          : (id as string);
        await deleteMutation.mutateAsync(deleteParam as any);
      },
    },
  });

  return crud;
}

/**
 * Common helper to get hotel ID
 * This should be passed from the parent component that has access to useHotelStaff
 */
let cachedHotelId: string = "";

export const setHotelId = (hotelId: string) => {
  cachedHotelId = hotelId;
};

export const getHotelId = (): string => {
  return cachedHotelId;
};
