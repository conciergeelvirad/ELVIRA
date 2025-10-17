import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

// ===================================================
// QUERY KEYS
// ===================================================
export const staffChatKeys = {
  all: ["staff-chat"] as const,
  conversations: () => [...staffChatKeys.all, "conversations"] as const,
  conversation: (id: string) => [...staffChatKeys.conversations(), id] as const,
  messages: (conversationId: string) =>
    [...staffChatKeys.conversation(conversationId), "messages"] as const,
  hotelStaff: () => [...staffChatKeys.all, "hotel-staff"] as const,
};

// ===================================================
// TYPES
// ===================================================

export interface StaffPersonalData {
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
}

export interface StaffMember {
  id: string;
  employee_id: string;
  position: string;
  hotel_staff_personal_data: StaffPersonalData | null;
}

export interface StaffConversation {
  id: string;
  hotel_id: string;
  is_group: boolean;
  title: string | null;
  created_by: string;
  created_at: string;
  last_message_id: string | null;
  last_message_at: string | null;
  staff?: StaffMember;
}

export interface StaffMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  file_url: string | null;
  voice_url: string | null;
  created_at: string;
  deleted_at: string | null;
  sender?: {
    id: string;
    hotel_staff_personal_data: {
      first_name: string;
      last_name: string;
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConversationParticipant = any;

// ===================================================
// QUERIES
// ===================================================

/**
 * Fetch all staff conversations for the logged-in user.
 */
export const useStaffConversations = () => {
  return useQuery({
    queryKey: staffChatKeys.conversations(),
    queryFn: async (): Promise<StaffConversation[]> => {
      try {
        console.log("🔹 Fetching staff conversations...");

        // Get current session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!sessionData.session) throw new Error("No authenticated session");

        const userId = sessionData.session.user.id;

        // Get user's hotel_id
        const { data: staffData, error: staffError } = await supabase
          .from("hotel_staff")
          .select("hotel_id")
          .eq("id", userId)
          .single();

        if (staffError) throw staffError;
        const hotelId = staffData.hotel_id;
        console.log("🏨 Hotel ID:", hotelId);

        // Fetch conversations where the user is a participant
        const { data: participants, error: participantsError } = await supabase
          .from("staff_conversation_participants")
          .select(
            `
            conversation_id,
            staff_conversations (
              id,
              hotel_id,
              is_group,
              title,
              created_by,
              created_at,
              last_message_id,
              last_message_at
            )
          `
          )
          .eq("staff_id", userId);

        if (participantsError) throw participantsError;
        if (!participants || participants.length === 0) {
          console.log("No conversations found for this user");
          return [];
        }

        console.log("✅ Raw conversations data:", participants);

        // For each conversation, get the OTHER participant(s)
        const conversations = await Promise.all(
          participants.map(async (participant: ConversationParticipant) => {
            const conversation = participant.staff_conversations;
            if (!conversation) return null;

            // Get other participants in this conversation
            // First get the staff_id from participants table
            const { data: participants, error: participantsError } =
              await supabase
                .from("staff_conversation_participants")
                .select("staff_id")
                .eq("conversation_id", conversation.id)
                .neq("staff_id", userId);

            if (participantsError) {
              console.error("Error fetching participants:", participantsError);
              return null;
            }

            if (!participants || participants.length === 0) {
              return { ...conversation, staff: null };
            }

            // Get the personal data for the other participant
            const otherStaffId = participants[0].staff_id;
            const { data: personalDataRecord, error: personalDataError } =
              await supabase
                .from("hotel_staff_personal_data")
                .select(
                  `
                  first_name,
                  last_name,
                  email,
                  avatar_url,
                  staff_id,
                  hotel_staff:staff_id (
                    id,
                    employee_id,
                    position
                  )
                `
                )
                .eq("staff_id", otherStaffId)
                .single();

            if (personalDataError || !personalDataRecord) {
              console.error("Error fetching personal data:", personalDataError);
              return { ...conversation, staff: null };
            }

            // Extract staff data
            const staffData = Array.isArray(personalDataRecord.hotel_staff)
              ? personalDataRecord.hotel_staff[0]
              : personalDataRecord.hotel_staff;

            if (!personalDataRecord.staff_id) {
              return { ...conversation, staff: null };
            }

            // IMPORTANT: Use staff_id from personal_data (this is the auth user ID)
            // auth.users.id = hotel_staff.id = hotel_staff_personal_data.staff_id
            return {
              ...conversation,
              staff: {
                id: personalDataRecord.staff_id, // Use staff_id (auth user ID)
                employee_id: staffData?.employee_id,
                position: staffData?.position,
                hotel_staff_personal_data: {
                  first_name: personalDataRecord.first_name,
                  last_name: personalDataRecord.last_name,
                  email: personalDataRecord.email,
                  avatar_url: personalDataRecord.avatar_url,
                },
              },
            };
          })
        );

        // Filter out nulls and sort by last message time
        const validConversations = conversations
          .filter((conv) => conv !== null && conv.staff !== null)
          .sort((a, b) => {
            if (!a || !b) return 0;
            const timeA = a.last_message_at
              ? new Date(a.last_message_at).getTime()
              : 0;
            const timeB = b.last_message_at
              ? new Date(b.last_message_at).getTime()
              : 0;
            return timeB - timeA; // Most recent first
          }) as StaffConversation[];

        console.log("✅ Processed conversations:", validConversations);
        return validConversations;
      } catch (error) {
        console.error("❌ Error in useStaffConversations:", error);
        return [];
      }
    },
  });
};

/**
 * Fetch all hotel staff members (for listing available contacts to chat with).
 */
export const useHotelStaffMembers = () => {
  return useQuery({
    queryKey: staffChatKeys.hotelStaff(),
    queryFn: async (): Promise<StaffMember[]> => {
      try {
        console.log("🔹 Fetching hotel staff members...");

        // Get current session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!sessionData.session) throw new Error("No authenticated session");

        const userId = sessionData.session.user.id;
        console.log("👤 Current user ID:", userId);

        // Get user's hotel_id
        const { data: currentStaffData, error: staffError } = await supabase
          .from("hotel_staff")
          .select("hotel_id")
          .eq("id", userId)
          .single();

        if (staffError) {
          console.error("❌ Error fetching current staff:", staffError);
          throw staffError;
        }
        const hotelId = currentStaffData.hotel_id;
        console.log("🏨 Current hotel ID:", hotelId);

        // Fetch all staff members in the same hotel (excluding current user)
        // Query hotel_staff_personal_data which has staff_id reference to hotel_staff
        console.log("📋 Querying hotel_staff_personal_data...");
        const { data: hotelStaff, error: hotelStaffError } = await supabase
          .from("hotel_staff_personal_data")
          .select(
            `
            first_name,
            last_name,
            email,
            avatar_url,
            staff_id,
            hotel_staff:staff_id (
              id,
              employee_id,
              position,
              hotel_id,
              status
            )
          `
          )
          .eq("hotel_staff.hotel_id", hotelId)
          .neq("staff_id", userId) // Exclude current user
          .eq("hotel_staff.status", "active"); // Only active staff

        console.log("📊 Query result:", {
          hasError: !!hotelStaffError,
          error: hotelStaffError,
          dataLength: hotelStaff?.length,
          data: hotelStaff,
        });

        if (hotelStaffError) {
          console.error("❌ Error fetching hotel staff:", hotelStaffError);
          throw hotelStaffError;
        }
        if (!hotelStaff || hotelStaff.length === 0) {
          console.log("No staff members found for this hotel");
          return [];
        }

        console.log("✅ Raw hotel staff data:", hotelStaff);

        // Transform and filter valid staff members
        // The data structure is now: { first_name, last_name, email, avatar_url, staff_id, hotel_staff: {...} }
        const validStaff = hotelStaff
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((record: any) => {
            console.log("🔍 Processing record:", record);

            const staffData = Array.isArray(record.hotel_staff)
              ? record.hotel_staff[0]
              : record.hotel_staff;

            console.log("🔍 Staff data extracted:", staffData);
            console.log(
              "🔍 Record staff_id (from personal_data):",
              record.staff_id
            );

            if (!record.staff_id) {
              console.warn("⚠️ Invalid staff_id, skipping:", record);
              return null;
            }

            // IMPORTANT: Use record.staff_id which is the auth user ID
            // This equals: auth.users.id = hotel_staff.id = hotel_staff_personal_data.staff_id
            const result = {
              id: record.staff_id, // Use staff_id from personal_data (this is the auth user ID)
              employee_id: staffData?.employee_id,
              position: staffData?.position,
              hotel_staff_personal_data: {
                first_name: record.first_name,
                last_name: record.last_name,
                email: record.email,
                avatar_url: record.avatar_url,
              },
            };

            console.log("✅ Processed staff member:", result);
            return result;
          })
          .filter((staff) => staff !== null); // Filter out invalid records

        console.log("✅ Final processed hotel staff:", validStaff);
        return validStaff;
      } catch (error) {
        console.error("❌ Error in useHotelStaffMembers:", error);
        return [];
      }
    },
  });
};

/**
 * Fetch messages for a specific conversation.
 */
export const useStaffConversationMessages = (
  conversationId: string | undefined
) => {
  return useQuery({
    queryKey: staffChatKeys.messages(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from("staff_messages")
        .select(
          `
          *,
          sender:hotel_staff(
            id,
            hotel_staff_personal_data(
              first_name,
              last_name
            )
          )
        `
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as StaffMessage[];
    },
    enabled: !!conversationId,
  });
};

// ===================================================
// MUTATIONS
// ===================================================

/**
 * Send a new staff message.
 */
export const useSendStaffMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("No authenticated session");

      const { data, error } = await supabase
        .from("staff_messages")
        .insert({
          conversation_id: conversationId,
          sender_id: sessionData.session.user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: staffChatKeys.messages(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: staffChatKeys.conversations(),
      });
    },
  });
};

/**
 * Create a new conversation between two staff members.
 */
export const useCreateStaffConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ participantId }: { participantId: string }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("No authenticated session");

      const userId = sessionData.session.user.id;

      console.log(
        "🔹 Creating conversation between:",
        userId,
        "and",
        participantId
      );
      console.log("🔍 Current user ID type:", typeof userId, userId);
      console.log(
        "🔍 Participant ID type:",
        typeof participantId,
        participantId
      );

      // Verify both IDs exist in hotel_staff table
      const { data: userCheck, error: userCheckError } = await supabase
        .from("hotel_staff")
        .select("id, employee_id")
        .eq("id", userId)
        .single();

      console.log("👤 User check in hotel_staff:", userCheck, userCheckError);

      const { data: participantCheck, error: participantCheckError } =
        await supabase
          .from("hotel_staff")
          .select("id, employee_id")
          .eq("id", participantId)
          .single();

      console.log(
        "👥 Participant check in hotel_staff:",
        participantCheck,
        participantCheckError
      );

      if (participantCheckError) {
        console.error("❌ Participant ID does not exist in hotel_staff table!");
        console.error(
          "❌ This means we're passing the wrong ID. Expected hotel_staff.id but got:",
          participantId
        );
        throw new Error(
          `Participant ID ${participantId} not found in hotel_staff table. This ID might be from hotel_staff_personal_data instead.`
        );
      }

      // Get current user's hotel_id from hotel_staff table
      const { data: currentHotelStaff, error: hotelStaffError } = await supabase
        .from("hotel_staff")
        .select("hotel_id")
        .eq("id", userId)
        .single();

      if (hotelStaffError) {
        console.error(
          "❌ Error fetching current hotel staff:",
          hotelStaffError
        );
        throw hotelStaffError;
      }

      console.log("👤 Current hotel staff data:", currentHotelStaff);

      const hotelId = currentHotelStaff.hotel_id;

      // Create the conversation
      const { data: conversation, error: convError } = await supabase
        .from("staff_conversations")
        .insert({
          hotel_id: hotelId,
          created_by: userId,
        })
        .select()
        .single();

      if (convError) {
        console.error("❌ Error creating conversation:", convError);
        throw convError;
      }

      console.log("💬 Conversation created:", conversation);

      // Add both participants using hotel_staff IDs (not personal_data IDs!)
      console.log("➕ Inserting participants:", [
        { conversation_id: conversation.id, staff_id: userId },
        { conversation_id: conversation.id, staff_id: participantId },
      ]);

      const { error: partError } = await supabase
        .from("staff_conversation_participants")
        .insert([
          { conversation_id: conversation.id, staff_id: userId },
          { conversation_id: conversation.id, staff_id: participantId },
        ]);

      if (partError) {
        console.error("❌ Error adding participants:", partError);
        throw partError;
      }

      console.log("✅ Participants added successfully");

      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffChatKeys.conversations(),
      });
    },
  });
};
