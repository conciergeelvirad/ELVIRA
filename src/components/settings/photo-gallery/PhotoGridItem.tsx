import { IconButton } from "../../common";
import { X } from "lucide-react";

interface PhotoGridItemProps {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

export const PhotoGridItem = ({ url, index, onRemove }: PhotoGridItemProps) => {
  return (
    <div className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:border-gray-300 transition-colors">
      <div className="aspect-video w-full">
        <img
          src={url}
          alt={`Hotel photo ${index + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3EImage Error%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>
      <IconButton
        icon={X}
        onClick={() => onRemove(index)}
        variant="solid"
        size="sm"
        className="absolute top-2 right-2 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
        title="Remove photo"
        type="button"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs px-2 py-1.5">
        Photo {index + 1}
      </div>
    </div>
  );
};
