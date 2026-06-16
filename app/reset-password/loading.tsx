export default function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4 animate-pulse">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto" />
          <div className="h-4 w-56 bg-gray-200 rounded mx-auto" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-12 bg-gray-200 rounded-lg" />
          <div className="h-px bg-gray-200" />
          <div className="h-4 w-28 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}
