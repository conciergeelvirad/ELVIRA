import { StatusType } from "../../components/common";

// Utility functions for common status mappings
export const mapBooleanToStatus = (value: boolean): StatusType =>
  value ? "active" : "inactive";

export const mapPriorityToStatus = (priority: string): StatusType => {
  const normalized = priority.toLowerCase();
  if (normalized === "high") return "high";
  if (normalized === "medium") return "medium";
  if (normalized === "low") return "low";
  return "default";
};

export const mapGenericStatus = (status: string): StatusType => {
  const normalized = status.toLowerCase();
  if (["active", "enabled", "on", "true", "yes"].includes(normalized))
    return "active";
  if (["inactive", "disabled", "off", "false", "no"].includes(normalized))
    return "inactive";
  if (["pending", "processing", "waiting"].includes(normalized))
    return "pending";
  if (["completed", "done", "finished", "success"].includes(normalized))
    return "completed";
  if (["cancelled", "canceled", "failed", "error"].includes(normalized))
    return "cancelled";
  return "default";
};

// Common status type guards
export const isActiveStatus = (status: string): boolean =>
  mapGenericStatus(status) === "active";

export const isPriorityStatus = (status: StatusType): boolean =>
  ["high", "medium", "low"].includes(status);

export const isCompletionStatus = (status: StatusType): boolean =>
  ["completed", "cancelled", "pending"].includes(status);
