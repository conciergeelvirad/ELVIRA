/**
 * Image Upload Field Component
 *
 * Reusable component for uploading images to Supabase Storage (hotel-assets bucket)
 * Displays current image preview and allows uploading new images
 */

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "../ui";
import { storageHelper, STORAGE_FOLDERS } from "../../../lib/supabase/storage";
import { cn } from "../../../utils";

interface ImageUploadFieldProps {
  label: string;
  value?: string; // Current image URL
  onChange: (url: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  storageFolder: keyof typeof STORAGE_FOLDERS;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  storageFolder,
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      setUploadProgress(30);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await storageHelper.uploadFile(
        storageFolder,
        file
      );

      if (uploadError || !data) {
        throw new Error("Failed to upload image");
      }

      setUploadProgress(70);

      // Get public URL
      const publicUrl = storageHelper.getPublicUrl(data.path);

      setUploadProgress(100);

      // Update form with the new URL
      onChange(publicUrl);

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(null);
      }, 500);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload image. Please try again.");
      setUploadProgress(null);
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    onChange("");
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Current Image Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={disabled || isUploading}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div>
        <Button
          variant="outline"
          size="md"
          leftIcon={value ? Upload : ImageIcon}
          type="button"
          disabled={disabled || isUploading}
          onClick={handleButtonClick}
        >
          {isUploading
            ? "Uploading..."
            : value
            ? "Change Image"
            : "Upload Image"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />
      </div>

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Upload JPG, PNG, WebP, or GIF (Max 5MB)
      </p>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
