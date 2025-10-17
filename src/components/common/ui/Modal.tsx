import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div
        className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col animate-scale-in`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}

        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

interface ModalHeaderProps {
  children: ReactNode;
}

export const ModalHeader = ({ children }: ModalHeaderProps) => {
  return <div className="px-6 py-4 border-b border-gray-200">{children}</div>;
};

interface ModalBodyProps {
  children: ReactNode;
}

export const ModalBody = ({ children }: ModalBodyProps) => {
  return <div className="px-6 py-4">{children}</div>;
};

interface ModalFooterProps {
  children: ReactNode;
}

export const ModalFooter = ({ children }: ModalFooterProps) => {
  return (
    <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 flex-shrink-0 sticky bottom-0">
      {children}
    </div>
  );
};
