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
  onPageChange(page);   // no validation – parent handles it
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
    if (totalPages <= 1) return [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always include page 1
    const pages: (number | string)[] = [1];

    // Determine window around current page
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 2) {
      start = 2;
      end = Math.min(totalPages - 1, 3);
    } else if (currentPage >= totalPages - 1) {
      start = Math.max(2, totalPages - 2);
      end = totalPages - 1;
    }

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('...');
    }

    // Always include last page
    pages.push(totalPages);

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
