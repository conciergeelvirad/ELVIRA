import React from "react";
import { DetailModal } from "../ui/DetailModal";

interface CRUDDetailModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: T | null;
  onEdit?: () => void;
  onDelete?: () => void;
  renderDetailContent?: (item: T) => React.ReactNode;
}

// This is an adapter component that makes the DetailModal compatible with the CRUDModalContainer
export const CRUDDetailModal = <T,>({
  isOpen,
  onClose,
  title,
  data,
  onEdit,
  onDelete,
  renderDetailContent,
}: CRUDDetailModalProps<T>): React.ReactElement => {
  // Generate fields based on data or custom rendering
  const fields = React.useMemo(() => {
    if (!data) return [];

    if (renderDetailContent) {
      // If there's a custom renderer, return a single custom field
      return [
        {
          label: "",
          value: renderDetailContent(data),
          type: "custom" as const,
        },
      ];
    }

    // Default fields for when no custom renderer is provided
    return Object.entries(data as Record<string, unknown>).map(
      ([key, value]) => ({
        label:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        value: value?.toString() || "-",
        type: "text" as const,
      })
    );
  }, [data, renderDetailContent]);

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      fields={fields}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};
