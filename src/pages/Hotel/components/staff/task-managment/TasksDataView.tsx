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
} from "../../../../../components/common/data-display";
import { Column, GridColumn } from "../../../../../types/table";
import type { TaskWithStaff } from "../../../../../hooks/queries/hotel-management/tasks";
import { CheckSquare, User, Calendar, AlertCircle } from "lucide-react";

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
      const colors = {
        Low: "bg-blue-100 text-blue-800",
        Medium: "bg-yellow-100 text-yellow-800",
        High: "bg-red-100 text-red-800",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            colors[row.priority]
          }`}
        >
          {row.priority}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    accessor: "status",
    render: (_, row) => {
      const colors = {
        PENDING: "bg-gray-100 text-gray-800",
        IN_PROGRESS: "bg-blue-100 text-blue-800",
        COMPLETED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
      };
      const labels = {
        PENDING: "Pending",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            colors[row.status]
          }`}
        >
          {labels[row.status]}
        </span>
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
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {task.priority}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {statusLabel}
              </span>
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
