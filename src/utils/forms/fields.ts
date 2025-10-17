import { DataField } from "../../components/common";

// Utility function to create common field configurations
export const createField = {
  text: (
    key: string,
    label: string,
    value: string | number,
    options?: Partial<DataField>
  ): DataField => ({
    key,
    label,
    value,
    type: "text",
    ...options,
  }),

  email: (
    key: string,
    label: string,
    value: string,
    options?: Partial<DataField>
  ): DataField => ({
    key,
    label,
    value,
    type: "email",
    copyable: true,
    ...options,
  }),

  phone: (
    key: string,
    label: string,
    value: string,
    options?: Partial<DataField>
  ): DataField => ({
    key,
    label,
    value,
    type: "phone",
    copyable: true,
    ...options,
  }),

  status: (
    key: string,
    label: string,
    value: boolean | string,
    options?: Partial<DataField>
  ): DataField => ({
    key,
    label,
    value,
    type: "status",
    ...options,
  }),

  date: (
    key: string,
    label: string,
    value: string | Date,
    options?: Partial<DataField>
  ): DataField => ({
    key,
    label,
    value,
    type: "date",
    ...options,
  }),

  custom: (
    key: string,
    label: string,
    value: unknown,
    formatter: (value: unknown) => React.ReactNode,
    options?: Partial<DataField>
  ): DataField => ({
    key,
    label,
    value,
    type: "custom",
    format: formatter,
    ...options,
  }),
};
