import React from "react";

/**
 * Card Action Footer Component
 *
 * A reusable footer component for cards that provides Edit and Delete action buttons.
 * Automatically stops event propagation to prevent card click when clicking buttons.
 *
 * @example
 * ```tsx
 * <GenericCard
 *   title="Item Name"
 *   footer={
 *     <CardActionFooter
 *       onEdit={() => handleEdit(item)}
 *       onDelete={() => handleDelete(item)}
 *     />
 *   }
 * />
 * ```
 */

interface CardActionFooterProps {
  /** Optional edit handler - if provided, shows Edit button */
  onEdit?: () => void;
  /** Optional delete handler - if provided, shows Delete button */
  onDelete?: () => void;
  /** Optional view handler - if provided, shows View button */
  onView?: () => void;
  /** Custom className for additional styling */
  className?: string;
  /** Custom button labels */
  labels?: {
    edit?: string;
    delete?: string;
    view?: string;
  };
}

export const CardActionFooter: React.FC<CardActionFooterProps> = ({
  onEdit,
  onDelete,
  onView,
  className = "",
  labels = {
    edit: "Edit",
    delete: "Delete",
    view: "View",
  },
}) => {
  // Don't render if no actions provided
  if (!onEdit && !onDelete && !onView) {
    return null;
  }

  return (
    <div className={`flex items-center justify-end space-x-2 ${className}`}>
      {onView && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("[CardActionFooter] View button clicked");
            onView();
          }}
          className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
        >
          {labels.view}
        </button>
      )}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("[CardActionFooter] Edit button clicked");
            onEdit();
          }}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
        >
          {labels.edit}
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
        >
          {labels.delete}
        </button>
      )}
    </div>
  );
};
