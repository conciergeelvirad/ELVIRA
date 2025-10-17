/**
 * Photo Grid Component
 *
 * Displays a horizontal scrolling grid of photos with pause on hover/touch
 */

import { RefObject } from "react";

interface PhotoGalleryItem {
  id: string;
  imageUrl: string;
  title: string;
}

interface PhotoGridProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  photos: PhotoGalleryItem[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
}

export const PhotoGrid = ({
  scrollContainerRef,
  photos,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}: PhotoGridProps) => {
  return (
    <div
      ref={scrollContainerRef}
      className="flex gap-4 overflow-x-hidden scrollbar-hide px-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {photos.map((photo, index) => (
        <div
          key={`${photo.id}-${index}`}
          className="flex-shrink-0 w-[280px] h-[200px] rounded-xl overflow-hidden shadow-md"
        >
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};
