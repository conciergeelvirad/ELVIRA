/**
 * Card Footer Component
 *
 * Renders the footer section of a GenericCard (typically action buttons).
 */

import React from "react";

export interface CardFooterProps {
  /** Footer content (usually buttons or actions) */
  footer?: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ footer }) => {
  if (!footer) return null;

  return <div className="mt-4">{footer}</div>;
};
