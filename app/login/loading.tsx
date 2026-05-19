// app/login/loading.tsx
export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4 animate-pulse">
      <div className="w-full max-w-md">

        {/* Header text */}
        <div className="text-center mb-8 space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto" />
          <div className="h-4 w-56 bg-gray-200 rounded mx-auto" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Email field */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
          {/* Password field */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
          {/* Remember + forgot */}
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
          {/* Submit button */}
          <div className="h-12 bg-gray-200 rounded-lg" />
          {/* Divider */}
          <div className="h-px bg-gray-200" />
          {/* Sign up link */}
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
        </div>

      </div>
    </div>
  );
}
