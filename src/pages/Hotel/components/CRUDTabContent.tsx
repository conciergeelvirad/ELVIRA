/**
 * CRUDTabContent Component
 *
 * Reusable component for CRUD tab content with search, data view, and modals
 * Reduces code duplication across Staff, Tasks, and Absence tabs
 */

import React from "react";
import { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";
import {
  SearchAndFilterBar,
  Button,
  CRUDModalContainer,
  EmptyState,
} from "../../../components/common";
import type {
  FormFieldConfig,
  CRUDModalState,
  CRUDModalActions,
  CRUDFormState,
  CRUDFormActions,
} from "../../../hooks";

interface CRUDTabContentProps<T> {
  // Search & Filter
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchPlaceholder: string;
  filterActive: boolean;
  onFilterToggle: () => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;

  // Data & Loading
  isLoading: boolean;
  filteredData: unknown[];
  emptyMessage: string;

  // Add Button
  addButtonLabel: string;
  addButtonIcon?: LucideIcon;
  onAddClick: () => void;

  // Data View Component
  DataViewComponent: React.ComponentType<{
    viewMode: "list" | "grid";
    filteredData: unknown[];
    handleRowClick: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    [key: string]: unknown; // Allow additional props
  }>;
  onRowClick: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  dataViewProps?: Record<string, unknown>; // Additional props for DataView

  // CRUD Modal
  modalState: CRUDModalState<T>;
  modalActions: CRUDModalActions<T>;
  formState: CRUDFormState;
  formActions: CRUDFormActions;
  formFields: FormFieldConfig[];
  onCreateSubmit: () => Promise<void> | void;
  onEditSubmit: () => Promise<void> | void;
  onDeleteConfirm: () => void;
  entityName: string;
  renderDetailContent?: (item: T) => React.ReactNode;
  detailModalActions?: {
    showEdit?: boolean;
    showDelete?: boolean;
  };
  customFormComponent?: React.ComponentType<{
    formState: CRUDFormState;
    formActions: CRUDFormActions;
    disabled?: boolean;
    isEditMode?: boolean;
    [key: string]: unknown; // Allow additional props
  }>;
  customFormProps?: Record<string, unknown>; // Additional props for custom form
}

export const CRUDTabContent = <T extends { id: string | number }>({
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  filterActive,
  onFilterToggle,
  viewMode,
  onViewModeChange,
  isLoading,
  filteredData,
  emptyMessage,
  addButtonLabel,
  addButtonIcon = Plus,
  onAddClick,
  DataViewComponent,
  onRowClick,
  onEdit,
  onDelete,
  dataViewProps = {},
  modalState,
  modalActions,
  formState,
  formActions,
  formFields,
  onCreateSubmit,
  onEditSubmit,
  onDeleteConfirm,
  entityName,
  renderDetailContent,
  detailModalActions,
  customFormComponent,
  customFormProps,
}: CRUDTabContentProps<T>): React.ReactElement => {
  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <SearchAndFilterBar
        searchQuery={searchTerm}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        filterActive={filterActive}
        onFilterToggle={onFilterToggle}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        rightActions={
          addButtonLabel ? (
            <Button
              variant="dark"
              leftIcon={addButtonIcon}
              onClick={onAddClick}
            >
              {addButtonLabel}
            </Button>
          ) : undefined
        }
      />

      {/* Data View with Loading/Empty States */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          Loading {entityName.toLowerCase()}s...
        </div>
      ) : filteredData.length > 0 ? (
        <DataViewComponent
          viewMode={viewMode}
          filteredData={filteredData}
          handleRowClick={onRowClick}
          onEdit={onEdit}
          onDelete={onDelete}
          {...dataViewProps}
        />
      ) : (
        <EmptyState message={emptyMessage} />
      )}

      {/* CRUD Modals */}
      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={formFields}
        onCreateSubmit={onCreateSubmit}
        onEditSubmit={onEditSubmit}
        onDeleteConfirm={onDeleteConfirm}
        entityName={entityName}
        renderDetailContent={renderDetailContent}
        detailModalActions={detailModalActions}
        customFormComponent={customFormComponent}
        customFormProps={customFormProps}
      />
    </div>
  );
};
