/**
 * Generic Third-Party Card Component
 *
 * A universal card component that works for all third-party types:
 * - Restaurants
 * - Tours & Activities
 * - Hotels
 * - Spas & Wellness
 *
 * This component adapts its display based on the `type` prop and available data.
 */

import { GenericCard, Badge } from "../../../../../../components/common";
import { getTypeIcon } from "./thirdPartyHelpers";
import type { ThirdPartyCardProps } from "./types";
import {
  createRatingSection,
  createLocationSection,
  createCategoriesSection,
  createDurationSection,
  createPriceSection,
  CardFooter,
} from "./third-party-card";

export const ThirdPartyCard = ({
  id,
  name,
  type,
  rating,
  reviewCount,
  location,
  categories,
  images,
  price,
  status,
  metadata,
  onView,
  onApprove,
  onReject,
  onRecommend,
}: ThirdPartyCardProps) => {
  // Get icon for this type
  const TypeIcon = getTypeIcon(type);

  // Build sections dynamically based on available data
  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [];

  // Rating section (if available)
  if (rating) {
    sections.push(createRatingSection(rating, reviewCount));
  }

  // Price display based on type
  if (price) {
    // For restaurants, show price level as badge
    if (type === "restaurant" && price.level) {
      const priceDisplay = "€".repeat(price.level);
      sections.push({
        content: <Badge variant="success">{priceDisplay}</Badge>,
      });
    }
    // For tours/hotels, show price with currency
    else if (type === "tour" || type === "hotel") {
      const priceSection = createPriceSection(price, type);
      if (priceSection) {
        sections.push(priceSection);
      }
    }
  }

  // Duration section (for tours)
  if (type === "tour" && metadata?.duration) {
    sections.push(createDurationSection(metadata.duration));
  }

  // Location/Address section
  sections.push(createLocationSection(location));

  // Categories section
  if (categories && categories.length > 0) {
    const categoriesSection = createCategoriesSection(categories);
    if (categoriesSection) {
      sections.push(categoriesSection);
    }
  }

  // Custom footer with actions
  const customFooter = (
    <CardFooter
      item={{ id, name, type }}
      onView={
        onView &&
        (() => {
          console.log("[ThirdPartyCard] Footer View clicked for:", id);
          onView();
        })
      }
      onApprove={
        onApprove &&
        (() => {
          console.log("[ThirdPartyCard] Footer Approve clicked for:", id);
          onApprove();
        })
      }
      onReject={
        onReject &&
        (() => {
          console.log("[ThirdPartyCard] Footer Reject clicked for:", id);
          onReject();
        })
      }
      onToggleRecommended={
        onRecommend &&
        (() => {
          console.log("[ThirdPartyCard] Footer Recommend clicked for:", id);
          onRecommend();
        })
      }
      currentStatus={
        status?.isApproved
          ? "approved"
          : status?.isRejected
          ? "rejected"
          : status?.isPending
          ? "pending"
          : null
      }
      isRecommended={status?.isRecommended}
      isLoading={false}
    />
  );

  return (
    <GenericCard
      image={images?.[0]}
      imageFallback={<TypeIcon className="w-16 h-16 text-gray-400" />}
      title={name}
      sections={sections}
      footer={customFooter}
      onClick={onView}
      disableHover={false}
    />
  );
};
