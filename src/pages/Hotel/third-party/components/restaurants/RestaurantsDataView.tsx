import React from "react";
import { usePagination } from "../../../../../hooks";
import { TableView, GridView } from "../../../../../components/common";
import {
  Column,
  TableRow,
  GridItem,
  GridColumn,
} from "../../../../../types/table";
import { Restaurant } from "../../../../../services/googlePlaces.service";
import { RestaurantCard } from "../shared/RestaurantCard";
import { Star, MapPin, DollarSign, Clock } from "lucide-react";
import type { ApprovalStatus } from "../../../../../types/approved-third-party-places";

interface RestaurantsDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Restaurant[];
  getApprovalStatus: (placeId: string) => ApprovalStatus | null;
  isRecommended: (placeId: string) => boolean;
  onApprove?: (restaurant: Restaurant) => void;
  onReject?: (restaurant: Restaurant) => void;
  onView?: (restaurant: Restaurant) => void;
  onToggleRecommended?: (restaurant: Restaurant) => void;
  isLoading?: boolean;
}

export const RestaurantsDataView: React.FC<RestaurantsDataViewProps> = ({
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
  const tableColumns: Column<Restaurant>[] = [
    {
      key: "name",
      header: "Restaurant Name",
      sortable: true,
      render: (_value, restaurant) => (
        <div className="flex items-center gap-2">
          {restaurant.photo_url && (
            <img
              src={restaurant.photo_url}
              alt={restaurant.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{restaurant.name}</div>
            {restaurant.types && restaurant.types.length > 0 && (
              <div className="text-xs text-gray-500">
                {restaurant.types
                  .filter(
                    (t) =>
                      !t.includes("point_of_interest") &&
                      !t.includes("establishment")
                  )
                  .slice(0, 2)
                  .map((t) => t.replace(/_/g, " "))
                  .join(", ")}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "vicinity",
      header: "Address",
      sortable: false,
      render: (_value, restaurant) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-2">
            {restaurant.vicinity}
          </span>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (_value, restaurant) => {
        if (!restaurant.rating) {
          return <span className="text-sm text-gray-400">N/A</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
            {restaurant.user_ratings_total && (
              <span className="text-xs text-gray-500">
                ({restaurant.user_ratings_total})
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "price_level",
      header: "Price",
      sortable: true,
      render: (_value, restaurant) => {
        if (!restaurant.price_level) {
          return <span className="text-sm text-gray-400">N/A</span>;
        }
        const priceDisplay = "€".repeat(restaurant.price_level);
        return (
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {priceDisplay}
            </span>
          </div>
        );
      },
    },
    {
      key: "business_status",
      header: "Status",
      sortable: false,
      render: (_value, restaurant) => {
        const isOpen = restaurant.opening_hours?.open_now;
        const status = restaurant.business_status;

        if (status === "OPERATIONAL") {
          return (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span
                className={`text-sm ${
                  isOpen === true
                    ? "text-green-600 font-medium"
                    : isOpen === false
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {isOpen === true
                  ? "Open"
                  : isOpen === false
                  ? "Closed"
                  : "Unknown"}
              </span>
            </div>
          );
        }

        return (
          <span className="text-sm text-gray-500">{status || "Unknown"}</span>
        );
      },
    },
  ];

  // Define grid columns (for GridView component's internal column definition)
  const gridColumns: GridColumn[] = [
    { key: "name", label: "Name" },
    { key: "rating", label: "Rating" },
    { key: "price_level", label: "Price" },
    { key: "vicinity", label: "Address" },
  ];

  // Create table rows and grid items
  const tableRows: TableRow<Restaurant>[] = filteredData.map((restaurant) => ({
    id: restaurant.place_id,
    data: restaurant,
  }));

  const gridItems: GridItem<Restaurant>[] = filteredData.map((restaurant) => ({
    id: restaurant.place_id,
    data: restaurant,
  }));

  // Pagination with 12 items per page (matching ProductsDataView)
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
          emptyMessage="No restaurants found"
          onRowClick={(row) => {
            const restaurant = filteredData.find((r) => r.place_id === row.id);
            if (restaurant && onView) {
              onView(restaurant);
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
            const restaurant = gridItem.data as unknown as Restaurant;
            const status = getApprovalStatus(restaurant.place_id);
            const recommended = isRecommended(restaurant.place_id);
            return (
              <RestaurantCard
                restaurant={restaurant}
                currentStatus={status}
                isRecommended={recommended}
                onApprove={onApprove ? () => onApprove(restaurant) : undefined}
                onReject={onReject ? () => onReject(restaurant) : undefined}
                onView={onView ? () => onView(restaurant) : undefined}
                onToggleRecommended={
                  onToggleRecommended
                    ? () => onToggleRecommended(restaurant)
                    : undefined
                }
                isLoading={isLoading}
              />
            );
          }}
          gridCols={4}
          emptyMessage="No restaurants found"
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
