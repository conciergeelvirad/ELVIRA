/**
 * Restaurant Reviews Component
 *
 * Displays customer reviews with ratings, author info, and review text
 */

import React from "react";
import { MessageSquare, Star } from "lucide-react";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description?: string;
  profile_photo_url?: string;
}

interface RestaurantReviewsProps {
  reviews: Review[];
  maxReviews?: number;
}

export const RestaurantReviews: React.FC<RestaurantReviewsProps> = ({
  reviews,
  maxReviews = 5,
}) => {
  if (!reviews || reviews.length === 0) return null;

  const displayedReviews = reviews.slice(0, maxReviews);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Customer Reviews ({reviews.length})
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {displayedReviews.map((review, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                {review.profile_photo_url && (
                  <img
                    src={review.profile_photo_url}
                    alt={review.author_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.author_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {review.relative_time_description ||
                      new Date(review.time * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-900">
                  {review.rating}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
      </div>
      {reviews.length > maxReviews && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Showing {maxReviews} of {reviews.length} reviews
        </p>
      )}
    </div>
  );
};
