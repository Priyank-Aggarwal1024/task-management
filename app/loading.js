export default function Loading() {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 w-screen h-screen absolute top-0 left-0 z-10">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  