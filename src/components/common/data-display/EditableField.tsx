import { Edit2 } from "lucide-react";
import { cn } from "../../../utils";
import { useEditableInput } from "../../../hooks";
import { EditActionButtons } from "../ui/EditActionButtons";
import { INPUT_BASE, INPUT_PADDING_MD } from "../../../constants/styles";

interface EditableFieldProps {
  label: string;
  value: any;
  isEditing: boolean;
  onStartEdit?: () => void;
  onSave: (value: any) => void;
  onCancel: () => void;
  type?: "text" | "number" | "email" | "date" | "select" | "textarea";
  options?: { label: string; value: any }[];
  className?: string;
  placeholder?: string;
  alwaysShowEdit?: boolean;
}

export const EditableField = ({
  label,
  value,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  type = "text",
  options = [],
  className,
  placeholder = "",
  alwaysShowEdit = false,
}: EditableFieldProps) => {
  const { editValue, setEditValue, inputRef, handleSave, handleKeyDown } =
    useEditableInput<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >({
      value,
      isEditing,
      onSave,
      onCancel,
      allowEnterToSave: type !== "textarea",
    });

  const displayValue = () => {
    if (type === "select") {
      return options.find((opt) => opt.value === value)?.label || value || "-";
    }
    return value || "-";
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label}
      </label>

      {!isEditing ? (
        <div className="group flex items-center gap-2">
          <div className="flex-1 text-sm text-gray-900">{displayValue()}</div>
          {(alwaysShowEdit || onStartEdit) && (
            <button
              onClick={onStartEdit}
              className={cn(
                "p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all",
                alwaysShowEdit
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
              aria-label="Edit"
            >
              <Edit2 size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-start gap-2">
          {type === "select" ? (
            <select
              ref={inputRef as React.RefObject<HTMLSelectElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(INPUT_BASE, INPUT_PADDING_MD, "rounded-lg")}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === "textarea" ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={3}
              className={cn(
                INPUT_BASE,
                INPUT_PADDING_MD,
                "rounded-lg resize-none"
              )}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn(INPUT_BASE, INPUT_PADDING_MD, "rounded-lg")}
            />
          )}

          <EditActionButtons
            onSave={handleSave}
            onCancel={onCancel}
            size="md"
            className="pt-1"
          />
        </div>
      )}
    </div>
  );
};
