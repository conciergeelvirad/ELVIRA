/**
 * Section State Components
 *
 * Loading, error, and empty states for sections
 */

interface SectionLoadingProps {
  title?: string;
  count?: number;
}

export const SectionLoading = ({
  title = "Recommended for You",
  count = 3,
}: SectionLoadingProps) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-4 px-4">
      <span className="text-blue-600">{title.split(" ")[0]}</span>{" "}
      {title.split(" ").slice(1).join(" ")}
    </h2>
    <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-[280px] h-[320px] bg-gray-200 rounded-xl animate-pulse"
        />
      ))}
    </div>
  </div>
);

interface SectionErrorProps {
  message?: string;
}

export const SectionError = ({
  message = "Error loading recommendations. Please try again later.",
}: SectionErrorProps) => (
  <div className="mb-8 px-4">
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-600 text-sm">{message}</p>
    </div>
  </div>
);

interface SectionEmptyProps {
  title?: string;
  message?: string;
}

export const SectionEmpty = ({
  title = "Recommended for You",
  message = "No recommendations available yet",
}: SectionEmptyProps) => (
  <div className="mb-8 px-4">
    <h2 className="text-xl font-bold mb-4">
      <span className="text-blue-600">{title.split(" ")[0]}</span>{" "}
      {title.split(" ").slice(1).join(" ")}
    </h2>
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  </div>
);
