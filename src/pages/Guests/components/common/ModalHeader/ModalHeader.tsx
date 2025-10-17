/**
 * Modal Header Component
 *
 * Sticky header with title and close button for modals
 */

import { X } from "lucide-react";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ModalHeader = ({ title, onClose }: ModalHeaderProps) => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between z-10">
      <h2 className="text-base font-semibold text-gray-900 flex-1 pr-3 line-clamp-1">
        {title}
      </h2>
      <button
        onClick={onClose}
        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors touch-manipulation flex-shrink-0"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};
