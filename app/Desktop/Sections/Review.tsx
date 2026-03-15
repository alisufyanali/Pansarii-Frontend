'use client';

import { useRef } from 'react';
import ReviewCard from '@components/ReviewCard';

export default function Review() {
  const reviewVideo = '/videos/review-video.mp4';
  const productImg = '/images/product.png';

  const reviews = [
    { title: "Very satisfied with this herbal product", text: "Using this product daily feels reassuring because it's made with traditional herbal ingredients. I've noticed a clear improvement within a few weeks, and it fits perfectly into a natural wellness routine.", name: "Ahmed R", designation: "Founder, creative studio", video: reviewVideo, img: productImg },
    { title: "Amazing results", text: "I've tried many herbal products before, but this one really works! My skin feels healthier and more radiant.", name: "Sara K", designation: "Wellness Blogger", video: reviewVideo, img: productImg },
    { title: "Highly recommended", text: "This herbal product exceeded my expectations. I love the natural ingredients and the results are visible within days!", name: "Ali M", designation: "Health Enthusiast", video: reviewVideo, img: productImg },
    { title: "My daily ritual", text: "Incorporating this product into my daily routine has been amazing. It's gentle, effective, and very reliable.", name: "Fatima S", designation: "Nutrition Expert", video: reviewVideo, img: productImg },
    { title: "Simply wonderful", text: "The quality of this herbal product is outstanding. I feel more energetic and healthy every day.", name: "Omar A", designation: "Fitness Coach", video: reviewVideo, img: productImg },
    { title: "Great value", text: "Not only does this work effectively, but it's also reasonably priced compared to other herbal options.", name: "Hina R", designation: "Lifestyle Blogger", video: reviewVideo, img: productImg },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  const onMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    startX = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft = scrollRef.current?.scrollLeft || 0;
    if (scrollRef.current) scrollRef.current.classList.add('cursor-grabbing');
  };

  const onMouseLeave = () => {
    isDown = false;
    if (scrollRef.current) scrollRef.current.classList.remove('cursor-grabbing');
  };

  const onMouseUp = () => {
    isDown = false;
    if (scrollRef.current) scrollRef.current.classList.remove('cursor-grabbing');
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="my-6 md:my-8 lg:my-10 2xl:my-12 mx-[4%]">
      <div className="max-w-[1920px] mx-auto">
        {/* Heading - Smaller fonts and reduced spacing */}
        <div className="text-center mb-6 md:mb-8 lg:mb-10 2xl:mb-12">
          <h1 className="font-poppins font-semibold text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl leading-tight capitalize">
            Loved By Over +70,000 Smiles!
          </h1>
          <p className="font-poppins font-normal text-xs md:text-sm lg:text-base 2xl:text-lg leading-relaxed mt-2 md:mt-2.5 lg:mt-3 text-gray-700 max-w-3xl mx-auto">
            Herbal care so natural and effective, you'll love using it every day — just ask our customers.
          </p>
        </div>

        {/* Reviews Slider - Smaller card widths */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 lg:gap-5 overflow-x-auto overflow-y-hidden no-scrollbar cursor-grab pb-3"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] xl:w-[340px] 2xl:w-[360px]"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}