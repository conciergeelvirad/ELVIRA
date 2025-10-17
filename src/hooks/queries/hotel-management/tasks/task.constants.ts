/**
 * Task Constants
 *
 * Query keys and constants for task management.
 */

// Default hotel ID
export const DEFAULT_HOTEL_ID = "086e11e4-4775-4327-8448-3fa0ee7be0a5";

// Query key factory for tasks
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...taskKeys.lists(), { ...filters }] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

// Task status options
export const TASK_STATUSES = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

// Task priority options
export const TASK_PRIORITIES = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
} as const;

// Select query for task with relationships
export const TASK_SELECT_QUERY = `
  *,
  assigned_staff:hotel_staff!staff_id (
    id,
    employee_id,
    position,
    department,
    hotel_staff_personal_data (
      first_name,
      last_name,
      email,
      phone_number,
      avatar_url
    )
  ),
  created_by_profile:profiles!created_by (
    id,
    email
  )
`;
