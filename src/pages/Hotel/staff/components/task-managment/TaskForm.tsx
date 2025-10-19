/**
 * Task Form Component
 * Custom form with role-based field restrictions for Hotel Staff
 */

import { useMemo } from "react";
import { DynamicForm } from "../../../../../components/common/crud";
import {
  CRUDFormState,
  CRUDFormActions,
  FormFieldConfig,
} from "../../../../../hooks";

interface TaskFormProps {
  formState: CRUDFormState;
  formActions: CRUDFormActions;
  disabled?: boolean;
  currentUserPosition?: string;
  isEditMode?: boolean;
  taskFormFields?: FormFieldConfig[];
}

export const TaskForm = ({
  formState,
  formActions,
  disabled = false,
  currentUserPosition,
  isEditMode = false,
  taskFormFields = [],
}: TaskFormProps) => {
  // Filter fields based on user position and mode
  const getFilteredFields = useMemo((): FormFieldConfig[] => {
    console.log("🔍 [TaskForm] Current user position:", currentUserPosition);
    console.log("🔍 [TaskForm] Is edit mode:", isEditMode);

    // If current user is "Hotel Staff" (not admin/manager) and in edit mode,
    // only allow editing the status field with limited options
    if (currentUserPosition === "Hotel Staff" && isEditMode) {
      console.log("🔒 [TaskForm] Restricting to status field only");

      // Find the status field and filter its options
      const statusField = taskFormFields.find(
        (field) => field.key === "status"
      );

      if (statusField) {
        const restrictedStatusField: FormFieldConfig = {
          ...statusField,
          options: [
            { value: "IN_PROGRESS", label: "In Progress" },
            { value: "COMPLETED", label: "Completed" },
          ],
        };

        console.log(
          "📋 [TaskForm] Status options restricted to: IN_PROGRESS, COMPLETED"
        );
        return [restrictedStatusField];
      }

      return [];
    }

    console.log("✅ [TaskForm] All fields available");
    return taskFormFields;
  }, [currentUserPosition, isEditMode, taskFormFields]);

  return (
    <DynamicForm
      fields={getFilteredFields}
      formState={formState}
      formActions={formActions}
      disabled={disabled}
    />
  );
};
