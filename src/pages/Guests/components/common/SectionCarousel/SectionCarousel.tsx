/**
 * SectionCarousel Component
 *
 * Reusable horizontal scrolling carousel with auto-scroll
 * Used for displaying cards in sections like Recommended, Experiences, etc.
 */

import { useRef, useEffect, ReactNode } from "react";

interface SectionCarouselProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: string;
  showScrollHint?: boolean;
  autoScroll?: boolean;
  autoScrollSpeed?: number;
  className?: string;
}

export const SectionCarousel = ({
  children,
  title,
  subtitle,
  showScrollHint = true,
  autoScroll = true,
  autoScrollSpeed = 0.5,
  className = "",
}: SectionCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let scrollPosition = 0;
    let animationFrameId: number;

    const scroll = () => {
      scrollPosition += autoScrollSpeed;
      if (scrollPosition >= container.scrollWidth / 2) {
        scrollPosition = 0;
      }
      container.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scroll);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [autoScroll, autoScrollSpeed]);

  return (
    <div className={`mb-8 ${className}`}>
      {/* Section Header */}
      {(title || subtitle) && (
        <div className="mb-4 px-4">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Scrolling Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4"
      >
        {children}
      </div>

      {/* Scroll Hint */}
      {showScrollHint && (
        <div className="px-4 mt-2">
          <p className="text-xs text-gray-400 text-center">
            Swipe to see more →
          </p>
        </div>
      )}
    </div>
  );
};
