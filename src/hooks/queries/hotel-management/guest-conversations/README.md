# Guest Conversations Module

This module manages guest conversations and messages for hotel-guest communication.

## 📁 Structure

```
guest-conversations/
├── guestConversation.types.ts          # Type definitions
├── guestConversation.constants.ts      # Query keys and constants
├── guestConversation.transformers.ts   # Data transformation utilities
├── useGuestConversationQueries.ts      # Query and mutation hooks
├── index.ts                            # Barrel exports
└── README.md                           # This file
```

## 📦 Exports

### Types

- `GuestConversation` - Base conversation type from database
- `GuestMessage` - Base message type from database
- `GuestConversationInsert` - Type for creating conversations
- `GuestMessageInsert` - Type for creating messages
- `GuestConversationUpdate` - Type for updating conversations
- `GuestMessageUpdate` - Type for updating messages
- `ConversationWithGuest` - Extended type with guest and staff details
- `MessageWithDetails` - Extended type with sender details
- `SenderType` - Literal type: `"guest" | "staff"`
- `ConversationStatus` - Literal type: `"open" | "closed" | "pending"`

### Constants

- `conversationKeys` - Query key factory for React Query cache management
- `CONVERSATION_WITH_GUEST_SELECT` - Supabase select with joins
- `MESSAGE_WITH_DETAILS_SELECT` - Supabase select with joins
- `CONVERSATION_SIMPLE_SELECT` - Basic select pattern
- `MESSAGE_SIMPLE_SELECT` - Basic select pattern

### Conversation Transformers

- `getGuestFullName()` - Extract guest's full name
- `getAssignedStaffName()` - Extract assigned staff name
- `getGuestRoomNumber()` - Get guest room number
- `hasUnreadMessages()` - Check if conversation has unread messages
- `sortByLastMessage()` - Sort by last message time
- `filterByStatus()` - Filter by conversation status
- `filterUnreadConversations()` - Get conversations with unread messages
- `searchConversations()` - Search by guest name/room/staff

### Message Transformers

- `getMessageSenderName()` - Get sender display name
- `isGuestMessage()` - Check if message is from guest
- `isMessageUnread()` - Check if message is unread
- `filterMessagesBySender()` - Filter by sender type
- `getUnreadMessages()` - Get unread messages from list
- `countUnreadMessages()` - Count unread messages
- `groupMessagesByDate()` - Group messages by date
- `formatMessageTime()` - Format message timestamp
- `formatLastMessageTime()` - Format with relative time

### Conversation Query Hooks

- `useGuestConversations()` - Get all conversations for a hotel
- `useConversationById()` - Get single conversation with details
- `useConversationByGuest()` - Get conversation for specific guest

### Message Query Hooks

- `useConversationMessages()` - Get all messages in a conversation
- `useUnreadMessagesCount()` - Get unread message count

### Conversation Mutation Hooks

- `useCreateConversation()` - Create new conversation
- `useUpdateConversation()` - Update conversation details
- `useDeleteConversation()` - Delete conversation

### Message Mutation Hooks

- `useSendMessage()` - Send a message
- `useMarkMessagesAsRead()` - Mark messages as read
- `useUpdateMessage()` - Update message content
- `useDeleteMessage()` - Delete a message

## 🎯 Usage Examples

### Display All Conversations

```tsx
import {
  useGuestConversations,
  formatLastMessageTime,
} from "./guest-conversations";

function ConversationsList() {
  const { data: conversations, isLoading } = useGuestConversations(hotelId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {conversations?.map((conv) => (
        <div key={conv.id}>
          <h3>{conv.guests?.guest_name}</h3>
          <p>Room: {conv.guests?.room_number}</p>
          <span>{formatLastMessageTime(conv)}</span>
        </div>
      ))}
    </div>
  );
}
```

### Show Conversation Messages

```tsx
import {
  useConversationMessages,
  groupMessagesByDate,
} from "./guest-conversations";

function ChatView({ conversationId }: { conversationId: string }) {
  const { data: messages } = useConversationMessages(conversationId);

  const groupedMessages = messages ? groupMessagesByDate(messages) : {};

  return (
    <div>
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          <h4>{date}</h4>
          {msgs.map((msg) => (
            <div key={msg.id}>
              <strong>
                {msg.sender_type === "guest" ? "Guest" : "Staff"}:
              </strong>
              <p>{msg.message_text}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Send a Message

```tsx
import { useSendMessage } from "./guest-conversations";

function SendMessageForm({
  conversationId,
  hotelId,
}: {
  conversationId: string;
  hotelId: string;
}) {
  const [message, setMessage] = useState("");
  const sendMutation = useSendMessage();

  const handleSend = () => {
    sendMutation.mutate({
      conversation_id: conversationId,
      hotel_id: hotelId,
      message_text: message,
      sender_type: "staff",
      created_by: userId,
    });
    setMessage("");
  };

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

### Create New Conversation

```tsx
import { useCreateConversation } from "./guest-conversations";

function StartConversation({
  guestId,
  hotelId,
}: {
  guestId: string;
  hotelId: string;
}) {
  const createMutation = useCreateConversation();

  const handleStart = () => {
    createMutation.mutate({
      guest_id: guestId,
      hotel_id: hotelId,
      status: "open",
      assigned_staff_id: staffId,
    });
  };

  return <button onClick={handleStart}>Start Conversation</button>;
}
```

### Mark Messages as Read

```tsx
import {
  useMarkMessagesAsRead,
  getUnreadMessages,
} from "./guest-conversations";

function MarkAsReadButton({
  messages,
  conversationId,
}: {
  messages: GuestMessage[];
  conversationId: string;
}) {
  const markReadMutation = useMarkMessagesAsRead();
  const unreadMessages = getUnreadMessages(messages);

  const handleMarkRead = () => {
    markReadMutation.mutate({
      messageIds: unreadMessages.map((msg) => msg.id),
      conversationId,
    });
  };

  if (unreadMessages.length === 0) return null;

  return (
    <button onClick={handleMarkRead}>
      Mark {unreadMessages.length} as read
    </button>
  );
}
```

### Display Unread Count

```tsx
import { useUnreadMessagesCount } from "./guest-conversations";

function UnreadBadge({ conversationId }: { conversationId: string }) {
  const { data: unreadCount } = useUnreadMessagesCount(conversationId);

  if (!unreadCount || unreadCount === 0) return null;

  return <span className="badge">{unreadCount}</span>;
}
```

### Search Conversations

```tsx
import {
  useGuestConversations,
  searchConversations,
  useDebouncedValue,
} from "../../hooks";

function SearchableConversations() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data: conversations } = useGuestConversations(hotelId);

  const filteredConversations = conversations
    ? searchConversations(conversations, debouncedSearch)
    : [];

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search conversations..."
      />
      {filteredConversations.map((conv) => (
        <div key={conv.id}>{/* Render conversation */}</div>
      ))}
    </div>
  );
}
```

### Filter Unread Conversations

```tsx
import {
  useGuestConversations,
  filterUnreadConversations,
  sortByLastMessage,
} from "./guest-conversations";

function UnreadConversations() {
  const { data: conversations } = useGuestConversations(hotelId);

  const unreadConversations = conversations
    ? filterUnreadConversations(conversations)
    : [];

  const sortedUnread = sortByLastMessage(unreadConversations);

  return (
    <div>
      <h3>Unread Conversations ({unreadConversations.length})</h3>
      {sortedUnread.map((conv) => (
        <div key={conv.id}>{/* Render conversation */}</div>
      ))}
    </div>
  );
}
```

### Get Conversation by Guest

```tsx
import { useConversationByGuest } from "./guest-conversations";

function GuestConversation({ guestId }: { guestId: string }) {
  const { data: conversation } = useConversationByGuest(guestId, hotelId);

  if (!conversation) {
    return <div>No conversation found</div>;
  }

  return (
    <div>
      <h2>Chat with {conversation.guests?.guest_name}</h2>
      {/* Display conversation */}
    </div>
  );
}
```

### Update Conversation Status

```tsx
import { useUpdateConversation } from "./guest-conversations";

function CloseConversation({
  conversationId,
  hotelId,
}: {
  conversationId: string;
  hotelId: string;
}) {
  const updateMutation = useUpdateConversation();

  const handleClose = () => {
    updateMutation.mutate({
      id: conversationId,
      hotelId,
      updates: {
        status: "closed",
      },
    });
  };

  return <button onClick={handleClose}>Close Conversation</button>;
}
```

### Filter Messages by Sender

```tsx
import {
  useConversationMessages,
  filterMessagesBySender,
} from "./guest-conversations";

function GuestMessagesOnly({ conversationId }: { conversationId: string }) {
  const { data: messages } = useConversationMessages(conversationId);

  const guestMessages = messages
    ? filterMessagesBySender(messages, "guest")
    : [];

  return (
    <div>
      <h3>Messages from Guest</h3>
      {guestMessages.map((msg) => (
        <p key={msg.id}>{msg.message_text}</p>
      ))}
    </div>
  );
}
```

## 🔄 Real-time Subscriptions

For real-time message updates:

```tsx
import { useTableSubscription } from "../../../hooks";
import {
  useConversationMessages,
  conversationKeys,
} from "./guest-conversations";

function RealtimeChat({ conversationId }: { conversationId: string }) {
  const { data: messages } = useConversationMessages(conversationId);

  // Subscribe to new messages
  useTableSubscription({
    table: "guest_messages",
    filter: `conversation_id=eq.${conversationId}`,
    queryKeysToInvalidate: [conversationKeys.messages(conversationId)],
  });

  return <div>{/* Render messages */}</div>;
}
```

## 🎨 UI/UX Patterns

### Optimistic Message Sending (Coming Soon)

```tsx
// Will be implemented in the next phase
const sendMutation = useSendMessage({
  optimisticUpdate: true,
});
```

### Auto-scroll to Latest Message

```tsx
import { useEffect, useRef } from "react";
import { useConversationMessages } from "./guest-conversations";

function AutoScrollChat({ conversationId }: { conversationId: string }) {
  const { data: messages } = useConversationMessages(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      {messages?.map((msg) => (
        <div key={msg.id}>{msg.message_text}</div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
```

## 📊 Query Key Structure

```typescript
conversationKeys = {
  all: ["guest-conversations"],
  lists: () => ["guest-conversations", "list"],
  list: (hotelId) => ["guest-conversations", "list", hotelId],
  details: () => ["guest-conversations", "detail"],
  detail: (id) => ["guest-conversations", "detail", id],
  byGuest: (guestId) => ["guest-conversations", "guest", guestId],
  messages: (conversationId) => [
    "guest-conversations",
    "messages",
    conversationId,
  ],
  unreadCount: (conversationId) => [
    "guest-conversations",
    "messages",
    conversationId,
    "unread",
  ],
};
```

## 🔍 Data Models

### GuestConversation

```typescript
{
  id: string;
  guest_id: string;
  hotel_id: string;
  status: string;
  assigned_staff_id: string | null;
  last_message_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}
```

### GuestMessage

```typescript
{
  id: string;
  conversation_id: string;
  hotel_id: string;
  sender_type: "guest" | "staff";
  message_text: string;
  is_read: boolean;
  created_by: string;
  created_at: string | null;
}
```

## ✅ Benefits of This Structure

1. **Separation of Concerns**: Conversations and messages logically organized
2. **Rich Transformers**: 17 utility functions for common operations
3. **Type Safety**: Full TypeScript coverage with proper typing
4. **Maintainability**: Easy to find conversation vs message logic
5. **Testability**: Each transformer can be tested independently
6. **Scalability**: Easy to add new features (attachments, reactions, etc.)
7. **Real-time Ready**: Designed for easy subscription integration

## 📈 Migration from Old Structure

**Before:**

```tsx
import { useGuestConversations } from "../useGuestConversationQueries";
```

**After:**

```tsx
import { useGuestConversations } from "./guest-conversations";
```

## 🚀 Next Steps

1. ✅ Types extracted and organized (conversations + messages)
2. ✅ Constants centralized
3. ✅ Transformers created (17 utility functions!)
4. ✅ Query hooks refactored (5 query hooks)
5. ✅ Mutation hooks with cache invalidation (7 mutation hooks)
6. ⏳ Add optimistic updates for messages (next phase)
7. ⏳ Add message attachments support
8. ⏳ Add typing indicators
9. ⏳ Integrate real-time subscriptions in chat UI

---

**Module Size:** ~380 lines (vs 511 original) - **26% reduction**
**Files:** 6 (types, constants, transformers, queries, index, README)
**TypeScript Errors:** 0 ✅
**Query Hooks:** 5 (conversations: 3, messages: 2)
**Mutation Hooks:** 7 (conversations: 3, messages: 4)
**Transformer Functions:** 17 (conversations: 8, messages: 9)
**Last Updated:** January 2025
