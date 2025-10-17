import { useState, useMemo } from "react";
import { MessageCircle, Users2 } from "lucide-react";
import {
  PageContainer,
  PageHeader,
  Tabs,
  type Tab,
} from "../../components/common";
import { ChatInterface } from "../../components/chat";
import { StaffChatInterface } from "../../components/chat/StaffChatInterface";
import { useHotel } from "../../contexts/HotelContext";
import {
  useGuestConversations,
  useHotelChatIntegration,
} from "../../hooks/queries/hotel-management/guest-conversations";
import {
  useStaffConversations,
  useHotelStaffMembers,
} from "../../hooks/queries/chat/useStaffChatQueries";
import {
  transformStaffConversations,
  transformStaffMembersToConversations,
} from "../../utils/transforms/staffChat.transforms";
import { useAuth } from "../../hooks/auth/useAuth";
import type { Conversation } from "../../types";

export const ChatManagementPage = () => {
  const [activeTab, setActiveTab] = useState("guest-communication");
  const { currentHotel } = useHotel();
  const { user } = useAuth();
  const hotelId = currentHotel?.id || "";
  const staffProfileId = user?.id || "";

  // Fetch guest conversations from database
  const { data: guestConversationsData = [], isLoading: isLoadingGuests } =
    useGuestConversations(hotelId);

  // Fetch staff conversations
  const { data: staffConversationsData = [], isLoading: isLoadingStaff } =
    useStaffConversations();

  // Fetch all hotel staff members for the sidebar
  const { data: hotelStaffData = [], isLoading: isLoadingHotelStaff } =
    useHotelStaffMembers();

  // Transform staff conversations and hotel staff members
  const staffConversations: Conversation[] = useMemo(() => {
    console.log("🔄 Preparing staff chat data:", {
      conversationsCount: staffConversationsData?.length,
      staffMembersCount: hotelStaffData?.length,
      conversationsData: staffConversationsData,
      staffData: hotelStaffData,
    });

    // Transform existing conversations
    const existingConversations = transformStaffConversations(
      staffConversationsData || []
    );
    console.log("📝 Existing conversations:", existingConversations);

    // Extract staff IDs from existing conversations
    const staffIdsInConversations = new Set(
      existingConversations
        .map((conv) => conv.staffId)
        .filter((id): id is string => !!id)
    );
    console.log(
      "👤 Staff IDs already in conversations:",
      Array.from(staffIdsInConversations)
    );

    // Transform staff members into potential conversations
    const staffMemberConversations = transformStaffMembersToConversations(
      hotelStaffData || []
    );
    console.log("👥 Staff member conversations:", staffMemberConversations);

    // Filter out staff members who already have conversations
    // Use staffId for comparison
    const newStaffContacts = staffMemberConversations.filter(
      (staff) => !staffIdsInConversations.has(staff.staffId || staff.id)
    );
    console.log("🆕 New staff contacts (filtered):", newStaffContacts);

    // Merge and convert to Conversation type
    // IMPORTANT: For staff chat, we need to use staffId as the identifier
    // This allows us to create conversations using the correct hotel_staff.id
    const allContacts = [...existingConversations, ...newStaffContacts].map(
      (contact) => ({
        id: contact.staffId || contact.id, // Use staffId for identification (hotel_staff.id)
        conversationId: contact.conversationId, // Store actual conversation ID if exists
        name: contact.staffName,
        avatar: contact.staffAvatar
          ? contact.staffAvatar
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              contact.staffName
            )}&background=random`,
        lastMessage: contact.lastMessage || "Start a conversation",
        timestamp: contact.lastMessageAt || contact.createdAt,
        unreadCount: 0,
        status: "online" as const,
        type: "staff" as const,
        messages: [],
        isExistingConversation: contact.isExistingConversation, // Flag to know if conversation exists
      })
    );

    console.log("✅ Total staff contacts:", allContacts.length, allContacts);
    return allContacts;
  }, [staffConversationsData, hotelStaffData]);

  // Transform guest conversations to match ChatInterface format
  const guestConversations: Conversation[] = useMemo(() => {
    return guestConversationsData.map((conv) => {
      const guestData = Array.isArray(conv.guests)
        ? conv.guests[0]
        : conv.guests;
      const personalData = Array.isArray(guestData?.guest_personal_data)
        ? guestData?.guest_personal_data[0]
        : guestData?.guest_personal_data;

      return {
        id: conv.id,
        name:
          personalData?.first_name && personalData?.last_name
            ? `${personalData.first_name} ${personalData.last_name}`
            : guestData?.guest_name || "Unknown Guest",
        avatar: personalData?.first_name
          ? `https://ui-avatars.com/api/?name=${personalData.first_name}+${
              personalData.last_name || ""
            }&background=random`
          : undefined,
        lastMessage: conv.subject || "No messages yet",
        timestamp: new Date(conv.last_message_at),
        unreadCount: 0,
        status: conv.status === "active" ? "online" : "offline",
        type: "guest" as const,
        messages: [],
        guestId: conv.guest_id, // Add guest_id for translation
        roomNumber: guestData?.room_number || undefined, // Add room number
      };
    });
  }, [guestConversationsData]);

  // Use the hotel chat integration hook for guest conversations
  // This handles real-time messages, translation, and database sync
  const guestChatHook = useHotelChatIntegration({
    conversations: guestConversations,
    hotelId,
    staffProfileId,
  });

  const tabs: Tab[] = [
    {
      id: "guest-communication",
      label: "Guest Communication",
      icon: MessageCircle,
      content: (
        <div className="h-[calc(100vh-200px)] min-h-[600px] border border-gray-200 rounded-lg overflow-hidden">
          {isLoadingGuests ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading conversations...</div>
            </div>
          ) : (
            <ChatInterface
              conversations={guestChatHook.conversations}
              chatType="guest"
              customChatHook={guestChatHook}
            />
          )}
        </div>
      ),
    },
    {
      id: "staff-communication",
      label: "Staff Communication",
      icon: Users2,
      content: (
        <div className="h-[calc(100vh-200px)] min-h-[600px] border border-gray-200 rounded-lg overflow-hidden">
          {isLoadingStaff || isLoadingHotelStaff ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading staff members...</div>
            </div>
          ) : (
            <StaffChatInterface
              conversations={staffConversations}
              chatType="staff"
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader title="Chat Management" />
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </PageContainer>
  );
};
