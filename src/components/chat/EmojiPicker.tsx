import { useState } from "react";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  smileys: {
    name: "Smileys",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🤩",
      "🥳",
      "😏",
      "😒",
      "😞",
      "😔",
      "😟",
      "😕",
      "🙁",
      "☹️",
      "😣",
      "😖",
      "😫",
      "😩",
      "🥺",
      "😢",
      "😭",
      "😤",
      "😠",
      "😡",
      "🤬",
      "🤯",
      "😳",
      "🥵",
      "🥶",
      "😱",
      "😨",
      "😰",
      "😥",
      "😓",
      "🤗",
      "🤔",
      "🤭",
      "🤫",
      "🤥",
      "😶",
      "😐",
      "😑",
      "😬",
      "🙄",
      "😯",
      "😦",
      "😧",
      "😮",
      "😲",
      "🥱",
      "😴",
      "🤤",
      "😪",
      "😵",
      "🤐",
      "🥴",
      "🤢",
      "🤮",
      "🤧",
      "😷",
      "🤒",
      "🤕",
    ],
  },
  gestures: {
    name: "Gestures",
    emojis: [
      "👍",
      "👎",
      "👌",
      "🤌",
      "🤏",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "☝️",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👏",
      "🙌",
      "🤝",
      "👐",
      "🤲",
      "🙏",
      "💪",
      "🦾",
      "🦿",
      "🦵",
      "🦶",
      "👂",
      "🦻",
      "👃",
      "🧠",
      "🫀",
      "🫁",
      "🦷",
      "🦴",
      "👀",
      "👁️",
      "👅",
      "👄",
      "💋",
      "🩸",
    ],
  },
  symbols: {
    name: "Symbols",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
      "☪️",
      "🕉️",
      "☸️",
      "✡️",
      "🔯",
      "🕎",
      "☯️",
      "☦️",
      "🛐",
      "⭐",
      "🌟",
      "💫",
      "⚡",
      "☄️",
      "💥",
      "🔥",
      "🌈",
      "☀️",
      "🌤️",
      "⛅",
      "🌦️",
      "🌧️",
      "⛈️",
      "🌩️",
      "�️",
      "❄️",
      "☃️",
      "⛄",
      "🌬️",
      "�",
      "�",
      "💦",
      "☔",
      "🌊",
      "🌍",
      "🌎",
      "🌏",
      "🌕",
      "🌖",
      "🌗",
      "🌘",
      "🌑",
      "🌒",
      "🌓",
      "🌔",
      "🌚",
      "🌝",
      "🌛",
      "🌜",
      "☁️",
      "⛅",
      "⛈️",
      "🌤️",
      "🌦️",
      "🌧️",
      "🌩️",
      "🌨️",
    ],
  },
};

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("smileys");

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Smile className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Emoji Picker */}
          <div className="absolute bottom-12 right-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg w-80 h-64">
            {/* Category Tabs */}
            <div className="flex border-b border-gray-200">
              {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    activeCategory === key
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {category.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="p-3 h-48 overflow-y-auto">
              <div className="grid grid-cols-8 gap-1">
                {EMOJI_CATEGORIES[
                  activeCategory as keyof typeof EMOJI_CATEGORIES
                ].emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiClick(emoji)}
                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
