/**
 * Photo Gallery Section Component
 *
 * Auto-scrolling carousel displaying hotel photos
 *
 * Refactored to use:
 * - usePhotoGallery: Custom hook for data fetching and animation
 * - PhotoGrid: Grid display component
 * - GalleryLoading: Loading state component
 * - photoUtils: Utility functions for parsing images
 *
 * Features:
 * - Automatic horizontal scrolling
 * - Pause on hover/touch
 * - Rounded image cards
 * - Data from database (hotel_settings.images_url)
 */

import { usePhotoGallery } from "./PhotoGallerySection/hooks/usePhotoGallery";
import { PhotoGrid, GalleryLoading } from "./PhotoGallerySection/components";

interface PhotoGallerySectionProps {
  hotelId: string;
}

export const PhotoGallerySection = ({ hotelId }: PhotoGallerySectionProps) => {
  const { scrollContainerRef, photos, isLoading, handlers } =
    usePhotoGallery(hotelId);

  // Loading state
  if (isLoading) {
    return <GalleryLoading />;
  }

  // Don't render if no photos
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="px-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Photo <span className="text-blue-600">Gallery</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Discover our beautiful spaces and amenities
        </p>
      </div>

      {/* Photo Grid */}
      <PhotoGrid
        scrollContainerRef={scrollContainerRef}
        photos={photos}
        onMouseEnter={handlers.handleMouseEnter}
        onMouseLeave={handlers.handleMouseLeave}
        onTouchStart={handlers.handleTouchStart}
        onTouchEnd={handlers.handleTouchEnd}
      />
    </div>
  );
};
