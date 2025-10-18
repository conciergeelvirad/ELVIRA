import { useOverviewMetrics } from "./overview/hooks";
import {
  KeyMetricsSection,
  RevenueSection,
  ServiceStatusSection,
  TopItemsSection,
} from "./overview/components";
import { useHotelStaff } from "../../hooks/hotel/useHotelStaff";

/**
 * Hotel Overview Page
 *
 * Dashboard overview displaying key hotel operations metrics and information.
 * Includes:
 * - Key metrics (guests, pending requests/orders)
 * - Revenue analytics (shop + restaurant)
 * - Service status breakdowns (pie charts)
 * - Top items (amenities, products, menu items)
 */
export const OverviewPage = () => {
  const { currency } = useHotelStaff();
  const { guests, revenue, services, isLoading, error } = useOverviewMetrics();

  console.log("Overview metrics:", {
    guests,
    revenue,
    services,
    isLoading,
    error,
  });

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-red-900">
            Error Loading Dashboard
          </h3>
          <p className="mt-2 text-sm text-red-700">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">HOTEL OVERVIEW</h1>
        <p className="mt-1 text-sm text-gray-600">
          Hotel operations dashboard overview
        </p>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6 p-6">
        {/* Section 1: Key Metrics */}
        <KeyMetricsSection
          activeGuests={guests.totalActiveGuests}
          pendingAmenityRequests={services.amenityRequests.pending}
          pendingShopOrders={
            services.shopOrders.pending + (services.shopOrders.processing || 0)
          }
          pendingRestaurantOrders={
            services.restaurantOrders.pending +
            (services.restaurantOrders.preparing || 0)
          }
          loading={isLoading}
        />

        {/* Section 2: Revenue Analytics */}
        <RevenueSection
          shopRevenue={revenue.shopRevenue}
          restaurantRevenue={revenue.restaurantRevenue}
          amenityRevenue={revenue.amenityRevenue}
          shopOrderCount={revenue.shopOrderCount}
          restaurantOrderCount={revenue.restaurantOrderCount}
          amenityRequestCount={revenue.amenityRequestCount}
          currency={currency}
          loading={isLoading}
        />

        {/* Section 3: Service Status Distribution */}
        <ServiceStatusSection
          amenityRequests={services.amenityRequests}
          shopOrders={services.shopOrders}
          restaurantOrders={services.restaurantOrders}
          loading={isLoading}
        />

        {/* Section 4: Top Items */}
        <TopItemsSection
          topAmenities={services.topAmenities}
          topProducts={services.topProducts}
          topMenuItems={services.topMenuItems}
          loading={isLoading}
        />
      </div>
    </div>
  );
};
