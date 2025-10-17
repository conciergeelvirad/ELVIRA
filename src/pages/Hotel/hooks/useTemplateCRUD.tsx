import { TemplateEntity } from "../../../data/templateData";
import { useCRUD } from "../../../hooks";
import { FormFieldConfig } from "../../../hooks";

// Define enhanced type for Template
export type EnhancedTemplate = TemplateEntity & Record<string, unknown>;

// Make sure TemplateEntity satisfies the Record<string, unknown> constraint
type TemplateEntityForCRUD = TemplateEntity & Record<string, unknown>;

interface UseTemplateCRUDProps {
  initialData: TemplateEntity[];
  formFields: FormFieldConfig[];
}

export const useTemplateCRUD = ({
  initialData,
  formFields,
}: UseTemplateCRUDProps) => {
  // Cast initialData to satisfy the CRUDEntity constraint
  const initialDataForCRUD = initialData as TemplateEntityForCRUD[];

  // Use the generic CRUD hook with our Template type
  const crud = useCRUD<TemplateEntityForCRUD>({
    initialData: initialDataForCRUD,
    formFields,
    searchFields: ["name", "description", "category"], // TODO: Update search fields
    defaultViewMode: "list",
    // Customize how new entities are created
    formatNewEntity: (formData) => ({
      ...formData,
      created: new Date().toLocaleDateString(),
      status: "ACTIVE",
      priority: "Medium",
    }),
    // Customize how entities are updated
    formatUpdatedEntity: (formData) => formData,
  });

  // Map crud result to the expected return structure
  return {
    data: crud.data as TemplateEntity[],
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
