/**
 * lib/reviews.ts
 * Homepage customer reviews from Laravel.
 */

import { api } from './axios';

export interface HomepageReviewProduct {
  id: number;
  name: string;
  slug?: string;
  thumbnail?: string | null;
}

export interface HomepageReview {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  product?: HomepageReviewProduct | null;
}

/** Card shape used by ReviewCard / mobile review UI */
export interface ReviewCardData {
  id: number;
  title: string;
  text: string;
  name: string;
  designation: string;
  img: string;
  rating: number;
  images?: string[];
  productName?: string;
  productImage?: string;
}

export const DEFAULT_REVIEWS: ReviewCardData[] = [
  {
    id: 1,
    title: 'Amazing Product Quality',
    text: 'This apricot oil has transformed my skin completely. I\'ve been using it for a month and my skin feels so hydrated and glowing.',
    name: 'Sarah Khan',
    designation: 'Beauty Blogger',
    img: '/images/product.png',
    rating: 5.0,
    images: ['/images/product.png'],
  },
  {
    id: 2,
    title: 'Best Purchase Ever',
    text: 'The quality is outstanding. It\'s pure and natural just as described. Will definitely repurchase and recommend to friends.',
    name: 'Ali Ahmed',
    designation: 'Regular Customer',
    img: '/images/product.png',
    rating: 5.0,
  },
];

export function mapHomepageReviewToCard(review: HomepageReview): ReviewCardData {
  const productName = review.product?.name;
  const productImage = review.product?.thumbnail || undefined;

  return {
    id: review.id,
    title: productName ?? 'Great Experience',
    text: review.comment,
    name: review.customer_name,
    designation: productName ?? 'Verified Customer',
    img: productImage ?? '/images/product.png',
    rating: review.rating,
    images: productImage ? [productImage] : undefined,
    productName,
    productImage,
  };
}

export async function getHomepageReviews(): Promise<HomepageReview[]> {
  const res = await api.get<{ success: boolean; data: HomepageReview[] }>('/homepage/reviews');
  return res.data ?? [];
}
