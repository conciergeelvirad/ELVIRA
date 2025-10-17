/**
 * Task Type Definitions
 *
 * TypeScript types for task management in the hotel system.
 */

import type { Database } from "../../../../types/supabase";

// Base database types
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

// Task status enum
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

// Task priority enum
export type TaskPriority = "Low" | "Medium" | "High";

// Staff personal data structure
export interface StaffPersonalData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  avatar_url?: string;
}

// Assigned staff structure
export interface AssignedStaff {
  id: string;
  employee_id: string;
  position: string;
  department: string;
  hotel_staff_personal_data: StaffPersonalData[];
}

// Creator profile structure
export interface CreatorProfile {
  id: string;
  email: string;
}

// Extended task with relationships from database
export interface ExtendedTask extends Task {
  assigned_staff?: AssignedStaff | null;
  created_by_profile?: CreatorProfile | null;
}

// Transformed task for UI consumption
export interface TaskWithStaff extends Record<string, unknown> {
  id: string;
  hotelId: string;
  title: string;
  description: string | null;
  type: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  staffId: string | null;
  staffName: string | null;
  staffEmail: string | null;
  staffPosition: string | null;
  staffDepartment: string | null;
  staffAvatar: string | null;
  dueDate: string | null;
  dueTime: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  createdByEmail: string | null;
}

// Update data structure
export interface TaskUpdateData {
  id: string;
  updates: TaskUpdate;
}

// Status update structure
export interface TaskStatusUpdate {
  id: string;
  status: TaskStatus;
  hotelId: string;
}

// Task assignment structure
export interface TaskAssignment {
  id: string;
  staffId: string | null;
  hotelId: string;
}

// Task deletion structure
export interface TaskDeletion {
  id: string;
  hotelId: string;
}
