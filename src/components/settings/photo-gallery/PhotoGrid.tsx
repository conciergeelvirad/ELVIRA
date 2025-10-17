import { PhotoGridItem } from "./PhotoGridItem";

interface PhotoGridProps {
  imageUrls: string[];
  onRemove: (index: number) => void;
}

export const PhotoGrid = ({ imageUrls, onRemove }: PhotoGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {imageUrls.map((url, index) => (
        <PhotoGridItem
          key={index}
          url={url}
          index={index}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};
