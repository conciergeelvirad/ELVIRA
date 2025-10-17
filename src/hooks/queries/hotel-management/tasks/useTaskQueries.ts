/**
 * Task Query Hooks
 *
 * React Query hooks for task data management with staff relationships.
 * Provides hooks for fetching, creating, updating, and deleting tasks.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  TaskWithStaff,
  TaskInsert,
  TaskUpdateData,
  TaskStatusUpdate,
  TaskAssignment,
  TaskDeletion,
  ExtendedTask,
  TaskStatus,
} from "./task.types";
import { taskKeys, TASK_SELECT_QUERY } from "./task.constants";
import { transformTask, transformTasks } from "./task.transformers";
import { sendTaskNotification } from "./useTaskNotifications";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetches all tasks for a specific hotel with staff relationships
 *
 * @param hotelId - ID of the hotel to fetch tasks for
 * @returns Query result with tasks array (including staff data)
 */
export const useTasks = (hotelId: string) => {
  return useQuery({
    queryKey: taskKeys.list({ hotelId }),
    queryFn: async (): Promise<TaskWithStaff[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select(TASK_SELECT_QUERY)
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return transformTasks((data as ExtendedTask[]) ?? []);
    },
  });
};

/**
 * Fetches tasks filtered by status
 *
 * @param hotelId - ID of the hotel
 * @param status - Task status to filter by
 * @returns Query result with filtered tasks array
 */
export const useTasksByStatus = (hotelId: string, status: TaskStatus) => {
  return useQuery({
    queryKey: taskKeys.list({ hotelId, status }),
    queryFn: async (): Promise<TaskWithStaff[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select(TASK_SELECT_QUERY)
        .eq("hotel_id", hotelId)
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return transformTasks((data as ExtendedTask[]) ?? []);
    },
  });
};

/**
 * Fetches tasks assigned to a specific staff member
 *
 * @param staffId - ID of the staff member
 * @returns Query result with assigned tasks array
 */
export const useTasksByStaff = (staffId: string) => {
  return useQuery({
    queryKey: taskKeys.list({ staffId }),
    queryFn: async (): Promise<TaskWithStaff[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select(TASK_SELECT_QUERY)
        .eq("staff_id", staffId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return transformTasks((data as ExtendedTask[]) ?? []);
    },
  });
};

/**
 * Fetches a single task by ID with relationships
 *
 * @param taskId - ID of the task to fetch
 * @returns Query result with single task
 */
export const useTask = (taskId: string | undefined) => {
  return useQuery({
    queryKey: taskKeys.detail(taskId || ""),
    queryFn: async (): Promise<TaskWithStaff> => {
      if (!taskId) {
        throw new Error("Task ID is required");
      }

      const { data, error } = await supabase
        .from("tasks")
        .select(TASK_SELECT_QUERY)
        .eq("id", taskId)
        .single();

      if (error) {
        throw error;
      }

      return transformTask(data as ExtendedTask);
    },
    enabled: !!taskId,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Creates a new task
 *
 * @returns Mutation result for creating task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: TaskInsert) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert([task])
        .select()
        .single();

      if (error) {
        console.error("❌ Task creation failed:", error.message);
        throw error;
      }

      return data;
    },
    onSuccess: async (data) => {
      // Update UI immediately (fast response)
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["tasksByStaff"] });

      // Send email notification asynchronously (non-blocking)
      if (data.staff_id) {
        setTimeout(() => {
          sendTaskNotification(data.id)
            .then(() => {
              console.log("✅ Email notification sent");
            })
            .catch((error) => {
              console.error("⚠️ Email notification failed:", error.message);
            });
        }, 500);
      }
    },
  });
};

/**
 * Updates an existing task
 *
 * @returns Mutation result for updating task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: TaskUpdateData) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      // Invalidate list and detail queries
      queryClient.invalidateQueries({
        queryKey: taskKeys.list({ hotelId: data.hotel_id }),
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Updates task status only
 *
 * @returns Mutation result for updating status
 */
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: TaskStatusUpdate) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: taskKeys.list({ hotelId: variables.hotelId }),
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Assigns or unassigns a task to/from staff
 *
 * @returns Mutation result for task assignment
 */
export const useAssignTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, staffId }: TaskAssignment) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ staff_id: staffId })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate hotel tasks list
      queryClient.invalidateQueries({
        queryKey: taskKeys.list({ hotelId: variables.hotelId }),
      });
      // Invalidate task detail
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.id),
      });
      // Invalidate staff tasks if assigned
      if (variables.staffId) {
        queryClient.invalidateQueries({
          queryKey: taskKeys.list({ staffId: variables.staffId }),
        });
      }
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Deletes a task
 *
 * @returns Mutation result for deleting task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: TaskDeletion): Promise<string> => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) {
        throw error;
      }
      return id;
    },
    onSuccess: (deletedId, variables) => {
      // Invalidate tasks list
      queryClient.invalidateQueries({
        queryKey: taskKeys.list({ hotelId: variables.hotelId }),
      });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      // Remove task detail from cache
      queryClient.removeQueries({
        queryKey: taskKeys.detail(deletedId),
      });
    },
  });
};
