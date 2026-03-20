// app/careers/page.tsx
'use client';

import { useState } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaUserTie, FaChevronRight } from 'react-icons/fa';

// JSON Data
const careersData = {
  hero: {
    title: "Join Our Team",
    subtitle: "Build Your Career with Pansariin.pk",
    description: "We're looking for passionate individuals to help us revolutionize the herbal products industry in Pakistan."
  },
  openPositions: [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Karachi, Pakistan",
      type: "Full-time",
      salary: "PKR 150,000 - 250,000",
      description: "We're looking for an experienced full-stack developer to join our growing team.",
      requirements: [
        "5+ years of experience with React/Next.js",
        "Strong knowledge of Node.js and Express",
        "Experience with TypeScript",
        "E-commerce platform development experience"
      ]
    },
    {
      id: 2,
      title: "Digital Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      salary: "PKR 100,000 - 180,000",
      description: "Lead our digital marketing efforts and grow our online presence.",
      requirements: [
        "3+ years of digital marketing experience",
        "SEO/SEM expertise",
        "Social media marketing experience",
        "Data-driven approach to marketing"
      ]
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "Karachi, Pakistan",
      type: "Full-time",
      salary: "PKR 120,000 - 200,000",
      description: "Define product strategy and roadmap for our herbal products platform.",
      requirements: [
        "4+ years of product management experience",
        "E-commerce background preferred",
        "Strong analytical skills",
        "Excellent communication abilities"
      ]
    },
    {
      id: 4,
      title: "Customer Success Associate",
      department: "Customer Success",
      location: "Karachi, Pakistan",
      type: "Full-time",
      salary: "PKR 60,000 - 90,000",
      description: "Ensure our customers have an exceptional experience with our products.",
      requirements: [
        "2+ years of customer service experience",
        "Excellent Urdu and English communication",
        "Problem-solving mindset",
        "Empathy and patience"
      ]
    }
  ],
  benefits: [
    { icon: "💰", title: "Competitive Salary", description: "Market-leading compensation packages" },
    { icon: "🏥", title: "Health Insurance", description: "Comprehensive medical coverage" },
    { icon: "🏖️", title: "Paid Time Off", description: "Generous vacation and sick leave" },
    { icon: "📚", title: "Learning Budget", description: "Annual budget for courses and books" },
    { icon: "🏠", title: "Remote Flexibility", description: "Work from home options available" },
    { icon: "🎉", title: "Team Events", description: "Regular team building activities" }
  ],
  culture: {
    title: "Our Culture",
    description: "At Pansariin.pk, we believe in creating a workplace where everyone can thrive. Our culture is built on transparency, collaboration, and continuous learning.",
    values: [
      { title: "Customer First", description: "Everything we do is focused on delivering value to our customers" },
      { title: "Innovation", description: "We encourage creative thinking and new approaches" },
      { title: "Integrity", description: "We operate with honesty and strong moral principles" },
      { title: "Growth", description: "We invest in our team's personal and professional development" }
    ]
  }
};

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-16 sm:py-20">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{careersData.hero.title}</h1>
            <p className="text-xl sm:text-2xl mb-4 text-green-100">{careersData.hero.subtitle}</p>
            <p className="text-base sm:text-lg text-green-100">{careersData.hero.description}</p>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">Open Positions</h2>
          
          <div className="grid gap-6">
            {careersData.openPositions.map((job) => (
              <div 
                key={job.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-green-500 transition-all overflow-hidden"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FaBriefcase className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaMoneyBillWave className="w-4 h-4" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 whitespace-nowrap">
                      <span>View Details</span>
                      <FaChevronRight className={`w-4 h-4 transition-transform ${selectedJob === job.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Job Details */}
                {selectedJob === job.id && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">About the Role</h4>
                        <p className="text-gray-600 mb-4">{job.description}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Requirements</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600">
                              <span className="text-green-600 mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition font-semibold">
                        Apply Now
                      </button>
                      <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold">
                        Share Job
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 text-center">Benefits & Perks</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careersData.benefits.map((benefit, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">{careersData.culture.title}</h2>
            <p className="text-lg text-gray-600">{careersData.culture.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {careersData.culture.values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-green-700 to-emerald-700">
        <div className="max-w-[1920px] mx-auto px-[4%] text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Don't See a Perfect Fit?</h2>
          <p className="text-lg text-green-100 mb-6">Send us your resume anyway! We're always looking for talented people.</p>
          <button className="px-8 py-4 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition font-semibold text-lg">
            Send Your Resume
          </button>
        </div>
      </section>

    </div>
  );
}