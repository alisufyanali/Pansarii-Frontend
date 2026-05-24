/**
 * Centralized social media links configuration
 * Can be overridden via environment variables
 */
export const SOCIAL_LINKS = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/pansariin.pk',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/pansariin.pk',
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/pansariin',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/pansariin',
} as const;
