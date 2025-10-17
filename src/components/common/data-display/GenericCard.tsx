/**
 * Generic Card Component
 *
 * A flexible, reusable card component that handles various layouts:
 * - Standard cards with icon, title, and content sections
 * - Image cards with badges positioned over the image
 * - Price display for product/amenity cards
 * - Multiple badges support (primary + additional badges)
 * - Footer section for action buttons
 * - Consistent hover effects and click handling
 *
 * @example Standard Card (Icon-based)
 * ```tsx
 * <GenericCard
 *   icon={<User className="w-6 h-6 text-blue-600" />}
 *   iconBgColor="bg-blue-100"
 *   title="John Doe"
 *   subtitle="ID: EMP-001"
 *   badge={{ label: "Active", variant: "success" }}
 *   sections={[
 *     { icon: <Mail />, content: "john@example.com" },
 *     { icon: <Phone />, content: "+1234567890" }
 *   ]}
 *   onClick={() => console.log("Clicked")}
 * />
 * ```
 *
 * @example Image Card with Price and Multiple Badges
 * ```tsx
 * <GenericCard
 *   image="/path/to/image.jpg"
 *   imageHeight="h-48"
 *   title="Deluxe Room"
 *   badge={{ label: "Available", variant: "soft" }}
 *   price={{ value: 199.99, currency: "$", className: "text-xl font-bold text-green-600" }}
 *   additionalBadges={[
 *     { label: "Recommended", variant: "soft", className: "bg-blue-100 text-blue-700" },
 *     { label: "Popular", variant: "soft", className: "bg-purple-100 text-purple-700" }
 *   ]}
 *   sections={[
 *     { content: "Spacious room with ocean view" }
 *   ]}
 *   footer={
 *     <div className="flex space-x-2">
 *       <button className="text-blue-600">Edit</button>
 *       <button className="text-red-600">Delete</button>
 *     </div>
 *   }
 *   onClick={() => console.log("Clicked")}
 * />
 * ```
 */

import React from "react";
import { CardImage } from "./generic-card/CardImage";
import { CardHeader } from "./generic-card/CardHeader";
import { CardContent } from "./generic-card/CardContent";
import { CardBadges } from "./generic-card/CardBadges";
import { CardFooter } from "./generic-card/CardFooter";
import { renderBadge } from "./generic-card/utils";
import type { GenericCardProps } from "./generic-card/types";

// Re-export types for backwards compatibility
export type {
  CardSection,
  CardBadge,
  GenericCardProps,
} from "./generic-card/types";

/**
 * Generic Card Component
 *
 * Renders a flexible card that can display:
 * - Icon-based cards (staff, tasks, etc.)
 * - Image-based cards (menu items, products, etc.)
 * - Status badges (inside image for image cards, in header for regular cards)
 * - Multiple content sections with icons
 */
export const GenericCard: React.FC<GenericCardProps> = ({
  title,
  subtitle,
  icon,
  iconBgColor = "bg-gray-100",
  badge,
  additionalBadges = [],
  price,
  sections = [],
  gridColumns = 1,
  image,
  imageHeight = "h-48",
  imageAlt = "",
  imageFallback,
  onClick,
  className = "",
  disableHover = false,
  footer,
}) => {
  const baseClasses = `
    bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden
    flex flex-col h-full
    ${!disableHover ? "hover:shadow-md transition-shadow cursor-pointer" : ""}
    ${className}
  `.trim();

  return (
    <div
      className={baseClasses}
      onClick={
        onClick
          ? (e) => {
              // Only trigger click if the click wasn't on an action button
              if (!(e.target as HTMLElement).closest("button")) {
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Image section (if present) */}
      {image && (
        <CardImage
          image={image}
          imageHeight={imageHeight}
          imageAlt={imageAlt}
          imageFallback={imageFallback}
          badge={badge}
          onRenderBadge={renderBadge}
        />
      )}

      {/* Content section - flex-1 makes it take remaining space */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        {/* Header with title, subtitle, price, and badge (for non-image cards) */}
        <CardHeader
          title={title}
          subtitle={subtitle}
          icon={icon}
          iconBgColor={iconBgColor}
          badge={badge}
          price={price}
          hasImage={!!image}
          onRenderBadge={renderBadge}
        />

        {/* Content sections - flex-1 pushes content to fill space */}
        <div className="flex-1">
          <CardContent sections={sections} gridColumns={gridColumns} />
        </div>

        {/* Additional badges (for multiple status indicators) */}
        <CardBadges badges={additionalBadges} onRenderBadge={renderBadge} />

        {/* Footer (for action buttons, etc.) */}
        <CardFooter footer={footer} />
      </div>
    </div>
  );
};
