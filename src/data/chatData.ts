import { Conversation } from "../types";

export const sampleGuestConversations: Conversation[] = [
  {
    id: "guest-1",
    name: "Martin Paris",
    lastMessage: "Thank you for the quick response! 🙏✨",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unreadCount: 0,
    status: "online",
    type: "guest",
    messages: [
      {
        id: "msg-1",
        content: "Hi, I need help with my room booking 😊",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: "received",
        sender: { id: "guest-1", name: "Martin Paris" },
      },
      {
        id: "msg-2",
        content:
          "Hello Martin! I'd be happy to help you with your booking. What specific assistance do you need?",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        type: "sent",
        sender: { id: "hotel-staff", name: "You" },
      },
      {
        id: "msg-3",
        content: "I need to extend my stay by 2 more days 🏨",
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        type: "received",
        sender: { id: "guest-1", name: "Martin Paris" },
      },
      {
        id: "msg-4",
        content:
          "Let me check availability for you. Your current booking is for Room 301, correct?",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        type: "sent",
        sender: { id: "hotel-staff", name: "You" },
      },
      {
        id: "msg-5",
        content: "Yes, that's correct",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        type: "received",
        sender: { id: "guest-1", name: "Martin Paris" },
      },
      {
        id: "msg-6",
        content:
          "Great news! I can extend your stay for 2 more days. The rate will be the same. Would you like me to process this extension?",
        timestamp: new Date(Date.now() - 1000 * 60 * 8),
        type: "sent",
        sender: { id: "hotel-staff", name: "You" },
      },
      {
        id: "msg-7",
        content: "Thank you for the quick response! 🙏✨",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: "received",
        sender: { id: "guest-1", name: "Martin Paris" },
      },
    ],
  },
  {
    id: "guest-2",
    name: "Sarah Johnson",
    lastMessage: "When does the pool close?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 1,
    status: "away",
    type: "guest",
    messages: [
      {
        id: "msg-8",
        content: "When does the pool close?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        type: "received",
        sender: { id: "guest-2", name: "Sarah Johnson" },
      },
    ],
  },
  {
    id: "guest-3",
    name: "David Wilson",
    lastMessage: "Can I get extra towels?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    unreadCount: 2,
    status: "offline",
    type: "guest",
    messages: [
      {
        id: "msg-9",
        content: "Can I get extra towels?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        type: "received",
        sender: { id: "guest-3", name: "David Wilson" },
      },
      {
        id: "msg-10",
        content: "Also need more coffee pods",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        type: "received",
        sender: { id: "guest-3", name: "David Wilson" },
      },
    ],
  },
];

export const sampleStaffConversations: Conversation[] = [
  {
    id: "staff-1",
    name: "Front Desk Team",
    lastMessage: "Shift change at 3 PM",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    unreadCount: 0,
    status: "online",
    type: "staff",
    messages: [
      {
        id: "msg-staff-1",
        content: "Shift change at 3 PM",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        type: "received",
        sender: { id: "staff-1", name: "Front Desk Team" },
      },
    ],
  },
];
