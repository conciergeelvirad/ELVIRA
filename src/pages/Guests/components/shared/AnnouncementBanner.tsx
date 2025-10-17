/**
 * Announcement Banner Component
 *
 * Continuous scrolling ticker-style announcement banner
 * Similar to Times Square stock market displays
 * Pauses on hover/touch for readability
 * Data from database (announcements table)
 */

import { useEffect, useRef, useState } from "react";
import { useAnnouncements } from "../../../../hooks/queries/hotel-management/announcements";

interface AnnouncementBannerProps {
  hotelId: string;
}

export const AnnouncementBanner = ({ hotelId }: AnnouncementBannerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [isPaused, setIsPaused] = useState(false);
  const scrollPositionRef = useRef(0);
  const lastTimestampRef = useRef<number>(0);

  // Fetch announcements from database
  const { data: announcements, isLoading } = useAnnouncements(hotelId);

  // Filter only active announcements
  const activeAnnouncements = announcements?.filter((a) => a.is_active) || [];

  useEffect(() => {
    if (
      !scrollRef.current ||
      activeAnnouncements.length === 0 ||
      isPaused ||
      isLoading
    ) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const scrollContainer = scrollRef.current;
    const scrollSpeed = 0.03; // Reduced speed - pixels per millisecond (slower for readability)

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }

      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      scrollPositionRef.current += scrollSpeed * delta;

      // Reset when first set of messages scrolls out
      const contentWidth = scrollContainer.scrollWidth / 3; // Divide by 3 since we have 3 copies
      if (scrollPositionRef.current >= contentWidth) {
        scrollPositionRef.current = 0;
      }

      if (scrollContainer) {
        scrollContainer.style.transform = `translateX(-${scrollPositionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeAnnouncements.length, isPaused, isLoading]);

  // Don't render if loading or no announcements
  if (isLoading || activeAnnouncements.length === 0) return null;

  // Create announcement text with title and description
  const createAnnouncementText = () => {
    return activeAnnouncements
      .map((a) => `${a.title} — ${a.description}`)
      .join("     •     ");
  };

  const announcementText = createAnnouncementText();

  return (
    <div className="bg-gray-900 text-white overflow-hidden relative">
      <div className="h-10 flex items-center">
        <div
          ref={scrollRef}
          className="flex whitespace-nowrap gap-8"
          style={{ willChange: "transform" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Duplicate the content for seamless loop */}
          <span className="text-sm font-medium px-4">{announcementText}</span>
          <span className="text-sm font-medium px-4">{announcementText}</span>
          <span className="text-sm font-medium px-4">{announcementText}</span>
        </div>
      </div>
    </div>
  );
};
