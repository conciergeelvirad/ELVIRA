import React from "react";
import { RevenueCard } from "../metrics";
import { RevenueChart } from "../charts";

interface RevenueSectionProps {
  shopRevenue: number;
  restaurantRevenue: number;
  amenityRevenue: number;
  shopOrderCount: number;
  restaurantOrderCount: number;
  amenityRequestCount: number;
  currency?: string;
  loading?: boolean;
}

/**
 * Revenue section with cards and comparison chart
 */
export const RevenueSection: React.FC<RevenueSectionProps> = ({
  shopRevenue,
  restaurantRevenue,
  amenityRevenue,
  shopOrderCount,
  restaurantOrderCount,
  amenityRequestCount,
  currency = "€",
  loading = false,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RevenueCard
          title="Shop Revenue"
          revenue={shopRevenue}
          orderCount={shopOrderCount}
          currency={currency}
          countLabel="order"
          loading={loading}
        />
        <RevenueCard
          title="Restaurant Revenue"
          revenue={restaurantRevenue}
          orderCount={restaurantOrderCount}
          currency={currency}
          countLabel="order"
          loading={loading}
        />
        <RevenueCard
          title="Amenity Revenue"
          revenue={amenityRevenue}
          orderCount={amenityRequestCount}
          currency={currency}
          countLabel="request"
          loading={loading}
        />
      </div>

      <RevenueChart
        shopRevenue={shopRevenue}
        restaurantRevenue={restaurantRevenue}
        amenityRevenue={amenityRevenue}
        currency={currency}
        loading={loading}
      />
    </div>
  );
};
