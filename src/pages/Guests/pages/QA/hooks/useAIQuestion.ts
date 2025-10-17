/**
 * useAIQuestion Hook
 *
 * Handles AI question asking logic
 */

import { useState } from "react";
import { supabase } from "../../../../../lib/supabase";

export const useAIQuestion = (hotelId: string) => {
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  const handleAskQuestion = async () => {
    if (!question.trim() || !hotelId) return;

    setIsAsking(true);
    setAskError(null);
    setAiAnswer(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "openai-analyzer",
        {
          body: {
            task: "answer_question",
            text: question,
            hotel_id: hotelId,
          },
        }
      );

      if (error) throw error;

      if (data?.results?.answer) {
        setAiAnswer(data.results.answer);
      } else {
        setAskError("No answer received from AI");
      }
    } catch (err) {
      console.error("Error asking question:", err);
      setAskError(err instanceof Error ? err.message : "Failed to get answer");
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isAsking) {
      handleAskQuestion();
    }
  };

  return {
    question,
    setQuestion,
    aiAnswer,
    askError,
    isAsking,
    handleAskQuestion,
    handleKeyPress,
  };
};
