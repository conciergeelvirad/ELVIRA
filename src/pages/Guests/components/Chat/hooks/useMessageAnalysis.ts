/**
 * useMessageAnalysis Hook
 *
 * Handles automatic AI analysis and translation of guest messages
 * - Fetches guest language from guest_personal_data
 * - Fetches hotel languages from hotels table
 * - Determines if translation is needed
 * - Triggers AI analysis (sentiment, urgency, topics, translation)
 */

import { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabase";
import {
  analyzeGuestMessage,
  shouldTranslate,
  getPrimaryHotelLanguage,
} from "../../../../../services/openaiAnalyzer.service";

interface UseMessageAnalysisProps {
  guestId: string;
  hotelId: string;
  enabled?: boolean;
}

interface LanguageConfig {
  guestLanguage: string | null;
  hotelLanguages: string[] | null;
  isReady: boolean;
}

/**
 * Main hook for message analysis integration
 * Uses simple useEffect to fetch language data instead of React Query
 * to avoid hooks order issues
 */
export const useMessageAnalysis = ({
  guestId,
  hotelId,
  enabled = true,
}: UseMessageAnalysisProps) => {
  const [config, setConfig] = useState<LanguageConfig>({
    guestLanguage: null,
    hotelLanguages: null,
    isReady: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const fetchLanguageConfig = async () => {
      try {
        // Fetch guest language and hotel languages in parallel
        const [guestResult, hotelResult] = await Promise.all([
          supabase
            .from("guest_personal_data")
            .select("language")
            .eq("guest_id", guestId)
            .single(),
          supabase
            .from("hotels")
            .select("official_languages")
            .eq("id", hotelId)
            .single(),
        ]);

        setConfig({
          guestLanguage: guestResult.data?.language ?? null,
          hotelLanguages: hotelResult.data?.official_languages ?? null,
          isReady: true,
        });
      } catch (error) {
        console.error(
          "❌ [Message Analysis] Failed to fetch language config:",
          error
        );
        setConfig({
          guestLanguage: null,
          hotelLanguages: null,
          isReady: true, // Still mark as ready to not block the chat
        });
      }
    };

    fetchLanguageConfig();
  }, [guestId, hotelId, enabled]);

  /**
   * Analyzes a guest message with AI
   * Automatically handles translation if needed
   */
  const analyzeMessage = async (
    messageId: string,
    messageText: string
  ): Promise<void> => {
    if (!config.isReady) {
      return;
    }

    try {
      const needsTranslation = shouldTranslate(
        config.guestLanguage,
        config.hotelLanguages
      );
      const targetLanguage = needsTranslation
        ? getPrimaryHotelLanguage(config.hotelLanguages)
        : null;

      await analyzeGuestMessage({
        message_id: messageId,
        text: messageText,
        original_language: config.guestLanguage,
        target_language: targetLanguage,
        hotel_id: hotelId,
      });
    } catch (error) {
      console.error("❌ [Message Analysis] Failed:", error);
      // Don't throw - analysis failure shouldn't block message sending
    }
  };

  return {
    analyzeMessage,
    isReady: config.isReady,
    guestLanguage: config.guestLanguage,
    hotelLanguages: config.hotelLanguages,
    needsTranslation: shouldTranslate(
      config.guestLanguage,
      config.hotelLanguages
    ),
  };
};
