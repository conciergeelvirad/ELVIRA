import React from "react";
import type { StatusBreakdown } from "../../types/overview.types";

interface StatusCardProps {
  title: string;
  statuses: StatusBreakdown;
  loading?: boolean;
}

/**
 * Status breakdown card component
 */
export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  statuses,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-5 w-40 rounded bg-gray-200"></div>
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-full rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "bg-yellow-500" },
    in_progress: { label: "In Progress", color: "bg-blue-500" },
    processing: { label: "Processing", color: "bg-blue-500" },
    preparing: { label: "Preparing", color: "bg-orange-500" },
    completed: { label: "Completed", color: "bg-green-500" },
    delivered: { label: "Delivered", color: "bg-green-600" },
    cancelled: { label: "Cancelled", color: "bg-red-500" },
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="mt-4 space-y-3">
        {Object.entries(statuses).map(([status, count]) => {
          const config = statusConfig[status];
          if (!config || count === undefined) return null;

          return (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${config.color}`}></div>
                <span className="text-sm text-gray-600">{config.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
