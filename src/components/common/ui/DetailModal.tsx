import { Modal, ModalBody, ModalFooter, Button } from "./index";

interface DetailField {
  label: string;
  value: string | number | boolean | React.ReactNode;
  type?: "text" | "email" | "phone" | "url" | "status" | "date" | "custom";
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: DetailField[];
  onEdit?: () => void;
  onDelete?: () => void;
  editText?: string;
  deleteText?: string;
}

export const DetailModal = ({
  isOpen,
  onClose,
  title,
  fields,
  onEdit,
  onDelete,
  editText = "Edit",
  deleteText = "Delete",
}: DetailModalProps) => {
  const formatValue = (field: DetailField) => {
    if (field.type === "custom") {
      return field.value;
    }

    if (typeof field.value === "boolean") {
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            field.value
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {field.value ? "Active" : "Inactive"}
        </span>
      );
    }

    if (field.type === "phone" && typeof field.value === "string") {
      return (
        <a
          href={`tel:${field.value}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {field.value}
        </a>
      );
    }

    if (field.type === "email" && typeof field.value === "string") {
      return (
        <a
          href={`mailto:${field.value}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {field.value}
        </a>
      );
    }

    if (field.type === "url" && typeof field.value === "string") {
      return (
        <a
          href={field.value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {field.value}
        </a>
      );
    }

    if (field.type === "date" && typeof field.value === "string") {
      return new Date(field.value).toLocaleDateString();
    }

    return field.value?.toString() || "-";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <ModalBody>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className={
                field.type === "custom" || !field.label
                  ? ""
                  : "border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
              }
            >
              {field.type === "custom" || !field.label ? (
                // Full-width for custom content or when no label
                <div className="w-full">{formatValue(field)}</div>
              ) : (
                // Two-column layout for regular fields
                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <div className="sm:w-1/3">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {field.label}
                    </span>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="text-sm text-gray-900">
                      {formatValue(field)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                {editText}
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" onClick={onDelete}>
                {deleteText}
              </Button>
            )}
          </div>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
