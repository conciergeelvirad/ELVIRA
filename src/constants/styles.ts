// Form and Input Styles
export const CHECKBOX_STYLES =
  "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500";
export const CHECKBOX_STYLES_LARGE =
  "w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 shadow-sm";

export const INPUT_BASE =
  "flex-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500";
export const INPUT_PADDING_SM = "px-2 py-1.5";
export const INPUT_PADDING_MD = "px-3 py-2";
export const INPUT_PADDING_LG = "px-4 py-3";
export const INPUT_ERROR =
  "border-red-300 focus:border-red-500 focus:ring-red-200";
export const INPUT_SUCCESS =
  "border-green-300 focus:border-green-500 focus:ring-green-200";

// Layout and Spacing
export const TABLE_CELL_PADDING = "px-4 py-3";
export const CARD_PADDING = "p-6";
export const CARD_PADDING_SM = "p-4";
export const CARD_PADDING_LG = "p-8";

// Borders and Separators
export const BORDER_DEFAULT = "border-b border-gray-200";
export const BORDER_STRONG = "border-b border-gray-300";
export const BORDER_LIGHT = "border-b border-gray-100";

// Loading and Skeleton Styles
export const SKELETON_BASE = "bg-gray-200 rounded animate-pulse";
export const SKELETON_SHIMMER =
  "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse";

// Button Styles
export const BUTTON_BASE = "rounded-lg transition-colors";
export const BUTTON_ICON_BASE = "p-1 rounded transition-colors";
export const BUTTON_ICON_SAVE = "text-green-600 hover:bg-green-50";
export const BUTTON_ICON_CANCEL = "text-red-600 hover:bg-red-50";
export const BUTTON_ICON_EDIT = "text-blue-600 hover:bg-blue-50";
export const BUTTON_ICON_DELETE = "text-red-600 hover:bg-red-50";
export const BUTTON_ICON_VIEW = "text-gray-600 hover:bg-gray-50";

// Button variants
export const BUTTON_PRIMARY = "bg-blue-600 hover:bg-blue-700 text-white";
export const BUTTON_SECONDARY = "bg-gray-600 hover:bg-gray-700 text-white";
export const BUTTON_LINK = "text-blue-600 hover:text-blue-800 hover:underline";
export const BUTTON_PRIMARY_STYLES =
  "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors";
export const BUTTON_SECONDARY_STYLES =
  "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors";
export const BUTTON_OUTLINE_STYLES =
  "border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors";
export const BUTTON_DANGER_STYLES =
  "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors";
export const BUTTON_LINK_STYLES =
  "text-blue-600 hover:text-blue-800 hover:underline font-medium";
export const BUTTON_DISABLED = "text-gray-300 cursor-not-allowed";

// Grid and Layout Classes
export const GRID_COLS_1 = "grid-cols-1";
export const GRID_COLS_2 = "grid-cols-1 md:grid-cols-2";
export const GRID_COLS_3 = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
export const GRID_COLS_4 = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
export const GRID_COLS_5 =
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
export const GRID_COLS_6 =
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";

export const GAP_SM = "gap-2";
export const GAP_MD = "gap-4";
export const GAP_LG = "gap-6";
export const GAP_XL = "gap-8";

// Status and Priority Colors
export const STATUS_ACTIVE = "bg-green-100 text-green-800 border-green-200";
export const STATUS_INACTIVE = "bg-gray-100 text-gray-800 border-gray-200";
export const STATUS_PENDING = "bg-yellow-100 text-yellow-800 border-yellow-200";
export const STATUS_COMPLETED = "bg-blue-100 text-blue-800 border-blue-200";
export const STATUS_CANCELLED = "bg-red-100 text-red-800 border-red-200";

export const PRIORITY_HIGH = "bg-red-100 text-red-800 border-red-200";
export const PRIORITY_MEDIUM =
  "bg-orange-100 text-orange-800 border-orange-200";
export const PRIORITY_LOW = "bg-green-100 text-green-800 border-green-200";

// Shadow and Elevation
export const SHADOW_SM = "shadow-sm";
export const SHADOW_MD = "shadow-md";
export const SHADOW_LG = "shadow-lg";
export const SHADOW_XL = "shadow-xl";

export const ELEVATION_1 = "shadow-sm hover:shadow-md transition-shadow";
export const ELEVATION_2 = "shadow-md hover:shadow-lg transition-shadow";
export const ELEVATION_3 = "shadow-lg hover:shadow-xl transition-shadow";

// Text and Typography
export const TEXT_TRUNCATE = "truncate";
export const TEXT_ELLIPSIS = "text-ellipsis overflow-hidden";
export const TEXT_WRAP = "break-words";

export const HEADING_1 = "text-3xl font-bold text-gray-900";
export const HEADING_2 = "text-2xl font-semibold text-gray-900";
export const HEADING_3 = "text-xl font-semibold text-gray-900";
export const HEADING_4 = "text-lg font-medium text-gray-900";

export const TEXT_BODY = "text-base text-gray-700";
export const TEXT_CAPTION = "text-sm text-gray-600";
export const TEXT_MUTED = "text-sm text-gray-500";

// Focus and Interaction States
export const FOCUS_RING =
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
export const FOCUS_RING_INSET =
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset";

export const HOVER_SCALE = "hover:scale-105 transition-transform";
export const HOVER_OPACITY = "hover:opacity-80 transition-opacity";

// Pagination
export const PAGINATION_BUTTON_BASE = "p-2 rounded-lg transition-colors";

// Responsive Breakpoints (for reference)
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Common Component Combinations
export const CARD_ELEVATED = `${SHADOW_LG} ${HOVER_SCALE}`;

// Animation Classes
export const ANIMATE_FADE_IN = "animate-fadeIn";
export const ANIMATE_SLIDE_UP = "animate-slideUp";
export const ANIMATE_SLIDE_DOWN = "animate-slideDown";
export const ANIMATE_PULSE = "animate-pulse";
export const ANIMATE_SPIN = "animate-spin";

// Z-Index Layers
export const Z_INDEX = {
  dropdown: "z-10",
  sticky: "z-20",
  modal: "z-50",
  overlay: "z-40",
  tooltip: "z-60",
} as const;
