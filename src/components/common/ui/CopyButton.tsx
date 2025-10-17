import React from "react";

interface CopyButtonProps {
  value: unknown;
  className?: string;
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  className = "text-gray-400 hover:text-gray-600 text-xs",
}) => {
  if (!value) return null;

  return (
    <button
      onClick={() => copyToClipboard(String(value))}
      className={className}
      title="Copy to clipboard"
    >
      Copy
    </button>
  );
};
