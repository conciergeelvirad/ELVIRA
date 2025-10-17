import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "../common";
import { EmojiPicker } from "./EmojiPicker";
import { QuickEmojiBar } from "./QuickEmojiBar";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message...",
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  return (
    <div className="bg-white">
      <QuickEmojiBar onEmojiSelect={handleEmojiSelect} />
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
          </div>
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            size="sm"
            className="px-3 py-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
