'use client';

import { useState } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaChevronRight, FaMedkit, FaUmbrellaBeach, FaBook, FaHome, FaUsers } from 'react-icons/fa';
import PageBanner from '../components/PageBanner';
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
    { icon: 'salary',   title: 'Competitive Salary',  description: 'Market-leading compensation packages' },
    { icon: 'health',   title: 'Health Insurance',     description: 'Comprehensive medical coverage' },
    { icon: 'pto',      title: 'Paid Time Off',        description: 'Generous vacation and sick leave' },
    { icon: 'learning', title: 'Learning Budget',      description: 'Annual budget for courses and books' },
    { icon: 'remote',   title: 'Remote Flexibility',   description: 'Work from home options available' },
    { icon: 'team',     title: 'Team Events',          description: 'Regular team building activities' },
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

const benefitIcons: Record<string, React.ReactNode> = {
  salary:   <FaMoneyBillWave className="w-5 h-5 text-green-700" />,
  health:   <FaMedkit className="w-5 h-5 text-green-700" />,
  pto:      <FaUmbrellaBeach className="w-5 h-5 text-green-700" />,
  learning: <FaBook className="w-5 h-5 text-green-700" />,
  remote:   <FaHome className="w-5 h-5 text-green-700" />,
  team:     <FaUsers className="w-5 h-5 text-green-700" />,
};

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <PageBanner
        icon={<FaBriefcase className="w-8 h-8" />}
        title={careersData.hero.title}
        subtitle={careersData.hero.subtitle}
        description={careersData.hero.description}
      />

      {/* Open Positions */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold mb-5 text-gray-900">Open Positions</h2>
          <div className="grid gap-4">
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
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-[4%]">
          <h2 className="text-xl font-bold mb-5 text-gray-900 text-center">Benefits &amp; Perks</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {careersData.benefits.map((benefit, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-5 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  {benefitIcons[benefit.icon]}
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{benefit.title}</h3>
                <p className="text-gray-600 text-xs">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-[4%]">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2 text-gray-900">{careersData.culture.title}</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">{careersData.culture.description}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {careersData.culture.values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{value.title}</h3>
                <p className="text-gray-600 text-xs">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 bg-green-700 text-white text-center">
        <div className="max-w-xl mx-auto px-[4%]">
          <h2 className="text-lg font-bold mb-2">Don&apos;t See a Perfect Fit?</h2>
          <p className="text-sm text-green-100 mb-4">Send us your resume anyway! We&apos;re always looking for talented people.</p>
          <a href="mailto:careers@pansariin.pk" className="inline-block px-6 py-2.5 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition font-semibold text-sm">
            Send Your Resume
          </a>
        </div>
      </section>

    </div>
  );
}