import React from "react";
import { StatusBadge, StatusType } from "./StatusBadge";

export interface DataField {
  key: string;
  label: string;
  value: unknown;
  type?:
    | "text"
    | "email"
    | "phone"
    | "url"
    | "date"
    | "datetime"
    | "status"
    | "badge"
    | "custom";
  format?: (value: unknown) => React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  hidden?: boolean;
  copyable?: boolean;
}

// Value formatters for different field types
export const formatFieldValue = (field: DataField): React.ReactNode => {
  if (field.format) {
    return field.format(field.value);
  }

  if (field.value === null || field.value === undefined || field.value === "") {
    return <span className="text-gray-400 italic">Not provided</span>;
  }

  switch (field.type) {
    case "email":
      return (
        <a
          href={`mailto:${field.value as string}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {field.value as string}
        </a>
      );

    case "phone":
      return (
        <a
          href={`tel:${field.value as string}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {field.value as string}
        </a>
      );

    case "url":
      return (
        <a
          href={field.value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {field.value as string}
        </a>
      );

    case "date":
      return new Date(field.value as string | Date).toLocaleDateString();

    case "datetime":
      return new Date(field.value as string | Date).toLocaleString();

    case "status":
      if (typeof field.value === "boolean") {
        return (
          <StatusBadge status={field.value ? "active" : "inactive"} size="sm" />
        );
      }
      return (
        <StatusBadge
          status={(field.value as string).toLowerCase() as StatusType}
          size="sm"
        />
      );

    case "badge":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {field.value as string}
        </span>
      );

    default:
      return String(field.value);
  }
};
