// app/orders/loading.tsx
export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-28 animate-pulse">

      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-5 w-32 bg-gray-200 rounded" />
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded" />
      </div>

      {/* Stats row */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3 mb-4">
        <div className="h-20 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-2xl" />
      </div>

      {/* Order cards */}
      <div className="px-4 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex justify-between mb-2">
              <div className="space-y-1.5">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>
            <div className="flex gap-2 my-3">
              <div className="w-14 h-14 bg-gray-200 rounded-xl" />
              <div className="w-14 h-14 bg-gray-200 rounded-xl" />
            </div>
            <div className="h-px bg-gray-100 mb-3" />
            <div className="flex justify-between">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
