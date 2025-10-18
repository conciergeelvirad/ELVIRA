import React from "react";

interface RevenueCardProps {
  title: string;
  revenue: number;
  orderCount: number;
  currency?: string;
  loading?: boolean;
  countLabel?: string; // "orders" or "requests"
}

/**
 * Revenue card component with formatted currency
 */
export const RevenueCard: React.FC<RevenueCardProps> = ({
  title,
  revenue,
  orderCount,
  currency = "€",
  loading = false,
  countLabel = "order",
}) => {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-gray-200"></div>
          <div className="mt-3 h-10 w-24 rounded bg-gray-200"></div>
          <div className="mt-2 h-3 w-28 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const formattedRevenue = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency === "€" ? "EUR" : "USD",
  }).format(revenue);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {formattedRevenue}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            From {orderCount} {orderCount === 1 ? countLabel : `${countLabel}s`}
          </p>
        </div>
        <div className="text-green-500">
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
