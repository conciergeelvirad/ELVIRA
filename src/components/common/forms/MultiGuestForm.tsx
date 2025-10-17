/**
 * Multi-Guest Carousel Component
 *
 * Simple carousel wrapper for managing multiple guests
 */

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Users } from "lucide-react";
import { Button } from "../ui";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
}

interface MultiGuestCarouselProps {
  children: React.ReactNode;
  onGuestChange?: (index: number) => void;
  onGuestAdd?: (index: number) => void;
  disabled?: boolean;
}

export const MultiGuestCarousel: React.FC<MultiGuestCarouselProps> = ({
  children,
  onGuestChange,
  onGuestAdd,
  disabled = false,
}) => {
  const [guests, setGuests] = useState<Guest[]>([
    { id: "1", firstName: "", lastName: "" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAdd = () => {
    const newGuest: Guest = {
      id: String(guests.length + 1),
      firstName: "",
      lastName: "",
    };
    setGuests([...guests, newGuest]);
    const newIndex = guests.length;
    setCurrentIndex(newIndex);
    onGuestAdd?.(newIndex); // Notify parent about new guest
  };

  const handleRemove = () => {
    if (guests.length === 1) return;

    const newGuests = guests.filter((_, i) => i !== currentIndex);
    setGuests(newGuests);

    const newIndex =
      currentIndex >= newGuests.length ? newGuests.length - 1 : currentIndex;
    setCurrentIndex(newIndex);
    onGuestChange?.(newIndex);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onGuestChange?.(newIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < guests.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onGuestChange?.(newIndex);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    onGuestChange?.(index);
  };

  return (
    <div className="space-y-4">
      {/* Compact Navigation Header */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>
            Guest {currentIndex + 1} of {guests.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0 || disabled}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous guest"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-1.5 px-2">
            {guests.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDotClick(index)}
                disabled={disabled}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-blue-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400 w-1.5"
                }`}
                title={`Guest ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === guests.length - 1 || disabled}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Next guest"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>

          {/* Remove Guest Button (subtle) */}
          {guests.length > 1 && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="p-1 ml-2 rounded hover:bg-red-50 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Remove this guest"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {children}

      {/* Hidden fields */}
      <input type="hidden" name="guest_count" value={guests.length} />
      <input type="hidden" name="current_guest" value={currentIndex} />

      {/* Add Guest Button - Below the form fields */}
      <div className="pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon={Plus}
          onClick={handleAdd}
          disabled={disabled}
          className="w-full justify-center"
        >
          Add Another Guest
        </Button>
      </div>
    </div>
  );
};
