/**
 * BottomSheet Component
 *
 * Reusable bottom sheet/drawer component with smooth animations
 * Can be used for carts, filters, menus, etc.
 *
 * Features:
 * - Smooth slide-up animation
 * - Backdrop overlay
 * - Swipe-to-close gesture
 * - Full height or auto height
 * - Accessible
 */

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  fullHeight?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  fullHeight = false,
  showCloseButton = true,
  className = "",
}: BottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Touch handlers for swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;

    if (diff > 100) {
      // Swipe down more than 100px = close
      onClose();
    }

    if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`
          fixed bottom-0 left-0 right-0 z-[60]
          bg-white rounded-t-2xl shadow-2xl
          transition-transform duration-300 ease-out
          ${fullHeight ? "h-[90vh]" : "max-h-[85vh]"}
          ${className}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bottom-sheet-title" : undefined}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200">
            <h2
              id="bottom-sheet-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="
                  p-2 -mr-2
                  text-gray-400 hover:text-gray-600
                  rounded-lg hover:bg-gray-100
                  transition-colors
                "
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className="overflow-y-auto flex-1"
          style={{ maxHeight: "calc(85vh - 80px)" }}
        >
          {children}
        </div>
      </div>
    </>
  );
};
