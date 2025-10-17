/**
 * Tasks Module
 *
 * Centralized exports for task management functionality.
 */

// Type exports
export type {
  Task,
  TaskInsert,
  TaskUpdate,
  TaskStatus,
  TaskPriority,
  StaffPersonalData,
  AssignedStaff,
  CreatorProfile,
  ExtendedTask,
  TaskWithStaff,
  TaskUpdateData,
  TaskStatusUpdate,
  TaskAssignment,
  TaskDeletion,
} from "./task.types";

// Constants exports
export {
  taskKeys,
  DEFAULT_HOTEL_ID,
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_SELECT_QUERY,
} from "./task.constants";

// Transformer exports
export {
  // Core transformation
  transformTask,
  transformTasks,

  // Filtering
  filterTasksByStatus,
  filterTasksByPriority,
  filterTasksByStaff,
  filterUnassignedTasks,
  filterOverdueTasks,
  filterTasksByDepartment,
  filterTasksByType,
  filterTasksByCreator,
  searchTasks,

  // Sorting
  sortTasksByDueDate,
  sortTasksByPriority,
  sortTasksByCreatedDate,
  sortTasksByTitle,
  sortTasksByStatus,

  // Grouping
  groupTasksByStatus,
  groupTasksByPriority,
  groupTasksByStaff,
  groupTasksByDepartment,
  groupTasksByType,

  // Data extraction
  getUniqueTaskTypes,
  getUniqueDepartments,
  getTaskCountsByStatus,
  getTaskCountsByPriority,
  getTaskCompletionPercentage,

  // Formatting
  formatTaskDueDate,
  formatTaskSummary,
  getTaskStatusColor,
  getTaskPriorityColor,
  isTaskOverdue,
} from "./task.transformers";

// Query hook exports
export {
  useTasks,
  useTasksByStatus,
  useTasksByStaff,
  useTask,
  useCreateTask,
  useUpdateTask,
  useUpdateTaskStatus,
  useAssignTask,
  useDeleteTask,
} from "./useTaskQueries";

// Notification hook exports
export {
  sendTaskNotification,
  useSendTaskNotification,
  type TaskNotificationResponse,
} from "./useTaskNotifications";
