/**
 * Generic Card Types
 *
 * Type definitions for the GenericCard component and its sub-components
 */

import { StatusType } from "../StatusBadge";

export interface CardSection {
  /** Optional icon for the section */
  icon?: React.ReactNode;
  /** Content to display (string or custom React node) */
  content: React.ReactNode;
  /** Optional custom className for styling */
  className?: string;
}

export interface CardBadge {
  /** Badge label text */
  label: string;
  /** Badge variant for styling */
  variant?: "filled" | "outlined" | "soft";
  /** Raw status value (for StatusBadge component) */
  status?: StatusType;
  /** Custom className for badge styling */
  className?: string;
}

export interface GenericCardProps {
  /** Card title (required) */
  title: React.ReactNode;

  /** Optional subtitle below title */
  subtitle?: React.ReactNode;

  /** Optional icon (for non-image cards) */
  icon?: React.ReactNode;

  /** Background color for icon container (e.g., "bg-blue-100") */
  iconBgColor?: string;

  /** Optional status badge (primary badge) */
  badge?: CardBadge;

  /** Optional secondary badges (for multiple badges like "Recommended" + "Active") */
  additionalBadges?: CardBadge[];

  /** Optional price to display prominently */
  price?: {
    value: number;
    currency?: string;
    className?: string;
  };

  /** Content sections array */
  sections?: CardSection[];

  /** Number of columns for grid layout (1 for single column, 2 for two columns) */
  gridColumns?: 1 | 2;

  /** Optional image URL (for image cards) */
  image?: string;

  /** Image height class (e.g., "h-48") */
  imageHeight?: string;

  /** Alt text for image */
  imageAlt?: string;

  /** Fallback element if image fails to load */
  imageFallback?: React.ReactNode;

  /** Click handler */
  onClick?: () => void;

  /** Additional custom className */
  className?: string;

  /** Disable hover effects and cursor */
  disableHover?: boolean;

  /** Optional footer content (e.g., action buttons) */
  footer?: React.ReactNode;
}
