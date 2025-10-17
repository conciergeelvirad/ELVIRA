/**
 * Guest Authentication Service
 *
 * Handles guest authentication using room_number and verification code.
 * Uses the guest-auth Edge Function which handles bcrypt verification.
 */

export interface GuestPersonalData {
  guest_email?: string | null;
  country?: string | null;
  language?: string | null;
}

export interface GuestData {
  id: string;
  room_number: string;
  guest_name: string;
  hotel_id: string;
  is_active: boolean;
  access_code_expires_at: string;
  dnd_status: boolean;
  guest_personal_data?: GuestPersonalData | GuestPersonalData[];
  verification_code?: string; // Store the verification code for display purposes
}

export interface HotelData {
  name: string;
  city?: string | null;
  country?: string | null;
  reception_phone?: string | null;
}

export interface GuestAuthResponse {
  success: boolean;
  token?: string;
  guestData?: GuestData;
  hotelData?: HotelData;
  error?: string;
}

/**
 * Authenticate a guest using room number and verification code
 * Calls the guest-auth Edge Function which handles bcrypt verification via verify_guest_code RPC
 *
 * @param roomNumber - The guest's room number
 * @param verificationCode - The plain text verification code
 * @returns Promise<GuestAuthResponse>
 */
export const authenticateGuest = async (
  roomNumber: string,
  verificationCode: string
): Promise<GuestAuthResponse> => {
  try {
    // Get the Supabase URL for the Edge Function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("❌ [Guest Auth] Supabase configuration not found");
      return {
        success: false,
        error: "Configuration error",
      };
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/guest-auth`;

    // Call the guest-auth Edge Function
    const response = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        roomNumber,
        verificationCode,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || "Authentication failed",
      };
    }

    // Add the verification code to guest data for display purposes
    const guestDataWithCode = {
      ...result.guestData,
      verification_code: verificationCode,
    };

    return {
      success: true,
      token: result.token,
      guestData: guestDataWithCode,
      hotelData: result.hotelData,
    };
  } catch (error) {
    console.error(
      "💥 [Guest Auth] Unexpected error during authentication:",
      error
    );
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
};

/**
 * Store guest session data in localStorage
 */
export const setGuestSession = (data: {
  token?: string;
  guestData?: GuestData;
  hotelData?: HotelData;
}) => {
  if (!data.guestData || !data.token) return;

  localStorage.setItem(
    "guest_session",
    JSON.stringify({
      token: data.token,
      guestData: data.guestData,
      hotelData: data.hotelData,
    })
  );
};

/**
 * Get guest session data from localStorage
 */
export const getGuestSession = (): {
  token?: string;
  guestData?: GuestData;
  hotelData?: HotelData;
} | null => {
  const session = localStorage.getItem("guest_session");
  if (!session) {
    return null;
  }

  try {
    const data = JSON.parse(session);
    return data;
  } catch (error) {
    console.error("❌ [Guest Auth] Error parsing guest session:", error);
    return null;
  }
};

/**
 * Clear guest session from localStorage
 */
export const clearGuestSession = () => {
  localStorage.removeItem("guest_session");
};
