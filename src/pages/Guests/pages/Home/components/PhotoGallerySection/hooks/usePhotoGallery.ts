/**
 * usePhotoGallery Hook
 *
 * Manages photo gallery state and auto-scroll animation
 * Handles data fetching, parsing, and animation logic
 */

import { useRef, useEffect } from "react";
import { useHotelSettings } from "../../../../../../../hooks/queries/useHotelSettings";
import { parseImageUrls, defaultGalleryImages } from "../utils/photoUtils";

interface PhotoGalleryItem {
  id: string;
  imageUrl: string;
  title: string;
}

export const usePhotoGallery = (hotelId: string) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const scrollPositionRef = useRef(0);
  const isPausedRef = useRef(false);
  const lastTimestampRef = useRef<number>();

  // Fetch hotel settings from database
  const { data: settings, isLoading, error } = useHotelSettings(hotelId);

  // Find the photo gallery setting
  const gallerySetting = settings?.find(
    (s) => s.setting_key === "hotelPhotoGallery"
  );

  // Parse image URLs from database
  const imageUrls = parseImageUrls(gallerySetting?.images_url || null);

  // Use demo images if no images in database
  const finalImageUrls =
    imageUrls.length > 0 ? imageUrls : defaultGalleryImages;

  // Convert URLs to photo items
  const photos: PhotoGalleryItem[] = finalImageUrls.map((url, index) => ({
    id: `photo-${index}`,
    imageUrl: url,
    title: `Hotel Photo ${index + 1}`,
  }));

  // Auto-scroll animation effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || photos.length === 0 || isLoading) return;

    // Animation speed (pixels per millisecond)
    const SCROLL_SPEED = 0.15;

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      if (!isPausedRef.current && container) {
        // Calculate scroll distance based on time elapsed
        const scrollDistance = SCROLL_SPEED * deltaTime;
        scrollPositionRef.current += scrollDistance;

        // Get the width of content to determine when to loop
        const scrollWidth = container.scrollWidth;
        const containerWidth = container.clientWidth;
        const maxScroll = (scrollWidth - containerWidth) / 2;

        // Reset position for seamless loop
        if (scrollPositionRef.current >= maxScroll) {
          scrollPositionRef.current = 0;
        }

        container.scrollLeft = scrollPositionRef.current;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [photos.length, isLoading]);

  // Pause/resume handlers
  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
  };

  const handleTouchStart = () => {
    isPausedRef.current = true;
  };

  const handleTouchEnd = () => {
    isPausedRef.current = false;
  };

  // Duplicate photos for seamless scrolling
  const duplicatedPhotos = [...photos, ...photos];

  return {
    scrollContainerRef,
    photos: duplicatedPhotos,
    isLoading,
    error,
    handlers: {
      handleMouseEnter,
      handleMouseLeave,
      handleTouchStart,
      handleTouchEnd,
    },
  };
};
