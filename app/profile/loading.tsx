// app/profile/loading.tsx
export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-28 animate-pulse">

      {/* Hero header */}
      <div className="relative flex flex-col items-center pt-10 pb-8 px-4 bg-green-800">
        <div className="w-20 h-20 rounded-full bg-green-600 border-4 border-green-400 mb-3" />
        <div className="h-5 w-32 bg-green-600 rounded mb-1" />
        <div className="h-3 w-44 bg-green-600 rounded" />
      </div>

      {/* Menu sections */}
      <div className="px-4 mt-4 space-y-3">

        {/* Account section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 bg-gray-200 rounded-xl" />
                <div className="flex-1 h-4 bg-gray-200 rounded" />
                <div className="w-4 h-4 bg-gray-200 rounded" />
              </div>
              {i < 2 && <div className="h-px bg-gray-100 mx-4" />}
            </div>
          ))}
        </div>

        {/* Section label */}
        <div className="h-3 w-36 bg-gray-200 rounded px-4 pt-3" />

        {/* Support section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 bg-gray-200 rounded-xl" />
                <div className="flex-1 h-4 bg-gray-200 rounded" />
                <div className="w-4 h-4 bg-gray-200 rounded" />
              </div>
              {i < 2 && <div className="h-px bg-gray-100 mx-4" />}
            </div>
          ))}
        </div>

        {/* Logout button */}
        <div className="h-12 bg-gray-200 rounded-2xl mt-2" />

      </div>
    </div>
  );
}
