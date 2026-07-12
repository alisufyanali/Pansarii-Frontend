'use client';

import { useRef, useState, useEffect } from 'react';
import ReviewCard from '@components/ReviewCard';
import ForwardArrow from '@components/ForwardArrow';
import BackwardArrow from '@components/BackwardArrow';
import {
  mapHomepageReviewToCard,
  DEFAULT_REVIEWS,
  type HomepageReview,
} from '@/lib/reviews';

export default function Review({ reviews }: { reviews?: HomepageReview[] }) {
  const sliderRef        = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const scrollStart = useRef(0);

  const displayReviews = (reviews && reviews.length > 0
    ? reviews.map(mapHomepageReviewToCard)
    : DEFAULT_REVIEWS);

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector(".card-item") as HTMLElement;
    const step = card ? card.offsetWidth + 24 : 340;
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [displayReviews]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current  = true;
    startX.current      = e.pageX - (sliderRef.current?.offsetLeft ?? 0);
    scrollStart.current = sliderRef.current?.scrollLeft ?? 0;
    sliderRef.current?.classList.add('cursor-grabbing');
  };

  const onMouseLeave = () => { isDragging.current = false; sliderRef.current?.classList.remove('cursor-grabbing'); };
  const onMouseUp    = () => { isDragging.current = false; sliderRef.current?.classList.remove('cursor-grabbing'); };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    sliderRef.current.scrollLeft = scrollStart.current - (x - startX.current);
  };

  return (
    <section className="mx-[4%] my-8">
      <div className="max-w-[1920px] mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold">
              Loved By <span className="me-color-y">+70,000</span> Smiles!
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-lg">
              Herbal care so natural and effective — just ask our customers.
            </p>
          </div>
          <div className="flex gap-2">
            <BackwardArrow disabled={!canScrollLeft}  onClick={() => scroll("left")}  />
            <ForwardArrow  disabled={!canScrollRight} onClick={() => scroll("right")} />
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4 cursor-grab select-none"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {displayReviews.map((review, i) => (
            <div
              key={review.id ?? i}
              className="card-item flex-shrink-0"
              style={{ width: "calc((min(100vw, 1920px) - 8vw - 96px) / 4)" }}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
