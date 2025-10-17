import {
  BarChart3,
  Users,
  MessageSquare,
  UserCheck,
  Wifi,
  UtensilsCrossed,
  ShoppingBag,
  Megaphone,
  HelpCircle,
  Phone,
  Building2,
  Settings,
  Bot,
} from "lucide-react";
import { NavigationItem } from "../../types/navigation";

export const HOTEL_NAVIGATION: NavigationItem[] = [
  {
    id: "overview",
    label: "OVERVIEW",
    icon: BarChart3,
    path: "/hotel/overview",
  },
  {
    id: "hotel-staff",
    label: "HOTEL STAFF",
    icon: Users,
    path: "/hotel/staff",
  },
  {
    id: "chat-management",
    label: "CHAT MANAGEMENT",
    icon: MessageSquare,
    path: "/hotel/chat-management",
  },
  {
    id: "guest-management",
    label: "GUEST MANAGEMENT",
    icon: UserCheck,
    path: "/hotel/guest-management",
  },
  {
    id: "amenities",
    label: "AMENITIES",
    icon: Wifi,
    path: "/hotel/amenities",
  },
  {
    id: "hotel-restaurant",
    label: "HOTEL RESTAURANT",
    icon: UtensilsCrossed,
    path: "/hotel/restaurant",
  },
  {
    id: "hotel-shop",
    label: "HOTEL SHOP",
    icon: ShoppingBag,
    path: "/hotel/shop",
  },
  {
    id: "announcements",
    label: "ANNOUNCEMENTS",
    icon: Megaphone,
    path: "/hotel/announcements",
  },
  {
    id: "qa-recommendations",
    label: "Q&A + RECOMMENDATIONS",
    icon: HelpCircle,
    path: "/hotel/qa-recommendations",
  },
  {
    id: "emergency-contacts",
    label: "EMERGENCY CONTACTS",
    icon: Phone,
    path: "/hotel/emergency-contacts",
  },
  {
    id: "third-party-management",
    label: "THIRD PARTY MANAGEMENT",
    icon: Building2,
    path: "/hotel/third-party-management",
  },
  {
    id: "ai-support",
    label: "AI SUPPORT",
    icon: Bot,
    path: "/hotel/ai-support",
  },
  {
    id: "settings",
    label: "SETTINGS",
    icon: Settings,
    path: "/hotel/settings",
  },
];
