/**
 * Gallery Loading Component
 *
 * Displays loading state for photo gallery
 */

export const GalleryLoading = () => {
  return (
    <div className="mt-8">
      <div className="px-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Photo <span className="text-blue-600">Gallery</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Discover our beautiful spaces and amenities
        </p>
      </div>
      <div className="px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading gallery...</p>
      </div>
    </div>
  );
};
