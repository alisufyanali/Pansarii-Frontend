// app/our-story/page.tsx
'use client';

import { FaLeaf, FaHeart, FaSeedling, FaAward } from 'react-icons/fa';

// JSON Data
const ourStoryData = {
  hero: {
    title: "Our Story",
    subtitle: "Bringing Ancient Wisdom to Modern Life",
    description: "Discover how Pansariin.pk became Pakistan's trusted source for authentic herbal and ayurvedic products."
  },
  journey: {
    title: "Our Journey",
    content: [
      "Founded in 2020, Pansariin.pk started with a simple mission: to make authentic, high-quality herbal products accessible to every Pakistani household. What began as a small family business in Karachi has grown into Pakistan's leading online platform for ayurvedic and herbal remedies.",
      "Our founders, inspired by centuries-old traditional medicine practices, recognized the growing disconnect between modern consumers and natural healing solutions. They set out to bridge this gap by creating a trusted marketplace where quality, authenticity, and customer education come first.",
      "Today, we serve thousands of customers across Pakistan, offering over 500 carefully curated products from trusted suppliers and manufacturers. Every product in our catalog is tested for purity and authenticity, ensuring that our customers receive only the best nature has to offer."
    ]
  },
  mission: {
    title: "Our Mission",
    statement: "To empower people to take control of their health through natural, authentic herbal products backed by traditional wisdom and modern quality standards.",
    values: [
      {
        icon: "🌿",
        title: "100% Natural",
        description: "We believe in the power of nature. All our products are free from harmful chemicals and artificial additives."
      },
      {
        icon: "✓",
        title: "Quality Assured",
        description: "Every product undergoes rigorous testing to ensure it meets our strict quality and purity standards."
      },
      {
        icon: "📚",
        title: "Education First",
        description: "We educate our customers about herbal remedies, helping them make informed decisions about their health."
      },
      {
        icon: "🤝",
        title: "Trust & Transparency",
        description: "We build long-term relationships with our customers through honest communication and reliable service."
      }
    ]
  },
  milestones: [
    { year: "2020", title: "Foundation", description: "Pansariin.pk was founded in Karachi with 50 products" },
    { year: "2021", title: "Expansion", description: "Reached 10,000+ customers and expanded to 200+ products" },
    { year: "2022", title: "Recognition", description: "Won 'Best Herbal E-commerce Platform' award" },
    { year: "2023", title: "Growth", description: "Launched mobile app and reached 50,000+ customers" },
    { year: "2024", title: "Innovation", description: "Introduced AI-powered product recommendations" },
    { year: "2025", title: "Present", description: "500+ products, 100,000+ happy customers nationwide" }
  ],
  team: {
    title: "Our Leadership",
    description: "Meet the passionate team behind Pansariin.pk",
    members: [
      {
        name: "Ahmed Ali Khan",
        role: "Founder & CEO",
        bio: "15+ years in herbal medicine industry",
        image: "/images/team-placeholder.jpg"
      },
      {
        name: "Dr. Fatima Noor",
        role: "Chief Medical Advisor",
        bio: "PhD in Ayurvedic Medicine",
        image: "/images/team-placeholder.jpg"
      },
      {
        name: "Bilal Hassan",
        role: "Head of Operations",
        bio: "Expert in supply chain management",
        image: "/images/team-placeholder.jpg"
      },
      {
        name: "Ayesha Rahman",
        role: "Customer Experience Lead",
        bio: "Passionate about customer satisfaction",
        image: "/images/team-placeholder.jpg"
      }
    ]
  },
  stats: [
    { number: "500+", label: "Products" },
    { number: "100K+", label: "Happy Customers" },
    { number: "50+", label: "Cities Served" },
    { number: "4.8★", label: "Average Rating" }
  ]
};

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-16 sm:py-24">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              {ourStoryData.hero.title}
            </h1>
            <p className="text-xl sm:text-2xl mb-4 text-green-100">
              {ourStoryData.hero.subtitle}
            </p>
            <p className="text-base sm:text-lg text-green-100">
              {ourStoryData.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-[4%]">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 text-center">
            {ourStoryData.journey.title}
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            {ourStoryData.journey.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {ourStoryData.stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              {ourStoryData.mission.title}
            </h2>
            <p className="text-lg text-gray-700">
              {ourStoryData.mission.statement}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ourStoryData.mission.values.map((value, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-[4%]">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-900 text-center">
            Our Milestones
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200"></div>
            
            <div className="space-y-8">
              {ourStoryData.milestones.map((milestone, idx) => (
                <div key={idx} className={`flex flex-col lg:flex-row gap-8 items-center ${idx % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${idx % 2 === 0 ? 'lg:text-right' : ''}`}>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="text-green-700 font-bold text-xl mb-2">{milestone.year}</div>
                      <h3 className="font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center font-bold shadow-lg z-10">
                    {idx + 1}
                  </div>
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              {ourStoryData.team.title}
            </h2>
            <p className="text-lg text-gray-600">
              {ourStoryData.team.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ourStoryData.team.members.map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/team-placeholder.jpg';
                    }}
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                <p className="text-green-700 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-700 to-emerald-700 text-white">
        <div className="max-w-3xl mx-auto px-[4%] text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-lg text-green-100 mb-8">
            Be part of Pakistan's herbal revolution. Start your wellness journey with us today.
          </p>
          <button className="px-8 py-4 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition font-semibold text-lg">
            Explore Products
          </button>
        </div>
      </section>

    </div>
  );
}