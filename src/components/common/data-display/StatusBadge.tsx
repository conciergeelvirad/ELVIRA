import { cn } from "../../../utils";

export type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "completed"
  | "cancelled"
  | "high"
  | "medium"
  | "low"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default";

export type StatusSize = "sm" | "md" | "lg";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: StatusSize;
  className?: string;
  variant?: "filled" | "outlined" | "soft";
}

const statusConfig = {
  active: {
    filled: "bg-green-600 text-white",
    outlined: "border-green-600 text-green-600 bg-transparent",
    soft: "bg-green-100 text-green-800 border-green-200",
  },
  inactive: {
    filled: "bg-gray-600 text-white",
    outlined: "border-gray-600 text-gray-600 bg-transparent",
    soft: "bg-gray-100 text-gray-800 border-gray-200",
  },
  pending: {
    filled: "bg-yellow-600 text-white",
    outlined: "border-yellow-600 text-yellow-600 bg-transparent",
    soft: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  completed: {
    filled: "bg-blue-600 text-white",
    outlined: "border-blue-600 text-blue-600 bg-transparent",
    soft: "bg-blue-100 text-blue-800 border-blue-200",
  },
  cancelled: {
    filled: "bg-red-600 text-white",
    outlined: "border-red-600 text-red-600 bg-transparent",
    soft: "bg-red-100 text-red-800 border-red-200",
  },
  high: {
    filled: "bg-red-600 text-white",
    outlined: "border-red-600 text-red-600 bg-transparent",
    soft: "bg-red-100 text-red-800 border-red-200",
  },
  medium: {
    filled: "bg-orange-600 text-white",
    outlined: "border-orange-600 text-orange-600 bg-transparent",
    soft: "bg-orange-100 text-orange-800 border-orange-200",
  },
  low: {
    filled: "bg-green-600 text-white",
    outlined: "border-green-600 text-green-600 bg-transparent",
    soft: "bg-green-100 text-green-800 border-green-200",
  },
  success: {
    filled: "bg-emerald-600 text-white",
    outlined: "border-emerald-600 text-emerald-600 bg-transparent",
    soft: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  warning: {
    filled: "bg-amber-600 text-white",
    outlined: "border-amber-600 text-amber-600 bg-transparent",
    soft: "bg-amber-100 text-amber-800 border-amber-200",
  },
  error: {
    filled: "bg-red-600 text-white",
    outlined: "border-red-600 text-red-600 bg-transparent",
    soft: "bg-red-100 text-red-800 border-red-200",
  },
  info: {
    filled: "bg-blue-600 text-white",
    outlined: "border-blue-600 text-blue-600 bg-transparent",
    soft: "bg-blue-100 text-blue-800 border-blue-200",
  },
  default: {
    filled: "bg-gray-600 text-white",
    outlined: "border-gray-600 text-gray-600 bg-transparent",
    soft: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

const sizeConfig = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-sm",
  lg: "px-3 py-1 text-base",
};

const getStatusLabel = (status: StatusType): string => {
  const labels: Record<StatusType, string> = {
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    completed: "Completed",
    cancelled: "Cancelled",
    high: "High",
    medium: "Medium",
    low: "Low",
    success: "Success",
    warning: "Warning",
    error: "Error",
    info: "Info",
    default: "Default",
  };
  return labels[status] || status;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = "md",
  className,
  variant = "soft",
}) => {
  const statusStyles =
    statusConfig[status]?.[variant] || statusConfig.default[variant];
  const sizeStyles = sizeConfig[size];
  const displayLabel = label || getStatusLabel(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border transition-colors",
        statusStyles,
        sizeStyles,
        className
      )}
    >
      {displayLabel}
    </span>
  );
};
