import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badgeCount?: number; // Notification badge count
}

export type NavigationSection =
  | "overview"
  | "hotel-staff"
  | "ai-support"
  | "chat-management"
  | "guest-management"
  | "amenities"
  | "hotel-restaurant"
  | "hotel-shop"
  | "third-party"
  | "announcements"
  | "qa-recommendations"
  | "emergency-contacts"
  | "settings";
