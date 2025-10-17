import { supabase } from "../supabase";

/**
 * Supabase Storage Configuration
 * Bucket: hotel-assets (Public)
 */
export const STORAGE_BUCKETS = {
  HOTEL_ASSETS: "hotel-assets",
} as const;

/**
 * Folders within hotel-assets bucket
 */
export const STORAGE_FOLDERS = {
  AMENITIES: "amenities",
  HOTEL_GALLERY: "hotel-gallery",
  MENU_ITEMS: "menu-items",
  MESSAGES: "messages",
  PRODUCTS: "products",
  USERS_AVATAR: "users-avatar",
} as const;

/**
 * Storage helper functions
 */
export const storageHelper = {
  /**
   * Upload a file to a specific folder in hotel-assets bucket
   */
  uploadFile: async (
    folder: keyof typeof STORAGE_FOLDERS,
    file: File,
    fileName?: string
  ): Promise<{ data: { path: string } | null; error: Error | null }> => {
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const finalFileName = fileName || `${timestamp}.${fileExt}`;
    const filePath = `${STORAGE_FOLDERS[folder]}/${finalFileName}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.HOTEL_ASSETS)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    return { data, error };
  },

  /**
   * Get public URL for a file
   */
  getPublicUrl: (filePath: string): string => {
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.HOTEL_ASSETS)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Delete a file from hotel-assets bucket
   */
  deleteFile: async (
    filePath: string
  ): Promise<{ data: unknown; error: Error | null }> => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.HOTEL_ASSETS)
      .remove([filePath]);

    return { data, error };
  },

  /**
   * List all files in a folder
   */
  listFiles: async (folder: keyof typeof STORAGE_FOLDERS) => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.HOTEL_ASSETS)
      .list(STORAGE_FOLDERS[folder], {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    return { data, error };
  },

  /**
   * Update/Replace a file
   */
  updateFile: async (
    filePath: string,
    file: File
  ): Promise<{ data: { path: string } | null; error: Error | null }> => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.HOTEL_ASSETS)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // This will replace the file if it exists
      });

    return { data, error };
  },
};

/**
 * Specific helpers for each folder type
 */
export const amenitiesStorage = {
  upload: (file: File, fileName?: string) =>
    storageHelper.uploadFile("AMENITIES", file, fileName),
  getUrl: (fileName: string) =>
    storageHelper.getPublicUrl(`${STORAGE_FOLDERS.AMENITIES}/${fileName}`),
  delete: (fileName: string) =>
    storageHelper.deleteFile(`${STORAGE_FOLDERS.AMENITIES}/${fileName}`),
  list: () => storageHelper.listFiles("AMENITIES"),
};

export const hotelGalleryStorage = {
  upload: (file: File, fileName?: string) =>
    storageHelper.uploadFile("HOTEL_GALLERY", file, fileName),
  getUrl: (fileName: string) =>
    storageHelper.getPublicUrl(`${STORAGE_FOLDERS.HOTEL_GALLERY}/${fileName}`),
  delete: (fileName: string) =>
    storageHelper.deleteFile(`${STORAGE_FOLDERS.HOTEL_GALLERY}/${fileName}`),
  list: () => storageHelper.listFiles("HOTEL_GALLERY"),
};

export const menuItemsStorage = {
  upload: (file: File, fileName?: string) =>
    storageHelper.uploadFile("MENU_ITEMS", file, fileName),
  getUrl: (fileName: string) =>
    storageHelper.getPublicUrl(`${STORAGE_FOLDERS.MENU_ITEMS}/${fileName}`),
  delete: (fileName: string) =>
    storageHelper.deleteFile(`${STORAGE_FOLDERS.MENU_ITEMS}/${fileName}`),
  list: () => storageHelper.listFiles("MENU_ITEMS"),
};

export const messagesStorage = {
  upload: (file: File, fileName?: string) =>
    storageHelper.uploadFile("MESSAGES", file, fileName),
  getUrl: (fileName: string) =>
    storageHelper.getPublicUrl(`${STORAGE_FOLDERS.MESSAGES}/${fileName}`),
  delete: (fileName: string) =>
    storageHelper.deleteFile(`${STORAGE_FOLDERS.MESSAGES}/${fileName}`),
  list: () => storageHelper.listFiles("MESSAGES"),
};

export const productsStorage = {
  upload: (file: File, fileName?: string) =>
    storageHelper.uploadFile("PRODUCTS", file, fileName),
  getUrl: (fileName: string) =>
    storageHelper.getPublicUrl(`${STORAGE_FOLDERS.PRODUCTS}/${fileName}`),
  delete: (fileName: string) =>
    storageHelper.deleteFile(`${STORAGE_FOLDERS.PRODUCTS}/${fileName}`),
  list: () => storageHelper.listFiles("PRODUCTS"),
};

export const userAvatarStorage = {
  upload: (file: File, fileName?: string) =>
    storageHelper.uploadFile("USERS_AVATAR", file, fileName),
  getUrl: (fileName: string) =>
    storageHelper.getPublicUrl(`${STORAGE_FOLDERS.USERS_AVATAR}/${fileName}`),
  delete: (fileName: string) =>
    storageHelper.deleteFile(`${STORAGE_FOLDERS.USERS_AVATAR}/${fileName}`),
  list: () => storageHelper.listFiles("USERS_AVATAR"),
};
