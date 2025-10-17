/**
 * Orders Tab Template Component
 *
 * Shared component for order/request tabs (AmenityRequests, ShopOrders, DineInOrders).
 * These tabs are read-only (no "Add" button) and focus on viewing/editing existing orders.
 *
 * Key differences from EntityTab:
 * - No "Add" button (orders created by guests)
 * - Status-based filtering instead of active/inactive
 * - Separate form fields for edit operations
 * - Custom enhancement functions for each order type
 */

import React from "react";
import {
  SearchAndFilterBar,
  CRUDModalContainer,
  LoadingState,
} from "../../../../../components/common";
import type { FormFieldConfig } from "../../../../../hooks";

interface OrdersTabTemplateProps<T> {
  // Loading state
  isLoading: boolean;

  // CRUD hook (from useAmenityRequestCRUD, useShopOrderCRUD, etc.)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  crud: any;

  // Configuration
  entityName: string;
  searchPlaceholder: string;
  defaultFilterValue: string; // e.g., "pending", "active"
  emptyMessage?: string;

  // Form fields
  formFields: FormFieldConfig[];
  editFormFields?: FormFieldConfig[];

  // Data view rendering
  renderDataView: (
    viewMode: "list" | "grid",
    filteredData: Record<string, unknown>[],
    handlers: {
      onView: (item: T) => void;
      onEdit: (item: T) => void;
      onDelete: (item: T) => void;
    }
  ) => React.ReactNode;

  // Detail rendering
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderDetailContent: (item: any) => React.ReactNode;

  // Optional: Custom loading message
  loadingMessage?: string;
}

/**
 * Generic Orders Tab Template
 *
 * Handles orders/requests with read-only creation (no Add button).
 * Includes search, filter, view modes, and CRUD operations.
 */
export function OrdersTabTemplate<T extends Record<string, unknown>>({
  isLoading,
  crud,
  entityName,
  searchPlaceholder,
  defaultFilterValue,
  emptyMessage,
  formFields,
  editFormFields,
  renderDataView,
  renderDetailContent,
  loadingMessage,
}: OrdersTabTemplateProps<T>) {
  const {
    searchAndFilter,
    modalState,
    modalActions,
    formState,
    formActions,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
  } = crud;

  const {
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    mode: viewMode,
    setViewMode,
    filteredData,
  } = searchAndFilter;

  if (isLoading) {
    return (
      <LoadingState
        message={loadingMessage || `Loading ${entityName.toLowerCase()}s...`}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar - No "Add" button for orders */}
      <SearchAndFilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={searchPlaceholder}
        filterActive={Boolean(filterValue)}
        onFilterToggle={() =>
          setFilterValue(filterValue ? "" : defaultFilterValue)
        }
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Data View */}
      {renderDataView(viewMode, filteredData, {
        onView: modalActions.openDetailModal,
        onEdit: (item: T) => {
          modalActions.openEditModal(item);
        },
        onDelete: modalActions.openDeleteModal,
      })}

      {/* CRUD Modal Container */}
      <CRUDModalContainer
        modalState={modalState}
        modalActions={modalActions}
        formState={formState}
        formActions={formActions}
        formFields={formFields}
        editFormFields={editFormFields}
        onCreateSubmit={handleCreateSubmit}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        entityName={entityName}
        renderDetailContent={renderDetailContent}
      />
    </div>
  );
}
