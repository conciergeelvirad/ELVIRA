/**
 * Q&A CRUD Hook
 *
 * Provides CRUD state management and operations for Q&A using the useCRUD hook.
 */

import { FormFieldConfig } from "../../../hooks";
import type {
  QARecommendation,
  QARecommendationInsert,
  QARecommendationUpdate,
} from "../../../hooks/queries/hotel-management/qa-recommendations";
import {
  useCreateQARecommendation,
  useUpdateQARecommendation,
  useDeleteQARecommendation,
} from "../../../hooks/queries/hotel-management/qa-recommendations";
import { useCRUDWithMutations, getHotelId } from "./useCRUDWithMutations";

/**
 * Enhanced Q&A type with UI-specific fields
 */
export type EnhancedQA = QARecommendation & {
  // Add any additional UI-specific fields here
  formattedDate?: string;
};

// Make sure QA satisfies the Record<string, unknown> constraint
type QAForCRUD = QARecommendation & Record<string, unknown>;

interface UseQACRUDProps {
  initialQAs: QARecommendation[];
  formFields: FormFieldConfig[];
}

/**
 * Hook for managing Q&A CRUD operations
 *
 * @param props - Initial Q&As and form fields configuration
 * @returns CRUD state and handlers for Q&As
 */
export const useQACRUD = ({ initialQAs, formFields }: UseQACRUDProps) => {
  // Use the CRUD with mutations helper for database integration
  const crud = useCRUDWithMutations<
    QAForCRUD,
    QARecommendationInsert,
    QARecommendationUpdate
  >({
    initialData: initialQAs as QAForCRUD[],
    formFields,
    searchFields: ["question", "answer", "category"],
    defaultViewMode: "list",
    createMutation: useCreateQARecommendation(),
    updateMutation: useUpdateQARecommendation(),
    deleteMutation: useDeleteQARecommendation(),
    // Transform form data to database insert format
    transformCreate: (data) => ({
      question: (data.question as string) || "",
      answer: (data.answer as string) || "",
      category: (data.category as string) || undefined,
      recommendation_type: "Q&A" as const,
      hotel_id: getHotelId(),
    }),
    // Transform form data to database update format
    transformUpdate: (id, data) => ({
      id: id as string,
      updates: {
        question: data.question as string,
        answer: data.answer as string,
        category: data.category as string,
      },
    }),
    // Transform ID for delete operation
    transformDelete: (id) => id as string,
    // Optional: Customize how new entities appear in local state
    formatNewEntity: (formData) => ({
      ...formData,
      created_at: new Date().toISOString(),
      recommendation_type: "Q&A" as const,
    }),
    formatUpdatedEntity: (formData) => formData,
  });

  // Map crud result to the expected return structure
  return {
    data: crud.data as QARecommendation[],
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
