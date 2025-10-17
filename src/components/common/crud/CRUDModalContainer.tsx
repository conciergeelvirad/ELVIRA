import React from "react";
import { FormModal, ConfirmationModal } from "../ui";
import { DynamicForm } from "./DynamicForm";
import { CRUDModalState, CRUDModalActions } from "../../../hooks";
import {
  FormFieldConfig,
  CRUDFormState,
  CRUDFormActions,
} from "../../../hooks";
import { CRUDDetailModal } from "./CRUDDetailModal";

interface CRUDModalContainerProps<T> {
  // Modal state and actions
  modalState: CRUDModalState<T>;
  modalActions: CRUDModalActions<T>;

  // Form state and actions
  formState: CRUDFormState;
  formActions: CRUDFormActions;

  // Configuration
  formFields: FormFieldConfig[];
  entityName: string; // e.g., "Contact", "Product", "User"

  // CRUD handlers
  onCreateSubmit: () => Promise<void> | void;
  onEditSubmit: () => Promise<void> | void;
  onDeleteConfirm: () => Promise<void> | void;

  // Customization
  createModalTitle?: string;
  editModalTitle?: string;
  deleteModalTitle?: string;
  detailModalTitle?: string;
  createButtonText?: string;
  editButtonText?: string;
  deleteButtonText?: string;

  // Detail modal customization
  renderDetailContent?: (item: T) => React.ReactNode;
  detailModalActions?: {
    showEdit?: boolean;
    showDelete?: boolean;
    customActions?: React.ReactNode;
  };

  // Custom form component (optional)
  customFormComponent?: React.ComponentType<{
    formState: CRUDFormState;
    formActions: CRUDFormActions;
    fields: FormFieldConfig[];
    disabled?: boolean;
    isEditMode?: boolean;
    [key: string]: unknown; // Allow additional props
  }>;
  customFormProps?: Record<string, unknown>; // Additional props to pass to custom form

  // Multi-guest support
  enableMultiGuest?: boolean;
}

export const CRUDModalContainer = <T extends { id: string | number }>({
  modalState,
  modalActions,
  formState,
  formActions,
  formFields,
  entityName,
  onCreateSubmit,
  onEditSubmit,
  onDeleteConfirm,
  createModalTitle,
  editModalTitle,
  deleteModalTitle,
  detailModalTitle,
  createButtonText = "Create",
  editButtonText = "Save Changes",
  deleteButtonText = "Delete",
  renderDetailContent,
  detailModalActions = { showEdit: true, showDelete: true },
  customFormComponent: CustomFormComponent,
  customFormProps = {},
  enableMultiGuest = false,
}: CRUDModalContainerProps<T>): React.ReactElement => {
  // Use custom form component or default to DynamicForm
  const FormComponent = CustomFormComponent || DynamicForm;
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formActions.validateForm()) {
      formActions.setSubmitting(true);
      try {
        await onCreateSubmit();
        modalActions.closeAllModals();
        formActions.resetForm();
      } catch {
        formActions.setError(
          "general",
          `Failed to create ${entityName.toLowerCase()}`
        );
      } finally {
        formActions.setSubmitting(false);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formActions.validateForm()) {
      formActions.setSubmitting(true);
      try {
        await onEditSubmit();
        modalActions.closeAllModals();
        formActions.resetForm();
      } catch {
        formActions.setError(
          "general",
          `Failed to update ${entityName.toLowerCase()}`
        );
      } finally {
        formActions.setSubmitting(false);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    modalActions.setSubmitting(true);
    try {
      await onDeleteConfirm();
      modalActions.closeAllModals();
    } catch {
      // Error handling
    } finally {
      modalActions.setSubmitting(false);
    }
  };

  return (
    <>
      {/* Create Modal */}
      <FormModal
        isOpen={modalState.showCreateModal}
        onClose={modalActions.closeAllModals}
        onSubmit={handleCreateSubmit}
        title={createModalTitle || `Add ${entityName}`}
        submitText={createButtonText}
        isLoading={formState.isSubmitting}
      >
        <FormComponent
          fields={formFields}
          formState={formState}
          formActions={formActions}
          enableMultiGuest={enableMultiGuest}
          {...customFormProps}
        />
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={modalState.showEditModal}
        onClose={() => {
          modalActions.closeAllModals();
          formActions.resetForm();
        }}
        onSubmit={handleEditSubmit}
        title={editModalTitle || `Edit ${entityName}`}
        submitText={editButtonText}
        isLoading={formState.isSubmitting}
      >
        <FormComponent
          fields={formFields}
          formState={formState}
          formActions={formActions}
          enableMultiGuest={false}
          {...customFormProps}
        />
      </FormModal>

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={modalState.showDeleteModal}
        onClose={modalActions.closeAllModals}
        onConfirm={handleDeleteConfirm}
        title={deleteModalTitle || `Delete ${entityName}`}
        message={`Are you sure you want to delete this ${entityName.toLowerCase()}? This action cannot be undone.`}
        variant="danger"
        confirmText={deleteButtonText}
        isLoading={modalState.isSubmitting}
      />

      {/* Detail Modal */}
      <CRUDDetailModal
        isOpen={modalState.showDetailModal}
        onClose={modalActions.closeAllModals}
        title={detailModalTitle || `${entityName} Details`}
        data={modalState.itemToView}
        onEdit={
          detailModalActions.showEdit && modalState.itemToView
            ? () => {
                modalActions.closeAllModals();
                modalActions.openEditModal(modalState.itemToView!);
              }
            : undefined
        }
        onDelete={
          detailModalActions.showDelete && modalState.itemToView
            ? () => {
                modalActions.closeAllModals();
                modalActions.openDeleteModal(modalState.itemToView!);
              }
            : undefined
        }
        renderDetailContent={renderDetailContent}
      />
    </>
  );
};
