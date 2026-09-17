import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

// Representative sample of FAQs for JSON-LD rich results.
// Must exactly match the visible questions/answers on the page.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I place an order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Browse our products, add items to your cart, and proceed to checkout. You can pay via credit/debit card, bank transfer, or cash on delivery.",
      },
    },
    {
      "@type": "Question",
      name: "What payment methods do you accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept credit/debit cards (Visa, Mastercard), bank transfers, EasyPaisa, JazzCash, and cash on delivery (COD).",
      },
    },
    {
      "@type": "Question",
      name: "How long does delivery take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Delivery takes 2-3 days for major cities, 3-5 days for other cities, and 5-7 days for remote areas.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer free shipping?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We offer free shipping on all orders above PKR 5,000.",
      },
    },
    {
      "@type": "Question",
      name: "What is your return policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can return unopened products within 7 days of delivery for a full refund. The product must be in its original packaging.",
      },
    },
    {
      "@type": "Question",
      name: "Are your products 100% natural?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! All our products are sourced from trusted suppliers and are 100% natural, free from artificial additives and preservatives.",
      },
    },
    {
      "@type": "Question",
      name: "How can I track my order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You'll receive a tracking number via email and SMS once your order is dispatched. Use this number on our website to track your package.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about Pansari Inn products, shipping, returns, payments, and more. Get answers to common queries.',
  alternates: { canonical: `${SITE_URL}/faqs` },
  openGraph: {
    title: 'FAQs | Pansari Inn',
    description: 'Frequently asked questions about Pansari Inn products, shipping, returns, and payments.',
    url: `${SITE_URL}/faqs`,
    type: 'website',
    siteName: 'Pansari Inn',
  },
  twitter: {
    card: 'summary',
    title: 'FAQs | Pansari Inn',
    description: 'Frequently asked questions about Pansari Inn products, shipping, returns, and payments.',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
