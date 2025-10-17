import { StatusType } from "../../../components/common";

// Common layout utilities
export const getGridColumnsClass = (columns: number): string => {
  const colMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };
  return colMap[columns] || colMap[3];
};

export const getGapClass = (size: "sm" | "md" | "lg" | "xl"): string => {
  const gapMap = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };
  return gapMap[size];
};

// Priority level utilities
export const getPriorityLevel = (
  priority: string
): "high" | "medium" | "low" => {
  const normalized = priority.toLowerCase();
  if (["high", "urgent", "critical", "1"].includes(normalized)) return "high";
  if (["medium", "normal", "moderate", "2"].includes(normalized))
    return "medium";
  return "low";
};

export const getPriorityStatusType = (priority: string): StatusType => {
  const level = getPriorityLevel(priority);
  return level as StatusType;
};

export const getPriorityColor = (priority: string): string => {
  const level = getPriorityLevel(priority);
  const colorMap = {
    high: "text-red-600",
    medium: "text-orange-600",
    low: "text-green-600",
  };
  return colorMap[level];
};

// Size utilities
export const getSizeClasses = (
  size: "sm" | "md" | "lg",
  type: "padding" | "text" | "icon" = "padding"
): string => {
  const sizeMap = {
    padding: {
      sm: "px-2 py-1",
      md: "px-3 py-2",
      lg: "px-4 py-3",
    },
    text: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    icon: {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    },
  };
  return sizeMap[type][size];
};

// Color scheme utilities
export const getColorScheme = (
  variant: "primary" | "secondary" | "success" | "warning" | "error" | "info"
) => {
  const schemes = {
    primary: {
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      text: "text-blue-600",
      border: "border-blue-600",
      light: "bg-blue-50",
      textOnLight: "text-blue-800",
    },
    secondary: {
      bg: "bg-gray-600",
      hover: "hover:bg-gray-700",
      text: "text-gray-600",
      border: "border-gray-600",
      light: "bg-gray-50",
      textOnLight: "text-gray-800",
    },
    success: {
      bg: "bg-green-600",
      hover: "hover:bg-green-700",
      text: "text-green-600",
      border: "border-green-600",
      light: "bg-green-50",
      textOnLight: "text-green-800",
    },
    warning: {
      bg: "bg-orange-600",
      hover: "hover:bg-orange-700",
      text: "text-orange-600",
      border: "border-orange-600",
      light: "bg-orange-50",
      textOnLight: "text-orange-800",
    },
    error: {
      bg: "bg-red-600",
      hover: "hover:bg-red-700",
      text: "text-red-600",
      border: "border-red-600",
      light: "bg-red-50",
      textOnLight: "text-red-800",
    },
    info: {
      bg: "bg-blue-500",
      hover: "hover:bg-blue-600",
      text: "text-blue-500",
      border: "border-blue-500",
      light: "bg-blue-50",
      textOnLight: "text-blue-700",
    },
  };
  return schemes[variant];
};

// Responsive utilities
export const getResponsiveClass = (
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
): string => {
  const classes = [base];
  if (sm) classes.push(`sm:${sm}`);
  if (md) classes.push(`md:${md}`);
  if (lg) classes.push(`lg:${lg}`);
  if (xl) classes.push(`xl:${xl}`);
  return classes.join(" ");
};

// Animation utilities
export const getAnimationClass = (
  type: "fadeIn" | "slideUp" | "slideDown" | "scale" | "spin"
): string => {
  const animationMap = {
    fadeIn: "animate-fadeIn",
    slideUp: "animate-slideUp",
    slideDown: "animate-slideDown",
    scale: "hover:scale-105 transition-transform",
    spin: "animate-spin",
  };
  return animationMap[type];
};

// Shadow/elevation utilities
export const getElevationClass = (level: 1 | 2 | 3 | 4): string => {
  const elevationMap = {
    1: "shadow-sm hover:shadow-md transition-shadow",
    2: "shadow-md hover:shadow-lg transition-shadow",
    3: "shadow-lg hover:shadow-xl transition-shadow",
    4: "shadow-xl hover:shadow-2xl transition-shadow",
  };
  return elevationMap[level];
};

// Form validation utilities
export const getValidationClasses = (
  isValid: boolean | null,
  hasError: boolean = false
): string => {
  if (hasError || isValid === false) {
    return "border-red-300 focus:border-red-500 focus:ring-red-200";
  }
  if (isValid === true) {
    return "border-green-300 focus:border-green-500 focus:ring-green-200";
  }
  return "border-gray-300 focus:border-blue-500 focus:ring-blue-200";
};

// Utility to combine classes with proper handling of conditionals
export const combineClasses = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};
