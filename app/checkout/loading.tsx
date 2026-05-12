// app/checkout/loading.tsx — matches CheckoutPage layout: form left + order summary right
export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top header bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-[4%] py-4 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          {/* Progress steps */}
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 bg-gray-200 rounded-full" />
                  <div className="h-3 w-14 bg-gray-200 rounded" />
                </div>
                {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1600px] mx-auto px-[4%] py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_440px] gap-5">

          {/* ── LEFT: Form sections ── */}
          <div className="flex flex-col gap-4 animate-pulse">

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="h-5 w-44 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <div className="h-3 w-20 bg-gray-200 rounded mb-1.5" />
                  <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
                <div>
                  <div className="h-3 w-24 bg-gray-200 rounded mb-1.5" />
                  <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
                <div>
                  <div className="h-3 w-24 bg-gray-200 rounded mb-1.5" />
                  <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="h-5 w-36 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <div className="h-3 w-28 bg-gray-200 rounded mb-1.5" />
                  <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
                <div>
                  <div className="h-3 w-12 bg-gray-200 rounded mb-1.5" />
                  <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
                <div>
                  <div className="h-3 w-20 bg-gray-200 rounded mb-1.5" />
                  <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
                <div className="sm:col-span-2">
                  <div className="h-3 w-36 bg-gray-200 rounded mb-1.5" />
                  <div className="h-16 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
              <div className="flex flex-col gap-2.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 border border-gray-200 rounded-xl">
                    <div className="w-4 h-4 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="w-9 h-9 bg-gray-200 rounded-lg flex-shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-36" />
                      <div className="h-3 bg-gray-200 rounded w-48" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="h-5 w-32 bg-gray-200 rounded mb-4" />

              {/* Cart items */}
              <div className="flex flex-col gap-3 pb-4 border-b border-gray-100">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="relative w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="h-3 w-16 bg-gray-200 rounded flex-shrink-0" />
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="py-4 border-b border-gray-100">
                <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded-lg flex-1" />
                  <div className="h-10 w-16 bg-gray-200 rounded-lg" />
                </div>
              </div>

              {/* Price breakdown */}
              <div className="flex flex-col gap-2.5 py-4 border-b border-gray-100">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between pt-3.5 mb-4">
                <div className="h-5 w-10 bg-gray-200 rounded" />
                <div className="h-5 w-24 bg-gray-200 rounded" />
              </div>

              {/* Submit button */}
              <div className="h-12 w-full bg-gray-200 rounded-full" />
              <div className="flex items-center justify-center mt-3">
                <div className="h-3 w-56 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 animate-pulse">
              <div className="h-3 w-64 bg-gray-200 rounded mx-auto" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
