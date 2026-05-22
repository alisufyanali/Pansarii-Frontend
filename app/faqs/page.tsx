// app/faqs/page.tsx
'use client';

import { useState } from 'react';
import { FaChevronDown, FaSearch, FaQuestionCircle, FaShoppingCart, FaTruck, FaUndo, FaLeaf, FaUser, FaEllipsisH } from 'react-icons/fa';

import PageBanner from '@/components/PageBanner';
const faqData = {
  hero: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about Pansariin.pk",
    description: "Can't find what you're looking for? Contact our support team."
  },
  categories: [
    {
      id: "orders",
      name: "Orders & Payment",
      icon: "orders",
      faqs: [
        {
          question: "How do I place an order?",
          answer: "Browse our products, add items to your cart, and proceed to checkout. You can pay via credit/debit card, bank transfer, or cash on delivery."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept credit/debit cards (Visa, Mastercard), bank transfers, EasyPaisa, JazzCash, and cash on delivery (COD)."
        },
        {
          question: "Is it safe to use my credit card on your website?",
          answer: "Yes, absolutely! We use industry-standard SSL encryption to protect your payment information. Your card details are never stored on our servers."
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "You can modify or cancel your order within 2 hours of placement by contacting customer support. After dispatch, orders cannot be cancelled."
        },
        {
          question: "Do you offer COD (Cash on Delivery)?",
          answer: "Yes, we offer COD for all locations across Pakistan. A small COD fee may apply depending on your location."
        }
      ]
    },
    {
      id: "shipping",
      name: "Shipping & Delivery",
      icon: "shipping",
      faqs: [
        {
          question: "How long does delivery take?",
          answer: "Delivery takes 2-3 days for major cities, 3-5 days for other cities, and 5-7 days for remote areas."
        },
        {
          question: "Do you offer free shipping?",
          answer: "Yes! We offer free shipping on all orders above PKR 2,000."
        },
        {
          question: "How can I track my order?",
          answer: "You'll receive a tracking number via email and SMS once your order is dispatched. Use this number on our website to track your package."
        },
        {
          question: "What if I'm not home during delivery?",
          answer: "The courier will attempt delivery up to 3 times. You can also coordinate with the courier to arrange a convenient delivery time."
        },
        {
          question: "Do you ship internationally?",
          answer: "Currently, we only ship within Pakistan. International shipping is coming soon!"
        }
      ]
    },
    {
      id: "returns",
      name: "Returns & Refunds",
      icon: "returns",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "You can return unopened products within 7 days of delivery for a full refund. The product must be in its original packaging."
        },
        {
          question: "How do I initiate a return?",
          answer: "Contact our customer support via phone, email, or WhatsApp within 7 days of delivery to initiate a return."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 5-7 business days after we receive and inspect the returned item."
        },
        {
          question: "Can I return opened products?",
          answer: "For hygiene reasons, we cannot accept returns for opened herbal products unless they are defective or damaged."
        },
        {
          question: "Who pays for return shipping?",
          answer: "Return shipping costs are the customer's responsibility unless the item is defective or we sent the wrong product."
        }
      ]
    },
    {
      id: "products",
      name: "Products & Quality",
      icon: "products",
      faqs: [
        {
          question: "Are your products 100% natural?",
          answer: "Yes! All our products are 100% natural and free from harmful chemicals, artificial additives, and preservatives."
        },
        {
          question: "Are your products lab-tested?",
          answer: "Yes, all our products undergo rigorous quality testing to ensure purity, safety, and effectiveness."
        },
        {
          question: "How do I know which product is right for me?",
          answer: "Each product page has detailed information about benefits and usage. You can also contact our ayurvedic experts for personalized recommendations."
        },
        {
          question: "Do you offer product samples?",
          answer: "Currently, we don't offer samples. However, we have a generous return policy if you're not satisfied with your purchase."
        },
        {
          question: "What is the shelf life of your products?",
          answer: "Shelf life varies by product. All products have the manufacturing and expiry date clearly printed on the packaging."
        }
      ]
    },
    {
      id: "account",
      name: "Account & Privacy",
      icon: "account",
      faqs: [
        {
          question: "Do I need an account to place an order?",
          answer: "No, you can checkout as a guest. However, creating an account helps you track orders, save addresses, and earn rewards."
        },
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we use industry-standard encryption and never share your personal information with third parties."
        },
        {
          question: "Can I change my email address?",
          answer: "Yes, you can update your email address in your account settings or by contacting customer support."
        },
        {
          question: "How do I unsubscribe from emails?",
          answer: "Click the 'Unsubscribe' link at the bottom of any promotional email or update your preferences in account settings."
        }
      ]
    },
    {
      id: "other",
      name: "Other Questions",
      icon: "other",
      faqs: [
        {
          question: "Do you have a physical store?",
          answer: "We are currently an online-only store, but we plan to open physical locations in major cities soon."
        },
        {
          question: "Can I buy products in bulk?",
          answer: "Yes! Contact our sales team for bulk orders and special pricing for businesses and retailers."
        },
        {
          question: "Do you offer wholesale prices?",
          answer: "Yes, we offer wholesale rates for bulk purchases. Contact us at wholesale@pansariin.pk for more information."
        },
        {
          question: "How can I become an affiliate?",
          answer: "Join our affiliate program to earn commissions on sales. Visit our Affiliate page or contact affiliate@pansariin.pk."
        },
        {
          question: "Do you have a mobile app?",
          answer: "Yes! Download our mobile app from the App Store or Google Play for a better shopping experience."
        }
      ]
    }
  ]
};

const getCategoryIcon = (icon: string) => {
  switch(icon) {
    case 'orders':   return <FaShoppingCart className="w-4 h-4" />;
    case 'shipping': return <FaTruck className="w-4 h-4" />;
    case 'returns':  return <FaUndo className="w-4 h-4" />;
    case 'products': return <FaLeaf className="w-4 h-4" />;
    case 'account':  return <FaUser className="w-4 h-4" />;
    default:         return <FaEllipsisH className="w-4 h-4" />;
  }
};

export default function FAQsPage() {
  const [selectedCategory, setSelectedCategory] = useState(faqData.categories[0].id);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCategoryData = faqData.categories.find(cat => cat.id === selectedCategory);
  
  const filteredFaqs = searchQuery 
    ? faqData.categories.flatMap(cat => 
        cat.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(faq => ({ ...faq, category: cat.name }))
      )
    : selectedCategoryData?.faqs || [];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero */}
      <PageBanner
        icon={<FaQuestionCircle className="w-8 h-8" />}
        title={faqData.hero.title}
        subtitle={faqData.hero.subtitle}
      >
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </PageBanner>

      <div className="max-w-[1920px] mx-auto px-[4%] py-8">
        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          
          {/* Categories Sidebar */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Categories</h3>
            {faqData.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSearchQuery('');
                  setOpenFaqIndex(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                  selectedCategory === category.id 
                    ? 'bg-green-700 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={selectedCategory === category.id ? 'text-white' : 'text-green-700'}>
                  {getCategoryIcon(category.icon)}
                </span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* FAQs */}
          <div>
            {searchQuery && (
              <div className="mb-6">
                <p className="text-gray-600">
                  Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              </div>
            )}

            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {searchQuery && ('category' in faq) && (
                          <p className="text-sm text-gray-500 mt-1">{faq.category}</p>
                        )}
                      </div>
                      <FaChevronDown 
                        className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                          openFaqIndex === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {openFaqIndex === idx && (
                      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try different keywords or browse categories
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* CTA */}
      <section className="py-8 bg-white">
        <div className="max-w-3xl mx-auto px-[4%] text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h2>
          <p className="text-sm text-gray-600 mb-5">{faqData.hero.description}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/contact" className="px-6 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-600 transition font-semibold text-sm">
              Contact Support
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
