// app/cart/loading.tsx — matches CartContent layout: items list + order summary sidebar
export default function CartLoading() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-[4%] py-3">
          <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Page title */}
      <div className="max-w-[1600px] mx-auto px-[4%] pt-6 pb-2">
        <div className="h-7 w-44 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="max-w-[1600px] mx-auto px-[4%] pb-12">
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_440px] gap-6">

          {/* ── LEFT: Cart items ── */}
          <div className="flex flex-col gap-3">

            {/* Free shipping progress bar */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3.5 animate-pulse">
              <div className="flex justify-between mb-2">
                <div className="h-3 w-56 bg-gray-200 rounded" />
                <div className="h-3 w-8 bg-gray-200 rounded" />
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* Items card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 sm:p-5 border-b border-gray-50 flex gap-3 sm:gap-4">
                  {/* Thumbnail */}
                  <div className="w-[72px] h-[72px] bg-gray-200 rounded-lg flex-shrink-0" />
                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between gap-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-7 w-7 bg-gray-200 rounded-lg flex-shrink-0" />
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="flex items-center justify-between mt-3">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <div className="w-8 h-8 bg-gray-200" />
                        <div className="w-8 h-8 bg-gray-100 border-x border-gray-200" />
                        <div className="w-8 h-8 bg-gray-200" />
                      </div>
                      {/* Price */}
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
              {/* Continue shopping link */}
              <div className="px-5 py-3.5 border-t border-gray-50">
                <div className="h-3 w-36 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <div className="h-5 w-12 bg-gray-200 rounded" />
                  <div className="h-5 w-24 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-12 w-full bg-gray-200 rounded-full mt-5" />
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <div className="h-3 w-48 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3.5 animate-pulse">
              <div className="h-3 w-56 bg-gray-200 rounded mx-auto" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
