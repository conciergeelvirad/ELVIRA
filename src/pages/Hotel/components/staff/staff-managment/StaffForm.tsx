/**
 * Staff Form Component
 * Custom form with logic for position/department relationship
 * and role-based field restrictions
 */

import { useEffect, useMemo } from "react";
import { DynamicForm } from "../../../../../components/common/crud";
import {
  CRUDFormState,
  CRUDFormActions,
  FormFieldConfig,
} from "../../../../../hooks";
import { STAFF_FORM_FIELDS } from "./StaffFormFields";

interface StaffFormProps {
  formState: CRUDFormState;
  formActions: CRUDFormActions;
  disabled?: boolean;
  currentUserPosition?: string;
  isEditMode?: boolean;
}

// Personal data fields that "Hotel Staff" can edit
const PERSONAL_DATA_FIELDS = [
  "name",
  "email",
  "phone",
  "dateOfBirth",
  "city",
  "zipCode",
  "address",
  "emergencyContactName",
  "emergencyContactNumber",
];

export const StaffForm = ({
  formState,
  formActions,
  disabled = false,
  currentUserPosition,
  isEditMode = false,
}: StaffFormProps) => {
  // Watch for position changes and automatically set department
  useEffect(() => {
    const position = formState.formData.position as string;

    if (position === "Hotel Admin") {
      // Auto-set department to Manager for Hotel Admin
      if (formState.formData.department !== "Manager") {
        formActions.updateField("department", "Manager");
      }
    }
  }, [formState.formData.position, formState.formData.department, formActions]);

  // Filter fields based on user position and mode
  const getFilteredFields = useMemo((): FormFieldConfig[] => {
    const position = formState.formData.position as string;

    console.log("🔍 [StaffForm] Current user position:", currentUserPosition);
    console.log("🔍 [StaffForm] Is edit mode:", isEditMode);
    console.log("🔍 [StaffForm] Form data position:", position);

    let fields = STAFF_FORM_FIELDS.map((field) => {
      if (field.key === "department") {
        if (position === "Hotel Admin") {
          // For Hotel Admin, only show Manager
          return {
            ...field,
            options: [{ value: "Manager", label: "Manager" }],
            disabled: true, // Disable since it's auto-selected
          };
        } else if (position === "Hotel Staff") {
          // For Hotel Staff, show all except Manager
          return {
            ...field,
            options: field.options?.filter((opt) => opt.value !== "Manager"),
          };
        }
      }
      return field;
    });

    // If current user is "Hotel Staff" (not admin/manager) and in edit mode,
    // only allow editing personal data fields
    if (currentUserPosition === "Hotel Staff" && isEditMode) {
      console.log("🔒 [StaffForm] Restricting to personal data fields only");
      fields = fields.filter((field) =>
        PERSONAL_DATA_FIELDS.includes(field.key)
      );
      console.log(
        "📋 [StaffForm] Filtered fields:",
        fields.map((f) => f.key)
      );
    } else {
      console.log("✅ [StaffForm] All fields available");
    }

    return fields;
  }, [formState.formData.position, currentUserPosition, isEditMode]);

  return (
    <DynamicForm
      fields={getFilteredFields}
      formState={formState}
      formActions={formActions}
      disabled={disabled}
    />
  );
};
