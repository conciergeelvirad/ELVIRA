import React from "react";
import { StatusDistributionChart } from "../charts";
import type { StatusBreakdown } from "../../types/overview.types";

interface ServiceStatusSectionProps {
  amenityRequests: StatusBreakdown;
  shopOrders: StatusBreakdown;
  restaurantOrders: StatusBreakdown;
  loading?: boolean;
}

/**
 * Service status section with pie charts
 */
export const ServiceStatusSection: React.FC<ServiceStatusSectionProps> = ({
  amenityRequests,
  shopOrders,
  restaurantOrders,
  loading = false,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <StatusDistributionChart
        title="Amenity Requests Status"
        statuses={amenityRequests}
        loading={loading}
      />
      <StatusDistributionChart
        title="Shop Orders Status"
        statuses={shopOrders}
        loading={loading}
      />
      <StatusDistributionChart
        title="Restaurant Orders Status"
        statuses={restaurantOrders}
        loading={loading}
      />
    </div>
  );
};
