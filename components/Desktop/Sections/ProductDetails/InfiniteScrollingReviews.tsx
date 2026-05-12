"use client";

import { useRef, useEffect, useState } from 'react';
import ReviewCard from "../../components/ReviewCard";
import { reviews } from "../../data/reviews";

export default function ScrollableReviews() {
  const firstRowRef = useRef<HTMLDivElement>(null);
  const secondRowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cardWidth, setCardWidth] = useState(380);
  const [totalCards, setTotalCards] = useState(0);

  // Function to get balanced rows
  const getBalancedRows = () => {
    if (!reviews || reviews.length === 0) {
      return { firstRow: [], secondRow: [] };
    }

    const half = Math.ceil(reviews.length / 2);
    const firstRow = reviews.slice(0, half);
    const secondRow = reviews.slice(half);

    return { firstRow, secondRow };
  };

  const { firstRow: firstRowReviews, secondRow: secondRowReviews } = getBalancedRows();

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      if (width < 480) {
        setCardWidth(width * 0.85);
      } else if (width < 640) {
        setCardWidth(320);
      } else if (width < 768) {
        setCardWidth(350);
      } else if (width < 1024) {
        setCardWidth(380);
      } else {
        setCardWidth(412);
      }
      
      // Calculate total width needed
      const firstRowWidth = firstRowReviews.length * (width < 480 ? width * 0.85 : 
                              width < 640 ? 320 : 
                              width < 768 ? 350 : 
                              width < 1024 ? 380 : 412);
      setTotalCards(firstRowWidth);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [firstRowReviews.length]);

  // Setup horizontal scrolling with touch - FIXED VERSION
  useEffect(() => {
    const setupScrolling = (element: HTMLDivElement) => {
      if (!element) return () => {}; // Return empty cleanup function

      let isDown = false;
      let startX: number;
      let scrollLeft: number;

      const handleMouseDown = (e: MouseEvent) => {
        isDown = true;
        element.classList.add('active');
        startX = e.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
      };

      const handleMouseLeave = () => {
        isDown = false;
        element.classList.remove('active');
      };

      const handleMouseUp = () => {
        isDown = false;
        element.classList.remove('active');
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - element.offsetLeft;
        const walk = (x - startX) * 2;
        element.scrollLeft = scrollLeft - walk;
      };

      const handleTouchStart = (e: TouchEvent) => {
        isDown = true;
        startX = e.touches[0].pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
      };

      const handleTouchEnd = () => {
        isDown = false;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - element.offsetLeft;
        const walk = (x - startX) * 2;
        element.scrollLeft = scrollLeft - walk;
      };

      // Add event listeners
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('mouseup', handleMouseUp);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);
      element.addEventListener('touchmove', handleTouchMove);

      // Cleanup function
      return () => {
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('mouseup', handleMouseUp);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchmove', handleTouchMove);
      };
    };

    const firstRow = firstRowRef.current;
    const secondRow = secondRowRef.current;

    const cleanupFirstRow = firstRow ? setupScrolling(firstRow) : () => {};
    const cleanupSecondRow = secondRow ? setupScrolling(secondRow) : () => {};

    return () => {
      cleanupFirstRow();
      cleanupSecondRow();
    };
  }, []);

  // Add auto-scroll if needed for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      if (firstRowRef.current) {
        const firstRow = firstRowRef.current;
        if (firstRow.scrollWidth > firstRow.clientWidth) {
          firstRow.scrollBy({ left: 1, behavior: 'smooth' });
          if (firstRow.scrollLeft + firstRow.clientWidth >= firstRow.scrollWidth - 10) {
            firstRow.scrollLeft = 0;
          }
        }
      }
      
      if (secondRowRef.current) {
        const secondRow = secondRowRef.current;
        if (secondRow.scrollWidth > secondRow.clientWidth) {
          secondRow.scrollBy({ left: 1, behavior: 'smooth' });
          if (secondRow.scrollLeft + secondRow.clientWidth >= secondRow.scrollWidth - 10) {
            secondRow.scrollLeft = 0;
          }
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // If no reviews, don't show anything
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative overflow-hidden">
      {/* Gradient overlay left */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-32 sm:w-40 md:w-48 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 15%, rgba(255, 255, 255, 0.85) 30%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0.3) 75%, rgba(255, 255, 255, 0) 100%)'
        }}
      />
      
      {/* Gradient overlay right */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-32 sm:w-40 md:w-48 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(270deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 15%, rgba(255, 255, 255, 0.85) 30%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0.3) 75%, rgba(255, 255, 255, 0) 100%)'
        }}
      />
      
      <div 
        className="px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12 relative"
        style={{
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 16.67%, rgba(255, 255, 255, 0.98) 33.33%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.98) 66.67%, rgba(255, 255, 255, 0.95) 83.33%, rgba(255, 255, 255, 0) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="py-4 sm:py-6 md:py-8">
            {/* First Row */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <h3 className="text-lg sm:text-xl font-medium mb-4 text-center">
                Customer Reviews
              </h3>
              <div 
                ref={firstRowRef}
                className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4 relative"
                style={{ 
                  cursor: 'grab',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  // Ensure it can scroll horizontally
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {/* Add some extra padding to ensure overflow */}
                <div className="min-w-[20px] flex-shrink-0" />
                
                {firstRowReviews.map((review, index) => (
                  <div 
                    key={`first-${review.id}-${index}`}
                    className="flex-shrink-0"
                    style={{ width: `${cardWidth}px` }}
                  >
                    <div className="h-full">
                      <ReviewCard review={review} />
                    </div>
                  </div>
                ))}
                
                {/* Add some extra padding to ensure overflow */}
                <div className="min-w-[20px] flex-shrink-0" />
              </div>
            </div>

            {/* Second Row */}
            <div>
              <div 
                ref={secondRowRef}
                className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4 relative"
                style={{ 
                  cursor: 'grab',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  // Ensure it can scroll horizontally
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {/* Add some extra padding to ensure overflow */}
                <div className="min-w-[20px] flex-shrink-0" />
                
                {secondRowReviews.map((review, index) => (
                  <div 
                    key={`second-${review.id}-${index}`}
                    className="flex-shrink-0"
                    style={{ width: `${cardWidth}px` }}
                  >
                    <div className="h-full">
                      <ReviewCard review={review} />
                    </div>
                  </div>
                ))}
                
                {/* Add some extra padding to ensure overflow */}
                <div className="min-w-[20px] flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .active {
          cursor: grabbing;
          user-select: none;
        }
        
        /* Ensure proper scrolling behavior */
        [ref] {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}