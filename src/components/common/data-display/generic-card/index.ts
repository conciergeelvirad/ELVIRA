/**
 * Generic Card - Barrel Exports
 *
 * Centralized exports for all Generic Card components and utilities.
 */

// Sub-components
export { CardImage } from "./CardImage";
export { CardHeader } from "./CardHeader";
export { CardContent } from "./CardContent";
export { CardBadges } from "./CardBadges";
export { CardFooter } from "./CardFooter";

// Utilities
export { renderBadge } from "./utils";

// Types
export type { CardSection, CardBadge, GenericCardProps } from "./types";

// Component prop types (for external use)
export type { CardImageProps } from "./CardImage";
export type { CardHeaderProps } from "./CardHeader";
export type { CardContentProps } from "./CardContent";
export type { CardBadgesProps } from "./CardBadges";
export type { CardFooterProps } from "./CardFooter";
