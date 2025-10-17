import { StaffMember } from "../../../data/staff";
import { useCRUD } from "../../../hooks";
import { FormFieldConfig } from "../../../hooks";

// Define enhanced type for StaffMember
export type EnhancedStaffMember = StaffMember & Record<string, unknown>;

// Make sure StaffMember satisfies the Record<string, unknown> constraint
type StaffMemberEntity = StaffMember & Record<string, unknown>;

interface UseStaffMemberCRUDProps {
  initialStaff: StaffMember[];
  formFields: FormFieldConfig[];
}

export const useStaffMemberCRUD = ({
  initialStaff,
  formFields,
}: UseStaffMemberCRUDProps) => {
  // Cast initialStaff to satisfy the CRUDEntity constraint
  const initialData = initialStaff as StaffMemberEntity[];

  // Use the generic CRUD hook with our StaffMember type
  const crud = useCRUD<StaffMemberEntity>({
    initialData,
    formFields,
    searchFields: ["name", "position", "department", "email"],
    defaultViewMode: "list",
    // Customize how new entities are created
    formatNewEntity: (formData) => ({
      ...formData,
      hireDate: new Date().toISOString().split("T")[0],
      status: "active" as const,
      availability: "On Duty",
    }),
    // Customize how entities are updated
    formatUpdatedEntity: (formData) => formData,
  });

  // Map crud result to the expected return structure
  return {
    staff: crud.data as StaffMember[],
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
