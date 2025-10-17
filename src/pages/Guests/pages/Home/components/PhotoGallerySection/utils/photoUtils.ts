/**
 * Photo Gallery Utilities
 *
 * Helper functions for parsing and processing photo gallery data
 */

/**
 * Parse images_url field from database
 * Handles JSON array or comma-separated string formats
 */
export const parseImageUrls = (imagesUrl: string | null): string[] => {
  if (!imagesUrl) {
    return [];
  }

  // If it's already an array (shouldn't happen, but just in case)
  if (Array.isArray(imagesUrl)) {
    return imagesUrl.filter((url) => typeof url === "string" && url.trim());
  }

  // If it's a string, try to parse it
  if (typeof imagesUrl === "string") {
    try {
      // Try parsing as JSON array first
      const parsed = JSON.parse(imagesUrl);
      if (Array.isArray(parsed)) {
        return parsed.filter((url) => typeof url === "string" && url.trim());
      }
    } catch {
      // If not JSON, try comma-separated string
      const urls = imagesUrl
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
      if (urls.length > 0) return urls;
    }
  }

  return [];
};

/**
 * Default fallback images for demo purposes
 */
export const defaultGalleryImages = [
  "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&fit=crop",
];
