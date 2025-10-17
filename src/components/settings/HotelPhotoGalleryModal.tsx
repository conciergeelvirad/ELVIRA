import { useState, useEffect } from "react";
import { FormModal, EmptyState } from "../common";
import { Image as ImageIcon } from "lucide-react";
import { useHotel } from "../../contexts/HotelContext";
import { supabase } from "../../lib/supabase";
import { PhotoUploadButton, ProgressBar, PhotoGrid } from "./photo-gallery";

interface HotelPhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HotelPhotoGalleryModal = ({
  isOpen,
  onClose,
}: HotelPhotoGalleryModalProps) => {
  const { currentHotel } = useHotel();
  const hotelId = currentHotel?.id || "";

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const MAX_PHOTOS = 8;

  console.log(
    "[PhotoGallery] Component render - isOpen:",
    isOpen,
    "hotelId:",
    hotelId,
    "imageUrls count:",
    imageUrls.length
  );

  // Fetch existing images from the hotelPhotoGallery toggle row
  useEffect(() => {
    const fetchImages = async () => {
      if (!hotelId) {
        console.log("[PhotoGallery] No hotelId, skipping fetch");
        return;
      }

      console.log("[PhotoGallery] Fetching images for hotel:", hotelId);

      const { data, error } = await supabase
        .from("hotel_settings")
        .select("images_url")
        .eq("hotel_id", hotelId)
        .eq("setting_key", "hotelPhotoGallery")
        .single();

      if (error) {
        console.error("[PhotoGallery] Error fetching images:", error);
        return;
      }

      console.log("[PhotoGallery] Fetched data:", data);

      if (data?.images_url) {
        try {
          const urls =
            typeof data.images_url === "string"
              ? JSON.parse(data.images_url)
              : data.images_url;
          console.log("[PhotoGallery] Parsed URLs:", urls);
          setImageUrls(Array.isArray(urls) ? urls : []);
        } catch (e) {
          console.error("[PhotoGallery] Error parsing images_url:", e);
          setImageUrls([]);
        }
      }
    };

    if (isOpen) {
      fetchImages();
    }
  }, [hotelId, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("[PhotoGallery] File input triggered, files:", files?.length);

    if (!files || files.length === 0) return;

    // Calculate how many files we can upload
    const availableSlots = MAX_PHOTOS - imageUrls.length;
    console.log(
      "[PhotoGallery] Available slots:",
      availableSlots,
      "Current images:",
      imageUrls.length
    );

    if (availableSlots === 0) {
      alert(`Maximum ${MAX_PHOTOS} photos allowed`);
      return;
    }

    // Convert FileList to Array and limit to available slots
    const filesToUpload = Array.from(files).slice(0, availableSlots);
    console.log("[PhotoGallery] Files to upload:", filesToUpload.length);

    // Validate file types and sizes
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const invalidFiles = filesToUpload.filter(
      (file) => !validTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      console.error("[PhotoGallery] Invalid files:", invalidFiles);
      alert(
        "Some files are invalid. Please upload JPG, PNG, WebP, or GIF files under 5MB."
      );
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    console.log("[PhotoGallery] Starting upload...");

    try {
      const uploadedUrls: string[] = [];

      // Upload files sequentially
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];

        // Update progress
        setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
        console.log(
          `[PhotoGallery] Uploading file ${i + 1}/${filesToUpload.length}:`,
          file.name
        );

        // Generate unique filename with timestamp and random string
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        const fileExt = file.name.split(".").pop();
        const fileName = `${timestamp}-${randomStr}.${fileExt}`;
        const filePath = `hotel-gallery/${fileName}`;

        // Upload to Supabase Storage
        const { error } = await supabase.storage
          .from("hotel-assets")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("[PhotoGallery] Upload error:", error);
          throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("hotel-assets")
          .getPublicUrl(filePath);

        console.log("[PhotoGallery] Uploaded successfully:", urlData.publicUrl);
        uploadedUrls.push(urlData.publicUrl);
      }

      // Add all URLs to the list
      console.log(
        "[PhotoGallery] All uploads complete. New URLs:",
        uploadedUrls
      );
      setImageUrls([...imageUrls, ...uploadedUrls]);
      setUploadProgress(null);

      // Reset file input
      e.target.value = "";
    } catch (error) {
      console.error("[PhotoGallery] Upload failed:", error);
      alert("Failed to upload some images. Please try again.");
      setUploadProgress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    console.log("[PhotoGallery] Removing image at index:", index);
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelId) {
      console.error("[PhotoGallery] No hotelId, cannot submit");
      return;
    }

    console.log("[PhotoGallery] Submitting gallery with images:", imageUrls);
    setIsLoading(true);
    try {
      // Update the hotelPhotoGallery row with images_url column
      const payload = {
        hotel_id: hotelId,
        setting_key: "hotelPhotoGallery",
        setting_value: true, // Keep the toggle enabled
        images_url: JSON.stringify(imageUrls),
      };

      console.log("[PhotoGallery] Upserting to database:", payload);

      const { data, error } = await supabase
        .from("hotel_settings")
        .upsert(payload, {
          onConflict: "hotel_id,setting_key",
        });

      if (error) {
        console.error("[PhotoGallery] Database error:", error);
        throw error;
      }

      console.log("[PhotoGallery] Successfully saved to database:", data);
      // Close modal on success
      onClose();
    } catch (error) {
      console.error("[PhotoGallery] Submit failed:", error);
      // Silent error handling - user will see modal doesn't close
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Hotel Photo Gallery"
      submitText="Save Photos"
      isLoading={isLoading}
      size="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Upload and manage up to {MAX_PHOTOS} photos
          </p>
          <span className="text-sm font-medium text-gray-700">
            {imageUrls.length} / {MAX_PHOTOS}
          </span>
        </div>

        {/* File Upload Button */}
        {imageUrls.length < MAX_PHOTOS && (
          <PhotoUploadButton
            onFileChange={handleFileUpload}
            disabled={isLoading}
            maxPhotos={MAX_PHOTOS}
          />
        )}

        {/* Upload Progress */}
        {uploadProgress !== null && (
          <ProgressBar progress={uploadProgress} message="Uploading..." />
        )}

        {/* Image Gallery with Previews */}
        {imageUrls.length > 0 ? (
          <PhotoGrid imageUrls={imageUrls} onRemove={handleRemoveImage} />
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <EmptyState
              icon={ImageIcon}
              message="No photos added yet. Upload photos to showcase your hotel."
              className="py-12"
            />
          </div>
        )}
      </div>
    </FormModal>
  );
};
