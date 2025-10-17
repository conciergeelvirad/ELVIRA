/**
 * Task Transformer Utilities
 *
 * Utility functions for transforming, filtering, sorting, and formatting task data.
 */

import type {
  ExtendedTask,
  TaskWithStaff,
  TaskStatus,
  TaskPriority,
} from "./task.types";

// ============================================================================
// Core Transformation
// ============================================================================

/**
 * Transforms an extended task (with relationships) to TaskWithStaff format
 */
export const transformTask = (task: ExtendedTask): TaskWithStaff => {
  const personalData = Array.isArray(
    task.assigned_staff?.hotel_staff_personal_data
  )
    ? task.assigned_staff.hotel_staff_personal_data[0]
    : task.assigned_staff?.hotel_staff_personal_data;

  return {
    id: task.id,
    hotelId: task.hotel_id,
    title: task.title,
    description: task.description,
    type: task.type,
    priority: task.priority as TaskPriority,
    status: task.status as TaskStatus,
    staffId: task.staff_id,
    staffName: personalData
      ? `${personalData.first_name} ${personalData.last_name}`
      : null,
    staffEmail: personalData?.email ?? null,
    staffPosition: task.assigned_staff?.position ?? null,
    staffDepartment: task.assigned_staff?.department ?? null,
    staffAvatar: personalData?.avatar_url ?? null,
    dueDate: task.due_date,
    dueTime: task.due_time,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
    createdBy: task.created_by,
    createdByEmail: task.created_by_profile?.email ?? null,
  };
};

/**
 * Transforms multiple extended tasks
 */
export const transformTasks = (tasks: ExtendedTask[]): TaskWithStaff[] => {
  return tasks.map(transformTask);
};

// ============================================================================
// Filtering Utilities
// ============================================================================

/**
 * Filters tasks by status
 */
export const filterTasksByStatus = (
  tasks: TaskWithStaff[],
  status: TaskStatus
): TaskWithStaff[] => {
  return tasks.filter((task) => task.status === status);
};

/**
 * Filters tasks by priority
 */
export const filterTasksByPriority = (
  tasks: TaskWithStaff[],
  priority: TaskPriority
): TaskWithStaff[] => {
  return tasks.filter((task) => task.priority === priority);
};

/**
 * Filters tasks by assigned staff
 */
export const filterTasksByStaff = (
  tasks: TaskWithStaff[],
  staffId: string
): TaskWithStaff[] => {
  return tasks.filter((task) => task.staffId === staffId);
};

/**
 * Filters unassigned tasks
 */
export const filterUnassignedTasks = (
  tasks: TaskWithStaff[]
): TaskWithStaff[] => {
  return tasks.filter((task) => !task.staffId);
};

/**
 * Filters overdue tasks
 */
export const filterOverdueTasks = (tasks: TaskWithStaff[]): TaskWithStaff[] => {
  const now = new Date();
  return tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return (
      dueDate < now &&
      task.status !== "COMPLETED" &&
      task.status !== "CANCELLED"
    );
  });
};

/**
 * Filters tasks by department
 */
export const filterTasksByDepartment = (
  tasks: TaskWithStaff[],
  department: string
): TaskWithStaff[] => {
  return tasks.filter((task) => task.staffDepartment === department);
};

/**
 * Filters tasks by type
 */
export const filterTasksByType = (
  tasks: TaskWithStaff[],
  type: string
): TaskWithStaff[] => {
  return tasks.filter((task) => task.type === type);
};

/**
 * Filters tasks created by a specific user
 */
export const filterTasksByCreator = (
  tasks: TaskWithStaff[],
  creatorId: string
): TaskWithStaff[] => {
  return tasks.filter((task) => task.createdBy === creatorId);
};

/**
 * Searches tasks by title or description
 */
export const searchTasks = (
  tasks: TaskWithStaff[],
  searchTerm: string
): TaskWithStaff[] => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return tasks;

  return tasks.filter((task) => {
    const title = task.title?.toLowerCase() || "";
    const description = task.description?.toLowerCase() || "";
    const staffName = task.staffName?.toLowerCase() || "";

    return (
      title.includes(term) ||
      description.includes(term) ||
      staffName.includes(term)
    );
  });
};

// ============================================================================
// Sorting Utilities
// ============================================================================

/**
 * Sorts tasks by due date (earliest first)
 */
export const sortTasksByDueDate = (tasks: TaskWithStaff[]): TaskWithStaff[] => {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

/**
 * Sorts tasks by priority (High > Medium > Low)
 */
export const sortTasksByPriority = (
  tasks: TaskWithStaff[]
): TaskWithStaff[] => {
  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
  return [...tasks].sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

/**
 * Sorts tasks by creation date (newest first)
 */
export const sortTasksByCreatedDate = (
  tasks: TaskWithStaff[]
): TaskWithStaff[] => {
  return [...tasks].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
};

/**
 * Sorts tasks by title (alphabetically)
 */
export const sortTasksByTitle = (tasks: TaskWithStaff[]): TaskWithStaff[] => {
  return [...tasks].sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
};

/**
 * Sorts tasks by status (custom order)
 */
export const sortTasksByStatus = (tasks: TaskWithStaff[]): TaskWithStaff[] => {
  const statusOrder: Record<TaskStatus, number> = {
    IN_PROGRESS: 1,
    PENDING: 2,
    COMPLETED: 3,
    CANCELLED: 4,
  };
  return [...tasks].sort((a, b) => {
    return statusOrder[a.status] - statusOrder[b.status];
  });
};

// ============================================================================
// Grouping Utilities
// ============================================================================

/**
 * Groups tasks by status
 */
export const groupTasksByStatus = (
  tasks: TaskWithStaff[]
): Record<TaskStatus, TaskWithStaff[]> => {
  return tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, TaskWithStaff[]>);
};

/**
 * Groups tasks by priority
 */
export const groupTasksByPriority = (
  tasks: TaskWithStaff[]
): Record<TaskPriority, TaskWithStaff[]> => {
  return tasks.reduce((acc, task) => {
    if (!acc[task.priority]) {
      acc[task.priority] = [];
    }
    acc[task.priority].push(task);
    return acc;
  }, {} as Record<TaskPriority, TaskWithStaff[]>);
};

/**
 * Groups tasks by assigned staff
 */
export const groupTasksByStaff = (
  tasks: TaskWithStaff[]
): Record<string, TaskWithStaff[]> => {
  return tasks.reduce((acc, task) => {
    const key = task.staffId || "unassigned";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(task);
    return acc;
  }, {} as Record<string, TaskWithStaff[]>);
};

/**
 * Groups tasks by department
 */
export const groupTasksByDepartment = (
  tasks: TaskWithStaff[]
): Record<string, TaskWithStaff[]> => {
  return tasks.reduce((acc, task) => {
    const key = task.staffDepartment || "unassigned";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(task);
    return acc;
  }, {} as Record<string, TaskWithStaff[]>);
};

/**
 * Groups tasks by type
 */
export const groupTasksByType = (
  tasks: TaskWithStaff[]
): Record<string, TaskWithStaff[]> => {
  return tasks.reduce((acc, task) => {
    const key = task.type || "other";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(task);
    return acc;
  }, {} as Record<string, TaskWithStaff[]>);
};

// ============================================================================
// Data Extraction Utilities
// ============================================================================

/**
 * Gets unique task types
 */
export const getUniqueTaskTypes = (tasks: TaskWithStaff[]): string[] => {
  const types = new Set(
    tasks.map((task) => task.type).filter((type): type is string => !!type)
  );
  return Array.from(types).sort();
};

/**
 * Gets unique departments
 */
export const getUniqueDepartments = (tasks: TaskWithStaff[]): string[] => {
  const departments = new Set(
    tasks
      .map((task) => task.staffDepartment)
      .filter((dept): dept is string => !!dept)
  );
  return Array.from(departments).sort();
};

/**
 * Gets task counts by status
 */
export const getTaskCountsByStatus = (
  tasks: TaskWithStaff[]
): Record<TaskStatus, number> => {
  return tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<TaskStatus, number>);
};

/**
 * Gets task counts by priority
 */
export const getTaskCountsByPriority = (
  tasks: TaskWithStaff[]
): Record<TaskPriority, number> => {
  return tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<TaskPriority, number>);
};

/**
 * Gets completion percentage
 */
export const getTaskCompletionPercentage = (tasks: TaskWithStaff[]): number => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((task) => task.status === "COMPLETED").length;
  return Math.round((completed / tasks.length) * 100);
};

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Formats due date for display
 */
export const formatTaskDueDate = (task: TaskWithStaff): string => {
  if (!task.dueDate) return "No due date";

  const date = new Date(task.dueDate);
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (task.dueTime) {
    return `${formatted} at ${task.dueTime}`;
  }

  return formatted;
};

/**
 * Formats task summary
 */
export const formatTaskSummary = (task: TaskWithStaff): string => {
  const assignee = task.staffName || "Unassigned";
  return `${task.title} - ${assignee} (${task.status})`;
};

/**
 * Gets status badge color
 */
export const getTaskStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    PENDING: "gray",
    IN_PROGRESS: "blue",
    COMPLETED: "green",
    CANCELLED: "red",
  };
  return colors[status];
};

/**
 * Gets priority badge color
 */
export const getTaskPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    Low: "gray",
    Medium: "yellow",
    High: "red",
  };
  return colors[priority];
};

/**
 * Checks if task is overdue
 */
export const isTaskOverdue = (task: TaskWithStaff): boolean => {
  if (
    !task.dueDate ||
    task.status === "COMPLETED" ||
    task.status === "CANCELLED"
  ) {
    return false;
  }
  return new Date(task.dueDate) < new Date();
};
