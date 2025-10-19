/**
 * Staff CRUD Hook
 *
 * Provides CRUD state management and operations for staff members using the useCRUD hook.
 */

import { useCRUD, FormFieldConfig } from "../../../../hooks";
import type { StaffMember } from "../../../../types/staff-types";
import {
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "../../../../hooks/queries/hotel-management/staff";

// Make sure StaffMember satisfies the Record<string, unknown> constraint
type StaffForCRUD = StaffMember & Record<string, unknown>;

interface UseStaffCRUDProps {
  initialStaff: StaffMember[];
  formFields: FormFieldConfig[];
}

/**
 * Hook for managing Staff CRUD operations
 */
export const useStaffCRUD = ({
  initialStaff,
  formFields,
}: UseStaffCRUDProps) => {
  // Initialize mutation hooks
  const createStaffMutation = useCreateStaff();
  const updateStaffMutation = useUpdateStaff();
  const deleteStaffMutation = useDeleteStaff();

  // Cast initialStaff to satisfy the CRUDEntity constraint
  const initialDataForCRUD = initialStaff as StaffForCRUD[];

  // Use the generic CRUD hook with our Staff type
  const crud = useCRUD<StaffForCRUD>({
    initialData: initialDataForCRUD,
    formFields,
    searchFields: ["name", "department", "position", "email"],
    defaultViewMode: "list",
    // Customize how new entities are created
    formatNewEntity: (formData) => ({
      ...formData,
      employeeId: `EMP-${Date.now()}`,
      hireDate: new Date().toISOString().split("T")[0],
      status: "active",
    }),
    // Customize how entities are updated
    formatUpdatedEntity: (formData) => formData,
    // Custom database operations
    customOperations: {
      create: async (data) => {
        // Split name into first_name and last_name
        const fullName = (data.name as string) || "";
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const staffData = {
          employee_id: (data.employeeId as string) || `EMP-${Date.now()}`,
          position: (data.position as string) || "",
          department: (data.department as string) || "",
          status: "active" as const,
          hire_date:
            (data.hireDate as string) || new Date().toISOString().split("T")[0],
          hotel_id: "086e11e4-4775-4327-8448-3fa0ee7be0a5", // TODO: Get from context
        };

        const personalData = {
          first_name: firstName,
          last_name: lastName,
          email: (data.email as string) || "",
          phone_number: (data.phone as string) || "",
          date_of_birth: (data.dateOfBirth as string) || undefined,
          city: (data.city as string) || undefined,
          zip_code: (data.zipCode as string) || undefined,
          address: (data.address as string) || undefined,
          emergency_contact_name:
            (data.emergencyContactName as string) || undefined,
          emergency_contact_number:
            (data.emergencyContactNumber as string) || undefined,
        };

        await createStaffMutation.mutateAsync({
          staff: staffData,
          personalData,
        });
      },
      update: async (id, data) => {
        console.log("🔄 [useStaffCRUD] Update initiated for staff ID:", id);
        console.log("📝 [useStaffCRUD] Form data received:", data);

        // Split name into first_name and last_name
        const fullName = (data.name as string) || "";
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        // Only include staffUpdates if position and department are present in data
        // (This handles the case where Hotel Staff only edits personal data)
        let staffUpdates = undefined;
        if (data.position && data.department) {
          staffUpdates = {
            position: data.position as string,
            department: data.department as string,
          };
          console.log(
            "✅ [useStaffCRUD] Staff updates included:",
            staffUpdates
          );
        } else {
          console.log(
            "⚠️ [useStaffCRUD] Staff updates skipped (position/department not in form)"
          );
        }

        const personalDataUpdates = {
          first_name: firstName,
          last_name: lastName,
          email: data.email as string,
          phone_number: data.phone as string,
          date_of_birth: (data.dateOfBirth as string) || undefined,
          city: (data.city as string) || undefined,
          zip_code: (data.zipCode as string) || undefined,
          address: (data.address as string) || undefined,
          emergency_contact_name:
            (data.emergencyContactName as string) || undefined,
          emergency_contact_number:
            (data.emergencyContactNumber as string) || undefined,
        };

        console.log(
          "📋 [useStaffCRUD] Personal data updates:",
          personalDataUpdates
        );

        try {
          await updateStaffMutation.mutateAsync({
            staffId: id as string,
            staffUpdates,
            personalDataUpdates,
          });
          console.log("✅ [useStaffCRUD] Staff update successful");
        } catch (error) {
          console.error("❌ [useStaffCRUD] Staff update failed:", error);
          throw error;
        }
      },
      delete: async (id) => {
        await deleteStaffMutation.mutateAsync(id as string);
      },
    },
  });

  // Map crud result to the expected return structure
  return {
    data: crud.data as StaffMember[],
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
