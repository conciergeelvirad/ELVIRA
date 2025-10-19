/**
 * Tasks CRUD Hook
 *
 * Provides CRUD state management and operations for tasks using the useCRUD hook.
 */

import { FormFieldConfig } from "../../../../hooks";
import type { TaskWithStaff } from "../../../../hooks/queries/hotel-management/tasks";
import type {
  TaskInsert,
  TaskUpdateData,
} from "../../../../hooks/queries/hotel-management/tasks/task.types";
import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../../../../hooks/queries/hotel-management/tasks";
import {
  useCRUDWithMutations,
  getHotelId,
} from "../../hooks/useCRUDWithMutations";

// Make sure TaskWithStaff satisfies the Record<string, unknown> constraint
type TaskForCRUD = TaskWithStaff & Record<string, unknown>;

interface UseTasksCRUDProps {
  initialTasks: TaskWithStaff[];
  formFields: FormFieldConfig[];
}

/**
 * Hook for managing Tasks CRUD operations with database integration
 */
export const useTasksCRUD = ({
  initialTasks,
  formFields,
}: UseTasksCRUDProps) => {
  const crud = useCRUDWithMutations<TaskForCRUD, TaskInsert, TaskUpdateData>({
    initialData: initialTasks as TaskForCRUD[],
    formFields,
    searchFields: ["title", "description", "staffName"],
    defaultViewMode: "list",
    createMutation: useCreateTask(),
    updateMutation: useUpdateTask(),
    deleteMutation: useDeleteTask(),
    // Transform form data to database insert format
    transformCreate: (data) => ({
      title: (data.title as string) || "",
      description: (data.description as string) || null,
      priority: (data.priority as "Low" | "Medium" | "High") || "Medium",
      status:
        (data.status as
          | "PENDING"
          | "IN_PROGRESS"
          | "COMPLETED"
          | "CANCELLED") || "PENDING",
      staff_id: (data.staffId as string) || null,
      due_date: (data.dueDate as string) || null,
      hotel_id: getHotelId(),
    }),
    // Transform form data to database update format
    transformUpdate: (id, data) => ({
      id: id as string,
      updates: {
        title: data.title as string,
        description: (data.description as string) || null,
        priority: data.priority as "Low" | "Medium" | "High",
        status: data.status as
          | "PENDING"
          | "IN_PROGRESS"
          | "COMPLETED"
          | "CANCELLED",
        staff_id: (data.staffId as string) || null,
        due_date: (data.dueDate as string) || null,
      },
    }),
    // Transform ID for delete operation
    transformDelete: (id) => ({
      id: id as string,
      hotelId: getHotelId(),
    }),
    // Optional: Customize how new entities appear in local state before server response
    formatNewEntity: (formData) => ({
      ...formData,
      status: "PENDING",
      created_at: new Date().toISOString(),
    }),
  });

  // Map crud result to the expected return structure
  return {
    data: crud.data as TaskWithStaff[],
    searchAndFilter: crud.searchAndFilter,
    modalState: crud.modalState,
    modalActions: crud.modalActions,
    formState: crud.formState,
    formActions: crud.formActions,
    handleCreateSubmit: crud.handleCreateSubmit,
    handleEditSubmit: crud.handleEditSubmit,
    handleDeleteConfirm: crud.handleDeleteConfirm,
  };
};
