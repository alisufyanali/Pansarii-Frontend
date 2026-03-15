import React from 'react';

interface Review {
  title: string;
  text: string;
  name: string;
  designation: string;
  img: string;
  rating?: number;
}

interface ReviewCardProps {
  review: ReviewCardProps_Review;
}

interface ReviewCardProps_Review extends Review {}

export default function ReviewCard({ review }: ReviewCardProps) {
  const rating = review.rating || 5.0;

  return (
    <div
      className="w-full rounded-[18px] border border-gray-200 p-4 flex flex-col bg-white hover:shadow-md transition-shadow"
      style={{ height: '40vh', minHeight: '220px', maxHeight: '340px' }}
    >
      {/* Stars — top */}
      <div className="flex items-center gap-0.5 flex-shrink-0 mb-2">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.176 0l-3.376 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.048 9.384c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
        ))}
        <span className="ml-1 text-[11px] font-medium text-gray-500">{rating.toFixed(1)}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 leading-snug capitalize flex-shrink-0 line-clamp-1">
        {review.title}
      </h3>

      {/* Review text — fills remaining space */}
      <p className="text-xs text-gray-500 leading-relaxed mt-1.5 flex-1 overflow-hidden line-clamp-4 capitalize">
        {review.text}
      </p>

      {/* Reviewer info — pinned to bottom */}
      <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-gray-100 flex-shrink-0">
        <div className="w-9 h-9 rounded-full border-2 border-[#197B33] p-0.5 flex-shrink-0">
          <img src={review.img} alt={review.name}
            className="w-full h-full rounded-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-gray-900 truncate">{review.name}</p>
          <p className="text-[11px] text-gray-400 truncate">{review.designation}</p>
        </div>
      </div>
    </div>
  );
}