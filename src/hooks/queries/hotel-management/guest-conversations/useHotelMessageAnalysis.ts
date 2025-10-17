/**
 * Hotel Message Analysis Hook
 *
 * Handles translation for hotel staff sending messages to guests
 * - Fetches guest language from guest_personal_data
 * - Fetches hotel languages from hotels.official_languages
 * - Translates hotel messages to guest's language if needed
 */

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import {
  translateMessage,
  shouldTranslate,
} from "../../../../services/openaiAnalyzer.service";

interface UseHotelMessageAnalysisProps {
  hotelId: string | null;
  guestId: string | null;
}

interface UseHotelMessageAnalysisReturn {
  guestLanguage: string | null;
  hotelLanguages: string[] | null;
  isLoading: boolean;
  translateOutgoingMessage: (
    text: string,
    messageId?: string
  ) => Promise<{
    translatedText: string;
    wasTranslated: boolean;
    targetLanguage: string | null;
  }>;
}

export const useHotelMessageAnalysis = ({
  hotelId,
  guestId,
}: UseHotelMessageAnalysisProps): UseHotelMessageAnalysisReturn => {
  const [guestLanguage, setGuestLanguage] = useState<string | null>(null);
  const [hotelLanguages, setHotelLanguages] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch guest language and hotel languages
  useEffect(() => {
    const fetchLanguages = async () => {
      if (!hotelId || !guestId) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch guest language
        const { data: guestData, error: guestError } = await supabase
          .from("guest_personal_data")
          .select("language")
          .eq("guest_id", guestId)
          .maybeSingle();

        if (guestError) {
          console.error(
            "❌ [Hotel Chat] Failed to fetch guest language:",
            guestError
          );
        } else {
          console.log("✅ [Hotel Chat] Guest language:", guestData?.language);
          setGuestLanguage(guestData?.language || null);
        }

        // Fetch hotel languages
        const { data: hotelData, error: hotelError } = await supabase
          .from("hotels")
          .select("official_languages")
          .eq("id", hotelId)
          .single();

        if (hotelError) {
          console.error(
            "❌ [Hotel Chat] Failed to fetch hotel languages:",
            hotelError
          );
        } else {
          console.log(
            "✅ [Hotel Chat] Hotel languages:",
            hotelData?.official_languages
          );
          setHotelLanguages(hotelData?.official_languages || null);
        }
      } catch (error) {
        console.error("❌ [Hotel Chat] Error fetching languages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, [hotelId, guestId]);

  /**
   * Translates outgoing hotel message to guest's language if needed
   */
  const translateOutgoingMessage = async (
    text: string,
    messageId?: string
  ): Promise<{
    translatedText: string;
    wasTranslated: boolean;
    targetLanguage: string | null;
  }> => {
    console.log("🔍 [Hotel Chat] Translation check:", {
      guestLanguage,
      hotelLanguages,
      text: text.substring(0, 50),
    });

    // Check if translation is needed
    const needsTranslation = shouldTranslate(guestLanguage, hotelLanguages);

    console.log("🔍 [Hotel Chat] Needs translation:", needsTranslation);

    if (!needsTranslation || !guestLanguage) {
      return {
        translatedText: text,
        wasTranslated: false,
        targetLanguage: null,
      };
    }

    try {
      // Get the primary hotel language as source
      const sourceLanguage =
        hotelLanguages && hotelLanguages.length > 0 ? hotelLanguages[0] : "en";

      console.log("🌐 [Hotel Chat] Translating:", {
        from: sourceLanguage,
        to: guestLanguage,
        text: text.substring(0, 50),
      });

      // Translate to guest's language
      const translatedText = await translateMessage(
        text,
        sourceLanguage,
        guestLanguage,
        messageId
      );

      console.log("✅ [Hotel Chat] Translation complete:", {
        original: text.substring(0, 50),
        translated: translatedText.substring(0, 50),
      });

      return {
        translatedText,
        wasTranslated: true,
        targetLanguage: guestLanguage,
      };
    } catch (error) {
      console.error("❌ [Hotel Chat] Translation failed:", error);
      // Return original text if translation fails
      return {
        translatedText: text,
        wasTranslated: false,
        targetLanguage: null,
      };
    }
  };

  return {
    guestLanguage,
    hotelLanguages,
    isLoading,
    translateOutgoingMessage,
  };
};
