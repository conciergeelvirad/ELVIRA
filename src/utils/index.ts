// Utility functions

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

// Data utilities
export * from "./data/pagination";
export * from "./data/sorting";
export * from "./data/search";

// Constants
export * from "./constants";

// Generators
export * from "./generators";
export * from "./data/filtering";
export * from "./data/status";

// UI utilities
export * from "./ui/layout/grid";
export * from "./ui/layout/table";
export * from "./ui/navigation";
export * from "./ui/styling/badge";
export * from "./ui/styling/styles";

// Domain utilities
export * from "./domain/third-party";

// Form utilities
export * from "./forms/fields";
export * from "./forms/actions";

// Formatting utilities
export * from "./formatting/dates";

// Localization utilities
export * from "./localization";

// Testing utilities
export * from "./testing/amadeus-api-test";
