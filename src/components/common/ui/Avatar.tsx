import { User } from "lucide-react";
import { cn } from "../../../utils";
import { userAvatarStorage } from "../../../lib/supabase/storage";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const sizeStyles = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-20 h-20 text-xl",
  "2xl": "w-24 h-24 text-2xl",
};

/**
 * Avatar component - Displays user profile image with fallback to initials or icon
 *
 * @param src - Image URL or filename (supports Supabase storage paths)
 * @param alt - Alt text for image
 * @param initials - Manual initials (if not provided, will be generated from name)
 * @param name - User name for generating initials automatically
 * @param size - Size variant (xs, sm, md, lg, xl, 2xl)
 * @param className - Additional CSS classes
 */
export const Avatar = ({
  src,
  alt,
  initials,
  name,
  size = "md",
  className,
}: AvatarProps) => {
  // Get initials from name if not provided
  const getInitials = (name?: string): string => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate image URL (handle Supabase storage paths)
  const getImageUrl = (src?: string | null): string | null => {
    if (!src) return null;

    // If it's already a full URL, use it directly
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }

    // If it's a Supabase storage path (contains folders like "users-avatar/filename.png")
    if (src.includes("/")) {
      const fileName = src.split("/").pop();
      return fileName ? userAvatarStorage.getUrl(fileName) : null;
    }

    // If it's just a filename
    return userAvatarStorage.getUrl(src);
  };

  const imageUrl = getImageUrl(src);
  const displayInitials = initials || getInitials(name);

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-semibold flex-shrink-0 overflow-hidden",
        sizeStyles[size],
        className
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt || name || "Avatar"}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide image on error and show fallback
            e.currentTarget.style.display = "none";
          }}
        />
      ) : displayInitials ? (
        <span>{displayInitials}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-indigo-500" />
      )}
    </div>
  );
};
