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
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const rating = review.rating || 5.0;
  
  return (
    <div className="w-full h-auto rounded-[21px] border border-gray-300 p-4 md:p-5 lg:p-6 2xl:p-8 flex flex-col bg-white hover:shadow-lg transition-shadow">
      {/* Review Title */}
      <h3 className="font-poppins font-semibold text-base md:text-lg lg:text-xl 2xl:text-2xl leading-tight capitalize">
        {review.title}
      </h3>

      {/* Review Text */}
      <p className="font-poppins font-normal text-sm md:text-base lg:text-lg 2xl:text-xl leading-relaxed mt-3 capitalize text-gray-700 line-clamp-3">
        {review.text}
      </p>

      {/* Reviewer Info */}
      <div className="mt-4 md:mt-5 lg:mt-6 flex items-start gap-2 md:gap-3">
        {/* Reviewer Picture with green border */}
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 2xl:w-16 2xl:h-16 rounded-full border-2 border-[#197B33] p-0.5">
          <img
            src={review.img} 
            alt={review.name} 
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Reviewer Name & Designation */}
        <div className="flex-1 min-w-0">
          <p className="font-poppins font-semibold text-sm md:text-base lg:text-lg 2xl:text-xl truncate">{review.name}</p>
          <p className="font-poppins font-normal text-xs md:text-sm lg:text-base 2xl:text-lg text-gray-600 truncate">{review.designation}</p>
          
          {/* Yellow Stars Rating */}
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 2xl:h-5 2xl:w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.176 0l-3.376 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.048 9.384c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            ))}
            <span className="ml-1 text-xs md:text-sm lg:text-base 2xl:text-lg font-medium text-gray-700">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}