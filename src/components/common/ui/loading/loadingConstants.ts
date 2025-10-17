// Loading constants and utilities
export const loadingSizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
} as const;

export const loadingColors = {
  primary: "text-blue-600",
  secondary: "text-gray-500",
  white: "text-white",
} as const;

export const loadingDotSizes = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
  xl: "w-5 h-5",
} as const;

export const loadingDotColors = {
  primary: "bg-blue-600",
  secondary: "bg-gray-500",
  white: "bg-white",
} as const;

export type LoadingSize = keyof typeof loadingSizes;
export type LoadingColor = keyof typeof loadingColors;
