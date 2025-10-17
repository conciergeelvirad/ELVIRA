/**
 * OpenAI Analyzer Service
 *
 * Integrates with the openai-analyzer edge function for:
 * - Message sentiment analysis
 * - Urgency classification
 * - Topic/subtopic detection
 * - Automatic translation based on hotel/guest languages
 * - Q&A answering using hotel's FAQ database
 */

import { supabase } from "../lib/supabase";

export interface MessageAnalysisRequest {
  message_id: string;
  text: string;
  original_language?: string | null;
  target_language?: string | null;
  hotel_id?: string;
}

export interface MessageAnalysisResponse {
  task: string;
  result: string;
  results: {
    sentiment?: string;
    urgency?: string;
    topics?: string[];
    translated_text?: string | null;
    is_translated?: boolean;
    target_language?: string | null;
  };
  dbUpdate: {
    ok: boolean;
    rows?: unknown[];
    error?: string;
    note?: string;
  };
}

export interface AnswerQuestionRequest {
  text: string;
  hotel_id: string;
  context?: string;
}

export interface AnswerQuestionResponse {
  task: string;
  result: string;
  results: {
    answer: string;
  };
}

/**
 * Analyzes a guest message using OpenAI
 * Performs full pipeline: sentiment, urgency, topics, and optional translation
 * Automatically updates guest_messages table with results
 */
export const analyzeGuestMessage = async (
  request: MessageAnalysisRequest
): Promise<MessageAnalysisResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke("openai-analyzer", {
      body: {
        task: "full_pipeline",
        text: request.text,
        message_id: request.message_id,
        original_language: request.original_language,
        targetLanguage: request.target_language,
        hotel_id: request.hotel_id,
      },
    });

    if (error) {
      console.error("❌ [OpenAI Analyzer] Edge function error:", error);
      throw error;
    }

    return data as MessageAnalysisResponse;
  } catch (error) {
    console.error("❌ [OpenAI Analyzer] Failed to analyze message:", error);
    throw error;
  }
};

/**
 * Translates text to target language only (no analysis)
 */
export const translateMessage = async (
  text: string,
  originalLanguage: string,
  targetLanguage: string,
  messageId?: string
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke("openai-analyzer", {
      body: {
        task: "translate",
        text,
        original_language: originalLanguage,
        targetLanguage,
        message_id: messageId,
      },
    });

    if (error) throw error;

    return data.results?.translated_text || text;
  } catch (error) {
    console.error("❌ [OpenAI Translator] Translation failed:", error);
    return text; // Return original text on failure
  }
};

/**
 * Answers a guest question using hotel's Q&A database
 */
export const answerGuestQuestion = async (
  request: AnswerQuestionRequest
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke("openai-analyzer", {
      body: {
        task: "answer_question",
        text: request.text,
        hotel_id: request.hotel_id,
        context: request.context,
      },
    });

    if (error) throw error;

    return (
      data.results?.answer ||
      "I'm sorry, I don't have enough information to answer that question."
    );
  } catch (error) {
    console.error("❌ [OpenAI Q&A] Failed to generate answer:", error);
    return "I'm sorry, I encountered an error while trying to answer your question.";
  }
};

/**
 * Determines if translation is needed based on hotel and guest languages
 */
export const shouldTranslate = (
  guestLanguage: string | null | undefined,
  hotelLanguages: string[] | null | undefined
): boolean => {
  if (!guestLanguage || !hotelLanguages || hotelLanguages.length === 0) {
    return false;
  }

  const guestLang = guestLanguage.toLowerCase().trim();
  const hotelLangs = hotelLanguages.map((lang) => lang.toLowerCase().trim());

  // Don't translate if guest speaks one of the hotel's languages
  return !hotelLangs.includes(guestLang);
};

/**
 * Gets the primary hotel language for translation target
 * Returns the first language in the array, or 'en' as fallback
 */
export const getPrimaryHotelLanguage = (
  hotelLanguages: string[] | null | undefined
): string => {
  if (!hotelLanguages || hotelLanguages.length === 0) {
    return "en"; // English as default
  }
  return hotelLanguages[0].toLowerCase().trim();
};
