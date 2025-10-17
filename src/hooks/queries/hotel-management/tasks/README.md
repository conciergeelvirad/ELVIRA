# Tasks Query Module

Comprehensive query hooks and utilities for managing hotel task data with staff relationships.

## Overview

This module provides React Query hooks for task CRUD operations, along with utilities for filtering, sorting, grouping, and formatting task data. It handles complex relationships with staff members and their personal data.

## Structure

```
tasks/
├── task.types.ts           # TypeScript type definitions
├── task.constants.ts       # Query keys and constants
├── task.transformers.ts    # Data transformation utilities (40+ functions)
├── useTaskQueries.ts       # React Query hooks
├── index.ts                # Barrel exports
└── README.md               # This file
```

## Type Definitions

### Core Types

- `Task` - Base task record from database
- `TaskInsert` - Data shape for creating new tasks
- `TaskUpdate` - Partial data shape for updates
- `ExtendedTask` - Task with staff and creator relationships
- `TaskWithStaff` - Transformed task with flattened staff data
- `TaskStatus` - 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
- `TaskPriority` - 'Low' | 'Medium' | 'High'

### Helper Types

- `TaskUpdateData` - Update operation payload (id + updates)
- `TaskStatusUpdate` - Status update payload
- `TaskAssignment` - Assignment operation payload
- `TaskDeletion` - Deletion operation payload

## Query Hooks

### Fetching Data

#### `useTasks(hotelId: string)`

Fetches all tasks for a hotel with staff relationships.

```typescript
const { data: tasks, isLoading } = useTasks(hotelId);
```

#### `useTasksByStatus(hotelId: string, status: TaskStatus)`

Fetches tasks filtered by status.

```typescript
const { data: pendingTasks } = useTasksByStatus(hotelId, "PENDING");
```

#### `useTasksByStaff(staffId: string)`

Fetches tasks assigned to a specific staff member.

```typescript
const { data: staffTasks } = useTasksByStaff(staffId);
```

#### `useTask(taskId?: string)`

Fetches a single task by ID with relationships.

```typescript
const { data: task } = useTask(taskId);
```

### Mutations

#### `useCreateTask()`

Creates a new task.

```typescript
const createTask = useCreateTask();

createTask.mutate({
  hotel_id: hotelId,
  title: "Room Maintenance",
  description: "Fix air conditioning in room 305",
  priority: "High",
  status: "PENDING",
  staff_id: staffId,
  due_date: "2025-10-15",
  due_time: "14:00",
  type: "Maintenance",
  created_by: userId,
});
```

#### `useUpdateTask()`

Updates an existing task.

```typescript
const updateTask = useUpdateTask();

updateTask.mutate({
  id: taskId,
  updates: {
    status: "IN_PROGRESS",
    description: "Updated description",
  },
});
```

#### `useUpdateTaskStatus()`

Updates only the task status.

```typescript
const updateStatus = useUpdateTaskStatus();

updateStatus.mutate({
  id: taskId,
  status: "COMPLETED",
  hotelId,
});
```

#### `useAssignTask()`

Assigns or unassigns a task to/from staff.

```typescript
const assignTask = useAssignTask();

assignTask.mutate({
  id: taskId,
  staffId: newStaffId, // or null to unassign
  hotelId,
});
```

#### `useDeleteTask()`

Deletes a task.

```typescript
const deleteTask = useDeleteTask();

deleteTask.mutate({ id: taskId, hotelId });
```

## Transformer Utilities

### Core Transformation

- `transformTask(task)` - Transforms ExtendedTask to TaskWithStaff
- `transformTasks(tasks)` - Transforms array of extended tasks

### Filtering Functions (9)

- `filterTasksByStatus(tasks, status)` - Filters by status
- `filterTasksByPriority(tasks, priority)` - Filters by priority
- `filterTasksByStaff(tasks, staffId)` - Filters by assigned staff
- `filterUnassignedTasks(tasks)` - Filters unassigned tasks
- `filterOverdueTasks(tasks)` - Filters overdue tasks
- `filterTasksByDepartment(tasks, department)` - Filters by department
- `filterTasksByType(tasks, type)` - Filters by type
- `filterTasksByCreator(tasks, creatorId)` - Filters by creator
- `searchTasks(tasks, searchTerm)` - Searches by title/description/staff name

### Sorting Functions (5)

- `sortTasksByDueDate(tasks)` - Sorts by due date (earliest first)
- `sortTasksByPriority(tasks)` - Sorts by priority (High → Low)
- `sortTasksByCreatedDate(tasks)` - Sorts by creation (newest first)
- `sortTasksByTitle(tasks)` - Sorts alphabetically by title
- `sortTasksByStatus(tasks)` - Sorts by status (custom order)

### Grouping Functions (5)

- `groupTasksByStatus(tasks)` - Groups by status
- `groupTasksByPriority(tasks)` - Groups by priority
- `groupTasksByStaff(tasks)` - Groups by assigned staff
- `groupTasksByDepartment(tasks)` - Groups by department
- `groupTasksByType(tasks)` - Groups by type

### Data Extraction Functions (5)

- `getUniqueTaskTypes(tasks)` - Returns unique task types
- `getUniqueDepartments(tasks)` - Returns unique departments
- `getTaskCountsByStatus(tasks)` - Returns counts per status
- `getTaskCountsByPriority(tasks)` - Returns counts per priority
- `getTaskCompletionPercentage(tasks)` - Returns completion %

### Formatting Functions (5)

- `formatTaskDueDate(task)` - Formats due date for display
- `formatTaskSummary(task)` - Creates summary string
- `getTaskStatusColor(status)` - Returns badge color for status
- `getTaskPriorityColor(priority)` - Returns badge color for priority
- `isTaskOverdue(task)` - Checks if task is overdue

## Usage Examples

### Display Tasks with Filtering

```typescript
import {
  useTasks,
  filterTasksByStatus,
  filterOverdueTasks,
  sortTasksByPriority,
} from "@/hooks/queries/hotel-management/tasks";

function TaskList({ hotelId }: { hotelId: string }) {
  const { data: tasks = [], isLoading } = useTasks(hotelId);

  const urgentTasks = useMemo(() => {
    const pending = filterTasksByStatus(tasks, "PENDING");
    const overdue = filterOverdueTasks(pending);
    return sortTasksByPriority(overdue);
  }, [tasks]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2>Urgent Tasks ({urgentTasks.length})</h2>
      {urgentTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

### Create Task with Validation

```typescript
import {
  useCreateTask,
  DEFAULT_HOTEL_ID,
} from "@/hooks/queries/hotel-management/tasks";

function CreateTaskForm() {
  const createTask = useCreateTask();

  const handleSubmit = (formData: FormData) => {
    createTask.mutate(
      {
        hotel_id: DEFAULT_HOTEL_ID,
        title: formData.title,
        description: formData.description,
        priority: formData.priority as TaskPriority,
        status: "PENDING",
        staff_id: formData.staffId,
        due_date: formData.dueDate,
        due_time: formData.dueTime,
        type: formData.type,
        created_by: currentUserId,
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          closeModal();
        },
        onError: (error) => {
          toast.error("Failed to create task");
        },
      }
    );
  };

  return <TaskForm onSubmit={handleSubmit} />;
}
```

### Task Dashboard with Stats

```typescript
import {
  useTasks,
  getTaskCountsByStatus,
  getTaskCountsByPriority,
  getTaskCompletionPercentage,
  groupTasksByDepartment,
} from "@/hooks/queries/hotel-management/tasks";

function TaskDashboard({ hotelId }: { hotelId: string }) {
  const { data: tasks = [] } = useTasks(hotelId);

  const statusCounts = getTaskCountsByStatus(tasks);
  const priorityCounts = getTaskCountsByPriority(tasks);
  const completionRate = getTaskCompletionPercentage(tasks);
  const byDepartment = groupTasksByDepartment(tasks);

  return (
    <div>
      <StatCard title="Completion Rate" value={`${completionRate}%`} />
      <StatCard title="Pending" value={statusCounts.PENDING || 0} />
      <StatCard title="In Progress" value={statusCounts.IN_PROGRESS || 0} />
      <StatCard title="High Priority" value={priorityCounts.High || 0} />

      <DepartmentBreakdown data={byDepartment} />
    </div>
  );
}
```

### Assign Task to Staff

```typescript
import { useAssignTask } from "@/hooks/queries/hotel-management/tasks";

function TaskAssignment({ taskId, hotelId }: Props) {
  const assignTask = useAssignTask();

  const handleAssign = (staffId: string) => {
    assignTask.mutate(
      {
        id: taskId,
        staffId,
        hotelId,
      },
      {
        onSuccess: () => {
          toast.success("Task assigned successfully");
        },
      }
    );
  };

  return <StaffSelector onSelect={handleAssign} />;
}
```

## Database Schema

The `tasks` table structure:

- `id` (uuid, primary key)
- `hotel_id` (uuid, foreign key)
- `title` (text, required)
- `description` (text, nullable)
- `type` (text, nullable)
- `priority` ('Low' | 'Medium' | 'High')
- `status` ('PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED')
- `staff_id` (uuid, foreign key to hotel_staff, nullable)
- `due_date` (date, nullable)
- `due_time` (time, nullable)
- `created_by` (uuid, foreign key to auth.users)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Relationships

- `assigned_staff` → `hotel_staff` (staff_id)
  - Includes: id, employee_id, position, department
  - Nested: `hotel_staff_personal_data` (first_name, last_name, email, etc.)
- `created_by_profile` → `profiles` (created_by)
  - Includes: id, email

## Query Key Structure

```typescript
{
  all: ['tasks'],
  lists: () => ['tasks', 'list'],
  list: (filters) => ['tasks', 'list', filters],
  details: () => ['tasks', 'detail'],
  detail: (id) => ['tasks', 'detail', id],
}
```

## Best Practices

1. **Use Transformers**: Always use transformer utilities for data manipulation
2. **Memoize Expensive Operations**: Use `useMemo` for filtering/sorting/grouping
3. **Handle Loading States**: Display appropriate loading indicators
4. **Type Safety**: All functions are fully typed - leverage TypeScript
5. **Optimistic Updates**: Consider implementing for better UX
6. **Error Handling**: Always handle mutation errors gracefully
7. **Staff Relationships**: Tasks automatically include staff data when fetched

## Performance Notes

- The select query includes staff relationships - data is pre-joined
- Transformations happen on the client after fetch
- Use status-specific queries (`useTasksByStatus`) when possible for better caching
- Consider pagination for large task lists

## Related Modules

- `hotel-staff` - Staff member management
- `absence-requests` - Staff absence tracking
- Related pages: `HotelStaffPage`
