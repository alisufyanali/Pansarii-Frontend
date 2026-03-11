// app/pages/aboutus.tsx
"use client";

import BlogCard from "../Desktop/components/BlogCard";
import ReviewCard from "../Desktop/components/ReviewCard";
import Footer from "../Desktop/Sections/Footer";
import { FaCheckCircle, FaLeaf, FaShippingFast, FaShieldAlt, FaGift, FaHeadset, FaMedkit } from "react-icons/fa";
// import { motion } from "framer-motion";

// Data configuration - easy to update
const pageData = {
  hero: {
    title: "About",
    highlight: "Pansari Inn",
    subtitle: "Your trusted partner for 100% pure natural herbs and herbal products"
  },
  mission: {
    title: "Our Mission & Story",
    paragraphs: [
      "Pansari Inn came into existence to eliminate problems of consumers regarding availability of natural herbs and herbal products to their doorsteps without being double crossed by local shops providing un-hygiene herbs sometimes end up as disappointment to consumer.",
      "In the same aspects consumers are being troubled and frustrated in availability of certain herbs in local market. Pansari Inn rationality is to give access of pure herbs and herbal product to each and every individuals in Pakistan beyond boundaries.",
      "With the tremendous collection of the finest branded Natural herbs for those who are looking for a better health without any side effects. Pansari Inn constantly provides description with innovative solutions and support for today's health and nutrition related natural herbs for our consumers."
    ],
    image: "/images/about-us/hero.jpg",
    imageAlt: "Pansari Inn Herbs Collection"
  },
  quality: {
    title: "Our Commitment to Quality",
    description: "Products at PansariInn are 100% pure natural and healthy living. The herbs are hygienic and cleaned perfectly in accordance to enhance the maximum benefits."
  },
  features: [
    { icon: FaLeaf, title: "100% Natural", description: "No artificial colors, fragrances or harmful additives" },
    { icon: FaCheckCircle, title: "Quality Assured", description: "Authentic & genuine products with no adulteration" },
    { icon: FaShippingFast, title: "Fast Delivery", description: "Doorstep delivery across Pakistan" },
    { icon: FaShieldAlt, title: "Secure Shopping", description: "100% secure payment with buyer protection" },
    { icon: FaGift, title: "Surprise Gifts", description: "Special gifts & coupons for regular customers" },
    { icon: FaHeadset, title: "24/7 Support", description: "Customer care support always available" },
    { icon: FaMedkit, title: "Health Focus", description: "Products curated for better health without side effects" },
  ],
  cards: [
    {
      type: "vision",
      title: "Our Vision",
      content: "To bring the world class techniques and practices for ensuring customer happiness and complete satisfaction through Online Shopping with us.",
      gradient: "from-green-100 to-emerald-100"
    },
    {
      type: "motto",
      title: "Our Motto",
      content: "To Provide Superior Quality Of All Kind Of Ancient Herbal Products, Herbal Medicine, Raw Herbs, and Dried Medicinal Plants at Competitive Price Directly Within A Click.",
      gradient: "from-amber-100 to-yellow-100"
    },
    {
      type: "values",
      title: "Our Values",
      content: "PansariInn is Pure. Our treatments are 100% natural, vegetarian and use the highest quality of natural ingredients.",
      gradient: "from-blue-100 to-cyan-100",
      list: [
        "No artificial colors",
        "No artificial fragrance",
        "No harmful additives"
      ]
    }
  ],
  whyChooseUs: {
    title: "Why Choose Pansari Inn?",
    items: [
      "Widest Collection across Categories",
      "Unbelievable Prices",
      "Doorstep Delivery",
      "Fast shipping through recognized courier agency",
      "100% Secure Payment through renowned Payment Gateway",
      "Safe and secure portal with SSL registration",
      "Product Returns & refund*",
      "Customer Care Support",
      "Surprise gifts / coupons for the regular customers",
      "Track your Order status & history",
      "Cash on Delivery Available",
      "Free Shipping On Order Above 5000"
    ]
  },
  blogPosts: [
    {
      id: 1,
      img: "/images/blog/herbal-benefits.jpg",
      title: "Benefits of Herbal Medicine",
      content: "Discover how natural herbs can transform your health and wellbeing through ancient wisdom and modern science combined.",
      link: "/blog/herbal-benefits"
    },
    {
      id: 2,
      img: "/images/blog/ayurveda-guide.jpg",
      title: "Complete Guide to Ayurveda",
      content: "Learn about the ancient Indian healing system and how to incorporate it into your modern lifestyle effectively.",
      link: "/blog/ayurveda-guide"
    },
    {
      id: 3,
      img: "/images/blog/skin-care-herbs.jpg",
      title: "Natural Skin Care Herbs",
      content: "Top 10 herbs for glowing skin and how to use them effectively in your daily beauty routine.",
      link: "/blog/skin-care-herbs"
    },
    {
      id: 4,
      img: "/images/blog/detox-teas.jpg",
      title: "Detoxifying Herbal Teas",
      content: "Prepare natural detox teas at home using these powerful herbs for complete body cleanse and rejuvenation.",
      link: "/blog/detox-teas"
    }
  ],
  testimonials: [
    {
      id: 1,
      title: "Life Changing Experience",
      text: "Pansari Inn's products have transformed my health completely. The quality is exceptional and I feel the difference in my energy levels. Highly recommended!",
      name: "Sarah Khan",
      designation: "Regular Customer for 2 years",
      img: "/images/reviewers/sarah.jpg",
      rating: 5.0
    },
    {
      id: 2,
      title: "Pure & Authentic Products",
      text: "Finally found a place that delivers 100% pure herbs. The packaging is professional and products are exactly as described. Will buy again!",
      name: "Ali Ahmed",
      designation: "Ayurveda Practitioner",
      img: "/images/reviewers/ali.jpg",
      rating: 5.0
    },
    {
      id: 3,
      title: "Excellent Customer Service",
      text: "Their customer support team is amazing. Helped me choose the right herbs for my needs and followed up to ensure satisfaction. Great experience!",
      name: "Fatima Noor",
      designation: "Wellness Coach",
      img: "/images/reviewers/fatima.jpg",
      rating: 5.0
    },
    {
      id: 4,
      title: "Trustworthy & Reliable",
      text: "As someone who values authenticity, I can confidently say Pansari Inn delivers what they promise. Highly recommended for herbal products!",
      name: "Hamza Riaz",
      designation: "Naturopath",
      img: "/images/reviewers/hamza.jpg",
      rating: 5.0
    }
  ],
  cta: {
    title: "YOUR HEALTH IS IN RELIABLE HANDS",
    description: "Pansari Inn is dedicated to promote uses of Natural herbs and bringing their magical benefits to common man.",
    buttons: [
      { text: "Shop Now", type: "primary", link: "/shop" },
      { text: "Contact Us", type: "secondary", link: "/contact" }
    ]
  }
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-emerald-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {pageData.hero.title} <span className="text-[#197B33]">{pageData.hero.highlight}</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
              {pageData.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text first on mobile, left on desktop */}
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{pageData.mission.title}</h2>
            <div className="space-y-4 text-gray-700">
              {pageData.mission.paragraphs.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-base sm:text-lg" : "text-sm sm:text-base"}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Image first on mobile (shows above text), right on desktop */}
          <div className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={pageData.mission.image}
              alt={pageData.mission.imageAlt}
              className="w-full h-56 sm:h-72 lg:h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Quality Assurance Section */}
      <section className="bg-green-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{pageData.quality.title}</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
              {pageData.quality.description}
            </p>
          </div>

          {/* 2 col on mobile, 4 col on large */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {pageData.features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-2xl sm:text-3xl text-[#197B33] mb-3 sm:mb-4 flex justify-center">
                    <IconComponent />
                  </div>
                  <h3 className="text-sm sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision & Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pageData.cards.map((card, index) => (
            <div key={index} className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 sm:p-8 hover:scale-105 transition-transform duration-300`}>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
              <p className="text-sm sm:text-base text-gray-700">{card.content}</p>
              {card.list && (
                <ul className="mt-4 space-y-2 text-gray-700">
                  {card.list.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm sm:text-base">
                      <FaCheckCircle className="text-green-600 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">{pageData.whyChooseUs.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pageData.whyChooseUs.items.map((item, index) => (
              <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FaCheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {pageData.testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex justify-center">
              <ReviewCard review={testimonial} />
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section - commented out exactly as original */}
      {/* <section className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest From Our Blog</h2>
            <button className="px-6 py-3 bg-[#197B33] text-white rounded-lg hover:bg-[#156529] transition-colors">
              View All Articles
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pageData.blogPosts.map((post) => (
              <div key={post.id} className="flex justify-center">
                <BlogCard blog={post} />
              </div>
            ))}
          </div>
        </div>
      </section> */}

      
    </div>
  );
}