/**
 * Requests Tab Component (Refactored)
 *
 * Handles the display and management of amenity requests.
 * Now uses shared OrdersTabTemplate to eliminate duplication.
 *
 * @refactored Uses OrdersTabTemplate for consistent orders/requests management
 */

import React from "react";
import { OrdersTabTemplate } from "../../shared/orders/OrdersTabTemplate";
import {
  AmenityRequestsDataView,
  AmenityRequestDetail,
  AMENITY_REQUEST_FORM_FIELDS,
  AMENITY_REQUEST_EDIT_FORM_FIELDS,
  enhanceAmenityRequest,
} from "../index";
import type { AmenityRequest } from "../../../../../hooks/queries/hotel-management/amenity-requests";

interface RequestsTabProps {
  isLoading: boolean;
  crud: ReturnType<
    typeof import("../../../hooks/useAmenityRequestCRUD").useAmenityRequestCRUD
  >;
  tableColumns: any;
}

/**
 * Amenity Requests Tab - Simplified using OrdersTabTemplate
 */
export const RequestsTab: React.FC<RequestsTabProps> = ({
  isLoading,
  crud,
  tableColumns,
}) => {
  return (
    <OrdersTabTemplate<AmenityRequest>
      isLoading={isLoading}
      crud={crud}
      entityName="Amenity Request"
      searchPlaceholder="Search requests..."
      defaultFilterValue="pending"
      emptyMessage="No amenity requests found"
      formFields={AMENITY_REQUEST_FORM_FIELDS}
      editFormFields={AMENITY_REQUEST_EDIT_FORM_FIELDS}
      renderDataView={(viewMode, filteredData, handlers) => (
        <AmenityRequestsDataView
          viewMode={viewMode}
          filteredData={filteredData}
          handleRowClick={(request: AmenityRequest) => {
            const enhanced = enhanceAmenityRequest(request);
            handlers.onView(enhanced);
          }}
          tableColumns={tableColumns}
          onEdit={(request: AmenityRequest) => {
            const enhanced = enhanceAmenityRequest(request);
            crud.formActions.setFormData(enhanced);
            handlers.onEdit(enhanced);
          }}
          onDelete={(request: AmenityRequest) => {
            const enhanced = enhanceAmenityRequest(request);
            handlers.onDelete(enhanced);
          }}
        />
      )}
      renderDetailContent={(item) => <AmenityRequestDetail item={item} />}
      loadingMessage="Loading amenity requests..."
    />
  );
};
