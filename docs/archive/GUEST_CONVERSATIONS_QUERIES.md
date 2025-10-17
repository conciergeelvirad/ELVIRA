# Guest Conversations & Messages Query Hooks

**Created:** Current Session  
**Location:** `src/hooks/queries/hotel-management/useGuestConversationQueries.ts`

---

## 📋 Overview

Comprehensive React Query hooks for managing guest conversations and messages in the hotel management system. Handles real-time chat functionality between guests and hotel staff with support for translations, AI analysis, and message tracking.

### 🔗 Database Relationship Chain for Assigned Staff

```
guest_conversation.assigned_staff_id → hotel_staff_personal_data.staff_id → hotel_staff.id
```

The `assigned_staff_id` in the conversation references the `staff_id` in `hotel_staff_personal_data` table, which then connects to the `id` in the `hotel_staff` table. This allows for proper staff assignment and personal data retrieval.

---

## 🗂️ Types & Interfaces

### Base Types (from Database)

```typescript
export type GuestConversation = Tables<"guest_conversation">;
export type GuestMessage = Tables<"guest_messages">;
export type GuestConversationInsert = Insert<"guest_conversation">;
export type GuestMessageInsert = Insert<"guest_messages">;
export type GuestConversationUpdate = Update<"guest_conversation">;
export type GuestMessageUpdate = Update<"guest_messages">;
```

### Extended Types (with Joined Data)

**ConversationWithGuest**

```typescript
{
  ...GuestConversation,
  guests?: {
    id: string;
    guest_name: string;
    room_number: string;
    guest_personal_data?: {
      first_name: string;
      last_name: string;
      guest_email: string;
      phone_number: string;
    }[];
  };
  assigned_staff_data?: {
    staff_id: string;
    first_name: string;
    last_name: string;
    hotel_staff?: {
      id: string;
      employee_id: string;
      position: string;
      hotel_id: string;
    };
  };
  unread_count?: number;
  last_message?: GuestMessage;
}
```

**MessageWithDetails**

```typescript
{
  ...GuestMessage,
  guests?: {
    id: string;
    guest_name: string;
    room_number: string;
  };
  created_by_profile?: {
    id: string;
    email: string;
  };
}
```

---

## 🔑 Query Keys Structure

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
};
```

---

## 📚 Available Hooks

### Conversation Management

#### 1. `useGuestConversations(hotelId: string)`

**Purpose:** Fetch all conversations for a hotel  
**Returns:** Array of ConversationWithGuest  
**Includes:** Guest info, assigned staff, personal data  
**Sorted by:** `last_message_at` (descending)

```typescript
const { data: conversations, isLoading } = useGuestConversations(hotelId);
```

---

#### 2. `useConversationById(conversationId?: string)`

**Purpose:** Fetch a single conversation by ID  
**Returns:** ConversationWithGuest  
**Includes:** Guest info, assigned staff, personal data  
**Enabled:** Only when conversationId is provided

```typescript
const { data: conversation } = useConversationById(conversationId);
```

---

#### 3. `useConversationByGuest(guestId?: string, hotelId: string)`

**Purpose:** Get or find conversation for a specific guest  
**Returns:** ConversationWithGuest  
**Use case:** Opening chat for a specific guest  
**Enabled:** Only when guestId is provided

```typescript
const { data: conversation } = useConversationByGuest(guestId, hotelId);
```

---

#### 4. `useCreateConversation()`

**Purpose:** Create a new conversation  
**Invalidates:** Hotel conversations list, guest conversations

```typescript
const createConversation = useCreateConversation();

await createConversation.mutateAsync({
  guest_id: "guest-uuid",
  hotel_id: "hotel-uuid",
  subject: "Room Service Request",
  status: "active",
});
```

---

#### 5. `useUpdateConversation()`

**Purpose:** Update conversation details (subject, status, assigned staff)  
**Invalidates:** Conversation detail, hotel list, guest conversations

```typescript
const updateConversation = useUpdateConversation();

await updateConversation.mutateAsync({
  id: conversationId,
  hotelId: hotelId,
  updates: {
    status: "resolved",
    assigned_staff_id: staffId,
  },
});
```

---

#### 6. `useDeleteConversation()`

**Purpose:** Delete a conversation (cascades to messages)  
**Invalidates:** Hotel list, removes detail from cache, guest conversations

```typescript
const deleteConversation = useDeleteConversation();

await deleteConversation.mutateAsync({
  id: conversationId,
  hotelId: hotelId,
  guestId: guestId,
});
```

---

### Message Management

#### 7. `useConversationMessages(conversationId?: string)`

**Purpose:** Fetch all messages for a conversation  
**Returns:** Array of MessageWithDetails  
**Sorted by:** `created_at` (ascending - oldest first)  
**Includes:** Guest info, sender profile  
**Enabled:** Only when conversationId is provided

```typescript
const { data: messages } = useConversationMessages(conversationId);
```

---

#### 8. `useUnreadMessagesCount(conversationId?: string)`

**Purpose:** Get count of unread guest messages  
**Returns:** Number  
**Filters:** Only guest messages (`sender_type: "guest"`)  
**Use case:** Badge counts, notification indicators

```typescript
const { data: unreadCount } = useUnreadMessagesCount(conversationId);
```

---

#### 9. `useSendMessage()`

**Purpose:** Send a new message in a conversation  
**Invalidates:** Messages list, conversation detail, hotel conversations  
**Triggers:** AI analysis, translation, conversation timestamp update

```typescript
const sendMessage = useSendMessage();

await sendMessage.mutateAsync({
  conversation_id: conversationId,
  guest_id: guestId, // or null for staff
  hotel_id: hotelId,
  sender_type: "hotel_staff", // or "guest"
  message_text: "Hello, how can we help you?",
  created_by: staffProfileId, // for staff messages
});
```

---

#### 10. `useMarkMessagesAsRead()`

**Purpose:** Mark multiple messages as read  
**Invalidates:** Messages list  
**Use case:** Mark all unread when conversation opened

```typescript
const markAsRead = useMarkMessagesAsRead();

await markAsRead.mutateAsync({
  messageIds: ["msg-1", "msg-2"],
  conversationId: conversationId,
});
```

---

#### 11. `useUpdateMessage()`

**Purpose:** Update message details  
**Invalidates:** Messages list  
**Use case:** Admin edits, translations

```typescript
const updateMessage = useUpdateMessage();

await updateMessage.mutateAsync({
  id: messageId,
  conversationId: conversationId,
  updates: {
    is_read: true,
    staff_translation: "Translated text",
  },
});
```

---

#### 12. `useDeleteMessage()`

**Purpose:** Delete a specific message  
**Invalidates:** Messages list

```typescript
const deleteMessage = useDeleteMessage();

await deleteMessage.mutateAsync({
  id: messageId,
  conversationId: conversationId,
});
```

---

## 🔗 Database Relationships

### guest_conversation Table

- **guest_id** → guests.id (CASCADE delete)
- **hotel_id** → hotels.id (CASCADE delete)
- **assigned_staff_id** → profiles.id (SET NULL on delete)

### guest_messages Table

- **conversation_id** → guest_conversation.id (CASCADE delete)
- **guest_id** → guests.id (CASCADE delete)
- **hotel_id** → hotels.id (CASCADE delete)
- **created_by** → profiles.id (SET NULL on delete)

---

## 🎯 Key Features

### Conversation Features

- ✅ List all conversations by hotel
- ✅ View single conversation with full details
- ✅ Find conversation by guest
- ✅ Create new conversations
- ✅ Update conversation status & assignment
- ✅ Delete conversations (cascades to messages)
- ✅ Track last message timestamp
- ✅ Support for conversation subjects

### Message Features

- ✅ Chronological message history
- ✅ Unread message counting
- ✅ Send messages (guest or staff)
- ✅ Mark messages as read (bulk or single)
- ✅ Update message details
- ✅ Delete messages
- ✅ Sender type tracking (guest vs staff)

### AI & Translation Features (Database Triggers)

- ✅ Automatic AI analysis on new messages
- ✅ Automatic translation support
- ✅ Urgency detection
- ✅ Sentiment analysis
- ✅ Topic extraction
- ✅ Priority scoring
- ✅ Multi-language support

---

## 💡 Usage Examples

### Opening a Chat for a Guest

```typescript
// 1. Get or find conversation
const { data: conversation } = useConversationByGuest(guestId, hotelId);

// 2. If no conversation exists, create one
const createConversation = useCreateConversation();
if (!conversation) {
  await createConversation.mutateAsync({
    guest_id: guestId,
    hotel_id: hotelId,
    subject: "Guest Communication",
  });
}

// 3. Load messages
const { data: messages } = useConversationMessages(conversation?.id);
```

### Sending a Message

```typescript
const sendMessage = useSendMessage();

// Staff sending message
await sendMessage.mutateAsync({
  conversation_id: conversationId,
  hotel_id: hotelId,
  sender_type: "hotel_staff",
  message_text: messageText,
  created_by: currentStaffProfileId,
});

// Guest sending message (from guest app)
await sendMessage.mutateAsync({
  conversation_id: conversationId,
  guest_id: guestId,
  hotel_id: hotelId,
  sender_type: "guest",
  message_text: messageText,
});
```

### Displaying Unread Count Badge

```typescript
const { data: conversations } = useGuestConversations(hotelId);

{
  conversations?.map((conv) => {
    const { data: unreadCount } = useUnreadMessagesCount(conv.id);

    return (
      <ConversationItem
        conversation={conv}
        unreadBadge={unreadCount > 0 ? unreadCount : null}
      />
    );
  });
}
```

### Assigning Staff to Conversation

```typescript
const updateConversation = useUpdateConversation();

await updateConversation.mutateAsync({
  id: conversationId,
  hotelId: hotelId,
  updates: {
    assigned_staff_id: selectedStaffId,
    status: "assigned",
  },
});
```

---

## 🔔 Real-time Updates (Future Enhancement)

Consider adding Supabase real-time subscriptions for:

- New messages in active conversations
- Conversation status changes
- Unread count updates

```typescript
// Example real-time subscription
useEffect(() => {
  const subscription = supabase
    .channel("messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "guest_messages" },
      (payload) => {
        queryClient.invalidateQueries(
          conversationKeys.messages(conversationId)
        );
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, [conversationId]);
```

---

## 📝 Notes

- All hooks follow the same pattern as other hotel-management queries
- TypeScript types are fully inferred from Supabase schema
- Query keys support granular cache invalidation
- Mutations automatically update related queries
- Database triggers handle AI analysis and translations
- Conversation timestamp updates automatically on new messages

---

## 🎨 UI Integration Checklist

- [ ] Conversations list page with filters (status, assigned staff)
- [ ] Individual conversation/chat interface
- [ ] Message bubbles with sender identification
- [ ] Unread badges on conversation list
- [ ] Staff assignment dropdown
- [ ] Conversation status toggle
- [ ] Real-time message updates
- [ ] Translation display toggle
- [ ] Sentiment/urgency indicators
- [ ] Mark as read on scroll/open
- [ ] Guest info sidebar
- [ ] Message search/filter
