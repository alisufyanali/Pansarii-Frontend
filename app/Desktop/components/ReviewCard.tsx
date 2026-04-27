import { FaStar } from 'react-icons/fa';

interface Review {
  title:       string;
  text:        string;
  name:        string;
  designation: string;
  img:         string;
  rating?:     number;
}

export default function ReviewCard({ review }: { review: Review }) {
  const rating = review.rating ?? 5.0;

  return (
    <div className="w-full h-[clamp(200px,22vw,300px)] rounded-2xl border border-gray-200 p-4 flex flex-col bg-white hover:shadow-md hover:border-green-200 transition-all duration-300">

      {/* Stars + rating */}
      <div className="flex items-center gap-0.5 flex-shrink-0 mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`w-3 h-3 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
          />
        ))}
        <span className="ml-1.5 text-[11px] font-medium text-gray-400">{rating.toFixed(1)}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 leading-snug capitalize flex-shrink-0 line-clamp-1 mb-1.5">
        {review.title}
      </h3>

      {/* Review text */}
      <p className="text-xs text-gray-500 leading-relaxed flex-1 overflow-hidden line-clamp-3">
        {review.text}
      </p>

      {/* Reviewer info */}
      <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-gray-100 flex-shrink-0">
        <div className="w-8 h-8 rounded-full border-2 border-green-600 p-0.5 flex-shrink-0">
          <img
            src={review.img}
            alt={review.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-gray-900 truncate">{review.name}</p>
          <p className="text-[11px] text-gray-400 truncate">{review.designation}</p>
        </div>
        {/* Verified badge */}
        <div className="ml-auto flex-shrink-0">
          <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full font-medium">
            ✓ Verified
          </span>
        </div>
      </div>

    </div>
  );
}
