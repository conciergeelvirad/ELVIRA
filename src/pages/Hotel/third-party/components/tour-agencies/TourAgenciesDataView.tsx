/**
 * Tour Agencies Data View Component
 *
 * Displays tours in either grid or list view mode with pagination
 */

import React from "react";
import { usePagination } from "../../../../../hooks";
import { TableView, GridView } from "../../../../../components/common";
import {
  Column,
  TableRow,
  GridItem,
  GridColumn,
} from "../../../../../types/table";
import { AmadeusActivity } from "../../../../../services/amadeus/types";
import { TourCard } from "../shared/tour-agencies";
import { Star, MapPin, DollarSign, Clock } from "lucide-react";
import type { ApprovalStatus } from "../../../../../types/approved-third-party-places";

interface TourAgenciesDataViewProps {
  viewMode: "list" | "grid";
  filteredData: AmadeusActivity[];
  getApprovalStatus: (tourId: string) => ApprovalStatus | null;
  isRecommended: (tourId: string) => boolean;
  onApprove?: (tour: AmadeusActivity) => void;
  onReject?: (tour: AmadeusActivity) => void;
  onView?: (tour: AmadeusActivity) => void;
  onToggleRecommended?: (tour: AmadeusActivity) => void;
  isLoading?: boolean;
}

export const TourAgenciesDataView: React.FC<TourAgenciesDataViewProps> = ({
  viewMode,
  filteredData,
  getApprovalStatus,
  isRecommended,
  onApprove,
  onReject,
  onView,
  onToggleRecommended,
  isLoading = false,
}) => {
  // Define table columns
  const tableColumns: Column<AmadeusActivity>[] = [
    {
      key: "name",
      header: "Tour Name",
      sortable: true,
      render: (_value, tour) => (
        <div className="flex items-center gap-2">
          {tour.pictures && tour.pictures.length > 0 && (
            <img
              src={tour.pictures[0]}
              alt={tour.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{tour.name}</div>
            {tour.shortDescription && (
              <div className="text-xs text-gray-500 line-clamp-1">
                {tour.shortDescription}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Location",
      sortable: false,
      render: (_value, tour) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-2">
            {tour.shortDescription || "Location not specified"}
          </span>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (_value, tour) => {
        if (!tour.rating) {
          return <span className="text-sm text-gray-400">N/A</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{tour.rating.toFixed(1)}</span>
          </div>
        );
      },
    },
    {
      key: "businessHours",
      header: "Hours",
      sortable: false,
      render: (_value, tour) => {
        if (!tour.business_hours) {
          return <span className="text-sm text-gray-400">N/A</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              {tour.business_hours.days?.join(", ") || "See details"}
            </span>
          </div>
        );
      },
    },
    {
      key: "price",
      header: "Price",
      sortable: false,
      render: (_value, tour) => {
        if (!tour.price) {
          return <span className="text-sm text-gray-400">N/A</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              {tour.price.amount} {tour.price.currency}
            </span>
          </div>
        );
      },
    },
  ];

  // Define grid columns (for GridView component's internal column definition)
  const gridColumns: GridColumn[] = [
    { key: "name", label: "Name" },
    { key: "rating", label: "Rating" },
    { key: "businessHours", label: "Hours" },
    { key: "price", label: "Price" },
  ];

  // Create table rows and grid items
  const tableRows: TableRow<AmadeusActivity>[] = filteredData.map((tour) => ({
    id: tour.id,
    data: tour,
  }));

  const gridItems: GridItem<AmadeusActivity>[] = filteredData.map((tour) => ({
    id: tour.id,
    data: tour,
  }));

  // Pagination with 12 items per page
  const pagination = usePagination({
    totalItems: filteredData.length,
    initialPageSize: 12,
  });

  // Paginated data helper
  const getPaginatedData = <T,>(items: T[]): T[] =>
    items.slice(
      (pagination.currentPage - 1) * pagination.pageSize,
      pagination.currentPage * pagination.pageSize
    );

  const paginatedRows = getPaginatedData(tableRows);
  const paginatedGridItems = getPaginatedData(gridItems);

  return (
    <>
      {viewMode === "list" ? (
        <TableView
          columns={tableColumns as unknown as Column<Record<string, unknown>>[]}
          rows={paginatedRows as unknown as TableRow<Record<string, unknown>>[]}
          sortable
          striped
          hoverable
          emptyMessage="No tours found"
          onRowClick={(row) => {
            const tour = filteredData.find((t) => t.id === row.id);
            if (tour && onView) {
              onView(tour);
            }
          }}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            pageSize: pagination.pageSize,
            totalItems: tableRows.length,
            onPageChange: pagination.goToPage,
            onPageSizeChange: pagination.setPageSize,
          }}
        />
      ) : (
        <GridView
          items={
            paginatedGridItems as unknown as GridItem<Record<string, unknown>>[]
          }
          columns={gridColumns}
          renderCard={(gridItem) => {
            const tour = gridItem.data as unknown as AmadeusActivity;
            const status = getApprovalStatus(tour.id);
            const recommended = isRecommended(tour.id);
            return (
              <TourCard
                tour={tour}
                currentStatus={status}
                isRecommended={recommended}
                onApprove={onApprove ? () => onApprove(tour) : undefined}
                onReject={onReject ? () => onReject(tour) : undefined}
                onView={onView ? () => onView(tour) : undefined}
                onToggleRecommended={
                  onToggleRecommended
                    ? () => onToggleRecommended(tour)
                    : undefined
                }
                isLoading={isLoading}
              />
            );
          }}
          gridCols={4}
          emptyMessage="No tours found"
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            pageSize: pagination.pageSize,
            totalItems: gridItems.length,
            onPageChange: pagination.goToPage,
            onPageSizeChange: pagination.setPageSize,
          }}
        />
      )}
    </>
  );
};
