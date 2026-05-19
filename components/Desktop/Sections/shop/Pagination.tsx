// app/shop/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        end = maxVisiblePages - 1;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - (maxVisiblePages - 2);
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="mt-6 sm:mt-8 flex items-center justify-center">
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Previous arrow button */}
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed border-gray-300'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
          aria-label="Previous page"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 sm:h-5 sm:w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 text-sm sm:text-base">
                ...
              </span>
            );
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum as number)}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border text-xs sm:text-sm font-medium ${
                currentPage === pageNum
                  ? 'bg-green-700 text-white border-green-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next arrow button */}
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border ${
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed border-gray-300'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
          aria-label="Next page"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 sm:h-5 sm:w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
