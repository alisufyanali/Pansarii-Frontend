// app/[slug]/loading.tsx
// Shown immediately by Next.js App Router while the server component renders.
// Matches the ProductDetails (image+info) + ProductDetailsSection (tabs+related) layout.
export default function ProductPageLoading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="animate-pulse">

        {/* ── ProductDetails section ── */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 max-w-[1920px] mx-auto">

          {/* Left: image gallery */}
          <div className="lg:w-2/5 flex-shrink-0">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 mb-3" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Right: product info */}
          <div className="lg:w-3/5 space-y-4">
            {/* Badge + title */}
            <div className="h-5 w-24 bg-gray-200 rounded-full" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-1/2" />

            {/* Rating row */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <div className="h-9 w-32 bg-gray-200 rounded" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
            </div>

            {/* Variant selector */}
            <div>
              <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-9 w-14 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <div className="w-10 h-12 bg-gray-200" />
                <div className="w-10 h-12 bg-gray-100 border-x border-gray-200" />
                <div className="w-10 h-12 bg-gray-200" />
              </div>
              <div className="h-12 flex-1 bg-gray-200 rounded-full" />
              <div className="h-12 w-12 bg-gray-200 rounded-full" />
            </div>

            {/* Info lines */}
            <div className="space-y-2 pt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* ── ProductDetailsSection (tabs + related products) ── */}
        <div className="px-4 lg:px-6 pb-10 max-w-[1920px] mx-auto">
          {/* Tab bar */}
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-t-lg" />
            ))}
          </div>

          {/* Tab content */}
          <div className="space-y-3 mb-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${85 - i * 8}%` }} />
            ))}
          </div>

          {/* Related products heading */}
          <div className="h-7 w-40 bg-gray-200 rounded mb-5" />

          {/* Related products grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl overflow-hidden">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
                  <div className="h-9 bg-gray-200 rounded-full mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
