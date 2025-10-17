import { Button } from "../../common";
import { Upload } from "lucide-react";

interface PhotoUploadButtonProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  maxPhotos: number;
}

export const PhotoUploadButton = ({
  onFileChange,
  disabled,
  maxPhotos,
}: PhotoUploadButtonProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(
      "[PhotoUploadButton] File input changed, files:",
      e.target.files?.length
    );
    onFileChange(e);
  };

  return (
    <div>
      <label className="cursor-pointer inline-block">
        <Button
          variant="outline"
          size="md"
          leftIcon={Upload}
          type="button"
          disabled={disabled}
          className="cursor-pointer"
        >
          Upload Photos
        </Button>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
          multiple
        />
      </label>
      <p className="mt-2 text-xs text-gray-500">
        Select multiple photos (JPG, PNG, WebP, GIF - Max 5MB each)
      </p>
    </div>
  );
};
