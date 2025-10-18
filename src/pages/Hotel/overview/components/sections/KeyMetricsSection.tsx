import React from "react";
import { MetricCard } from "../metrics";

interface KeyMetricsSectionProps {
  activeGuests: number;
  pendingAmenityRequests: number;
  pendingShopOrders: number;
  pendingRestaurantOrders: number;
  loading?: boolean;
}

/**
 * Key metrics section - Top row of 4 main metrics
 */
export const KeyMetricsSection: React.FC<KeyMetricsSectionProps> = ({
  activeGuests,
  pendingAmenityRequests,
  pendingShopOrders,
  pendingRestaurantOrders,
  loading = false,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Active Guests"
        value={activeGuests}
        icon={
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
        loading={loading}
      />

      <MetricCard
        title="Pending Requests"
        value={pendingAmenityRequests}
        subtitle="Amenity requests awaiting action"
        icon={
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        }
        loading={loading}
      />

      <MetricCard
        title="Shop Orders"
        value={pendingShopOrders}
        subtitle="Orders pending delivery"
        icon={
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        }
        loading={loading}
      />

      <MetricCard
        title="Restaurant Orders"
        value={pendingRestaurantOrders}
        subtitle="Orders being prepared"
        icon={
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
        loading={loading}
      />
    </div>
  );
};
