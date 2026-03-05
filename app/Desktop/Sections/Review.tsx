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
    <section className="my-8 md:my-10 lg:my-12 2xl:my-16 mx-[4%]">
      <div className="max-w-[1920px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12 2xl:mb-16">
          <h1 className="font-poppins font-semibold text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl leading-tight capitalize">
            Loved By Over +70,000 Smiles!
          </h1>
          <p className="font-poppins font-normal text-sm md:text-base lg:text-lg 2xl:text-xl leading-relaxed mt-2 md:mt-3 lg:mt-4 text-gray-700 max-w-4xl mx-auto">
            Herbal care so natural and effective, you'll love using it every day — just ask our customers.
          </p>
        </div>

        {/* Reviews Slider */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto overflow-y-hidden no-scrollbar cursor-grab pb-4"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] xl:w-[440px] 2xl:w-[500px]"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}