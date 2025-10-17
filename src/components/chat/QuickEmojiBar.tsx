interface QuickEmojiBarProps {
  onEmojiSelect: (emoji: string) => void;
}

const QUICK_EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🤔",
  "👍",
  "👎",
  "❤️",
  "🔥",
  "💯",
  "🎉",
];

export const QuickEmojiBar = ({ onEmojiSelect }: QuickEmojiBarProps) => {
  return (
    <div className="flex items-center space-x-1 px-3 py-2 bg-gray-50 border-t border-gray-200">
      <span className="text-xs text-gray-500 mr-2">Quick:</span>
      {QUICK_EMOJIS.map((emoji, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onEmojiSelect(emoji)}
          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-200 rounded transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
