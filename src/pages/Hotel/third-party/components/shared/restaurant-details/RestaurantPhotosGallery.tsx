/**
 * Restaurant Photos Gallery Component
 *
 * Displays a grid of restaurant photos with a featured large image
 */

import React from "react";

interface Photo {
  photo_reference: string;
  height: number;
  width: number;
}

interface RestaurantPhotosGalleryProps {
  photos: Photo[];
  restaurantName: string;
  maxPhotos?: number;
}

export const RestaurantPhotosGallery: React.FC<
  RestaurantPhotosGalleryProps
> = ({ photos, restaurantName, maxPhotos = 4 }) => {
  if (!photos || photos.length === 0) return null;

  const displayPhotos = photos.slice(0, maxPhotos);

  return (
    <div className="grid grid-cols-2 gap-2">
      {displayPhotos.map((photo, index) => (
        <img
          key={index}
          src={photo.photo_reference}
          alt={`${restaurantName} - Photo ${index + 1}`}
          className={`w-full rounded-lg object-cover transition-transform hover:scale-[1.02] ${
            index === 0 ? "col-span-2 h-64" : "h-32"
          }`}
        />
      ))}
    </div>
  );
};
