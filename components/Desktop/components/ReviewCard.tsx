import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import SafeImage from '@/components/SafeImage';

interface Review {
  title: string;
  text: string;
  name: string;
  designation: string;
  img: string;
  rating?: number;
  images?: string[];
  productName?: string;
  productImage?: string;
}

export default function ReviewCard({ review }: { review: Review }) {
  const rating = review.rating ?? 5.0;
  const hasImages = review.images && review.images.length > 0;

  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <div className={`h-full w-full rounded-2xl border border-gray-200 p-4 flex flex-col bg-white hover:shadow-md hover:border-green-200 transition-all duration-300 ${hasImages ? 'h-auto' : 'h-[clamp(200px,22vw,300px)]'
          }`} >
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

        {/* Review images (if any) */}
        {hasImages && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar flex-shrink-0">
            {review.images!.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setLightbox(src)}
                className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-green-400 transition-all duration-200 focus:outline-none"
              >
                <img
                  src={src}
                  alt={`Review photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Reviewer info */}
        <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-gray-100 flex-shrink-0">
          <div className="w-8 h-8 rounded-full border-2 border-green-600 p-0.5 flex-shrink-0">
            <img
              src={review.img}
              alt={review.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-gray-900 truncate">{review.name}</p>
            <p className="text-[11px] text-gray-400 truncate">{review.designation}</p>
            {review.productName && review.productImage && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="relative w-5 h-5 rounded overflow-hidden flex-shrink-0">
                  <SafeImage src={review.productImage} alt={review.productName} fill className="object-cover" sizes="20px" />
                </div>
                <p className="text-[10px] text-green-700 truncate">{review.productName}</p>
              </div>
            )}
          </div>
          {/* Verified badge */}
          <div className="ml-auto flex-shrink-0">
            <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full font-medium">
              ✓ Verified
            </span>
          </div>
        </div>

      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox}
              alt="Review photo"
              className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-lg hover:bg-gray-100 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
