import { useState } from "react";

export interface CRUDModalState<T> {
  // Modal visibility states
  showCreateModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;
  showDetailModal: boolean;

  // Current item states
  itemToEdit: T | null;
  itemToDelete: T | null;
  itemToView: T | null;

  // Form state
  formData: Record<string, unknown>;
  isSubmitting: boolean;
}

export interface CRUDModalActions<T> {
  // Modal actions
  openCreateModal: () => void;
  openEditModal: (item: T) => void;
  openDeleteModal: (item: T) => void;
  openDetailModal: (item: T) => void;
  closeAllModals: () => void;

  // Form actions
  updateFormData: (data: Record<string, unknown>) => void;
  resetForm: () => void;
  setSubmitting: (loading: boolean) => void;
}

export const useCRUDModals = <T extends Record<string, unknown>>(
  formFields: string[],
  externalSetFormData?: (data: Record<string, unknown>) => void
): [CRUDModalState<T>, CRUDModalActions<T>] => {
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Item states
  const [itemToEdit, setItemToEdit] = useState<T | null>(null);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [itemToView, setItemToView] = useState<T | null>(null);

  // Form state
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  const initializeFormData = (): Record<string, unknown> => {
    const initialData: Record<string, unknown> = {};
    formFields.forEach((field) => {
      initialData[field] = "";
    });
    return initialData;
  };

  // Actions
  const openCreateModal = () => {
    setFormData(initializeFormData());
    setIsSubmitting(false);
    setShowCreateModal(true);
  };

  const openEditModal = (item: T) => {
    console.log("🔵 [useCRUDModals] openEditModal called with item:", item);
    console.log("🔵 [useCRUDModals] formFields:", formFields);

    const editData: Record<string, unknown> = {};
    formFields.forEach((fieldKey) => {
      const value = item[fieldKey] || "";
      console.log(
        `🔵 [useCRUDModals] Extracting field "${fieldKey}" from item:`,
        value
      );
      editData[fieldKey] = value;
    });

    console.log("🔵 [useCRUDModals] Final editData to set:", editData);

    // Use external setFormData if provided (from useCRUDForm), otherwise use internal
    if (externalSetFormData) {
      console.log("🔵 [useCRUDModals] Using external setFormData");
      externalSetFormData(editData);
    } else {
      console.log("🔵 [useCRUDModals] Using internal setFormData");
      setFormData(editData);
    }

    setItemToEdit(item);
    setIsSubmitting(false);
    setShowEditModal(true);
  };

  const openDeleteModal = (item: T) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const openDetailModal = (item: T) => {
    setItemToView(item);
    setShowDetailModal(true);
  };

  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowDetailModal(false);
    setItemToEdit(null);
    setItemToDelete(null);
    setItemToView(null);
    setFormData({});
    setIsSubmitting(false);
  };

  const updateFormData = (data: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(initializeFormData());
    setIsSubmitting(false);
  };

  const setSubmitting = (loading: boolean) => {
    setIsSubmitting(loading);
  };

  const state: CRUDModalState<T> = {
    showCreateModal,
    showEditModal,
    showDeleteModal,
    showDetailModal,
    itemToEdit,
    itemToDelete,
    itemToView,
    formData,
    isSubmitting,
  };

  const actions: CRUDModalActions<T> = {
    openCreateModal,
    openEditModal,
    openDeleteModal,
    openDetailModal,
    closeAllModals,
    updateFormData,
    resetForm,
    setSubmitting,
  };

  return [state, actions];
};
