/**
 * Tasks Data View Component
 *
 * Renders tasks in table or grid view with pagination and action handlers.
 */

import React from "react";
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
  StatusBadge,
} from "../../../../../components/common/data-display";
import { Column, GridColumn } from "../../../../../types/table";
import type { TaskWithStaff } from "../../../../../hooks/queries/hotel-management/tasks";
import { CheckSquare, User, Calendar } from "lucide-react";

interface TasksDataViewProps {
  viewMode: "list" | "grid";
  filteredData: unknown[];
  handleRowClick: (task: TaskWithStaff) => void;
  onEdit?: (task: TaskWithStaff) => void;
  onDelete?: (task: TaskWithStaff) => void;
}

/**
 * Table columns for tasks
 */
const taskColumns: Column<TaskWithStaff>[] = [
  {
    key: "priority",
    header: "Priority",
    accessor: "priority",
    render: (_, row) => {
      const priorityMap: Record<string, "high" | "medium" | "low"> = {
        High: "high",
        Medium: "medium",
        Low: "low",
      };
      return (
        <StatusBadge
          status={priorityMap[row.priority] || "low"}
          label={row.priority}
          variant="soft"
          size="sm"
        />
      );
    },
  },
  {
    key: "status",
    header: "Status",
    accessor: "status",
    render: (_, row) => {
      const statusMap: Record<
        string,
        "pending" | "info" | "completed" | "cancelled"
      > = {
        PENDING: "pending",
        IN_PROGRESS: "info",
        COMPLETED: "completed",
        CANCELLED: "cancelled",
      };
      const labels: Record<string, string> = {
        PENDING: "Pending",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled",
      };
      return (
        <StatusBadge
          status={statusMap[row.status] || "default"}
          label={labels[row.status] || row.status}
          variant="soft"
          size="sm"
        />
      );
    },
  },
  {
    key: "dueDate",
    header: "Due Date",
    accessor: (task) =>
      task.dueDate
        ? new Date(task.dueDate).toLocaleDateString()
        : "No due date",
  },
  {
    key: "staffName",
    header: "Assigned To",
    accessor: (task) => task.staffName || "Unassigned",
  },
  {
    key: "title",
    header: "Task",
    accessor: "title",
  },
  {
    key: "description",
    header: "Description",
    accessor: (task) => task.description || "-",
    render: (_, row) => (
      <span className="line-clamp-2 text-sm text-gray-600">
        {row.description || "-"}
      </span>
    ),
  },
];

/**
 * Grid columns for tasks
 */
const taskGridColumns: GridColumn[] = [
  { key: "title", label: "Task" },
  { key: "staffName", label: "Assigned To" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
];

/**
 * Task Card Component for Grid View
 */
const TaskCard: React.FC<{
  task: TaskWithStaff;
  onClick: () => void;
  onEdit?: (task: TaskWithStaff) => void;
  onDelete?: (task: TaskWithStaff) => void;
}> = ({ task, onClick, onEdit, onDelete }) => {
  const statusLabels = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  const statusLabel = statusLabels[task.status] || task.status;

  // Map priority and status to StatusBadge types
  const priorityMap: Record<string, "high" | "medium" | "low"> = {
    High: "high",
    Medium: "medium",
    Low: "low",
  };

  const statusMap: Record<
    string,
    "pending" | "info" | "completed" | "cancelled"
  > = {
    PENDING: "pending",
    IN_PROGRESS: "info",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  };

  // Build badges array - TaskCard has TWO badges (priority + status)
  const badges = [
    {
      label: task.priority,
      variant: "soft" as const,
    },
    {
      label: statusLabel,
      variant: "soft" as const,
    },
  ];

  // Build sections
  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [
    {
      icon: <User className="w-4 h-4" />,
      content: task.staffName || "Unassigned",
    },
  ];

  if (task.dueDate) {
    sections.push({
      icon: <Calendar className="w-4 h-4" />,
      content: new Date(task.dueDate).toLocaleDateString(),
    });
  }

  if (task.description) {
    sections.push({
      content: (
        <span className="text-sm text-gray-500 line-clamp-2">
          {task.description}
        </span>
      ),
    });
  }

  return (
    <GenericCard
      icon={<CheckSquare className="w-5 h-5 text-purple-600" />}
      iconBgColor="bg-purple-100"
      title={<span className="line-clamp-2">{task.title}</span>}
      badge={badges[1]}
      sections={[
        {
          content: (
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <StatusBadge
                status={priorityMap[task.priority] || "low"}
                label={task.priority}
                variant="soft"
                size="sm"
              />
              <StatusBadge
                status={statusMap[task.status] || "default"}
                label={statusLabel}
                variant="soft"
                size="sm"
              />
            </div>
          ),
        },
        ...sections,
      ]}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(task) : undefined}
          onDelete={onDelete ? () => onDelete(task) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};

/**
 * Tasks data view with table and grid rendering
 */
export const TasksDataView: React.FC<TasksDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  onEdit,
  onDelete,
}) => {
  return (
    <GenericDataView<TaskWithStaff>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={taskColumns}
      gridColumns={taskGridColumns}
      getItemId={(task) => task.id}
      renderCard={(task, onClick) => (
        <TaskCard
          task={task}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No tasks found"
    />
  );
};
