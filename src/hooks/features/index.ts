// Feature-specific hooks - Calendar, chat, and other domain-specific functionality
export { useCalendar } from "./useCalendar";
export { useChat } from "./useChat";

// Re-export types
export type {
  CalendarView,
  CalendarState,
  CalendarActions,
} from "./useCalendar";
