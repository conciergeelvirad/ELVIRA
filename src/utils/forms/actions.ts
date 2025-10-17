import { ActionButton } from "../../components/common";

// Utility function to create common action configurations
export const createAction = {
  edit: (
    onClick: (e: React.MouseEvent) => void,
    options?: Partial<ActionButton>
  ): ActionButton => ({
    type: "edit",
    onClick,
    label: "Edit",
    ...options,
  }),

  delete: (
    onClick: (e: React.MouseEvent) => void,
    options?: Partial<ActionButton>
  ): ActionButton => ({
    type: "delete",
    onClick,
    label: "Delete",
    variant: "danger",
    ...options,
  }),

  view: (
    onClick: (e: React.MouseEvent) => void,
    options?: Partial<ActionButton>
  ): ActionButton => ({
    type: "view",
    onClick,
    label: "View",
    ...options,
  }),

  settings: (
    onClick: (e: React.MouseEvent) => void,
    options?: Partial<ActionButton>
  ): ActionButton => ({
    type: "settings",
    onClick,
    label: "Settings",
    ...options,
  }),

  custom: (
    onClick: (e: React.MouseEvent) => void,
    icon: React.ReactNode,
    label: string,
    options?: Partial<ActionButton>
  ): ActionButton => ({
    type: "custom",
    onClick,
    icon,
    label,
    ...options,
  }),
};
