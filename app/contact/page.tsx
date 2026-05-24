// app/contact/page.tsx
'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

import PageBanner from '@/components/PageBanner';

export const metadata: Metadata = {
  title: 'Contact Us | Pansari Inn',
  description: 'Get in touch with Pansari Inn. Contact us for inquiries, support, or questions about our natural herbal products. Phone, email, and WhatsApp support available.',
  keywords: ['contact pansari inn', 'customer support', 'herbal products inquiry', 'Pakistan'],
  openGraph: {
    title: 'Contact Us | Pansari Inn',
    description: 'Get in touch with Pansari Inn for inquiries and support',
    type: 'website',
  },
};

// JSON Data
const contactData = {
  hero: {
    title: "Get in Touch",
    subtitle: "We're Here to Help",
    description: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
  },
  contactInfo: [
    {
      icon: "phone",
      title: "Phone",
      value: "+92 300 1234567",
      link: `tel:+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`,
      description: "Mon-Sat: 9:00 AM - 6:00 PM"
    },
    {
      icon: "whatsapp",
      title: "WhatsApp",
      value: "+92 300 1234567",
      link: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`,
      description: "Chat with us instantly"
    },
    {
      icon: "email",
      title: "Email",
      value: "support@pansariin.pk",
      link: "mailto:support@pansariin.pk",
      description: "We'll reply within 24 hours"
    },
    {
      icon: "location",
      title: "Address",
      value: "Shop #123, Saddar, Karachi",
      link: "https://maps.google.com",
      description: "Visit our office"
    }
  ],
  departments: [
    { name: "General Inquiry", email: "info@pansariin.pk" },
    { name: "Customer Support", email: "support@pansariin.pk" },
    { name: "Sales & Orders", email: "sales@pansariin.pk" },
    { name: "Wholesale", email: "wholesale@pansariin.pk" },
    { name: "Marketing & PR", email: "marketing@pansariin.pk" },
  ],
  businessHours: {
    weekdays: "Monday - Saturday: 9:00 AM - 6:00 PM",
    weekend: "Sunday: Closed",
    holidays: "We're closed on public holidays"
  },
  social: [
    { platform: "Facebook", url: "https://facebook.com/pansariin.pk", icon: "facebook" },
    { platform: "Instagram", url: "https://instagram.com/pansariin.pk", icon: "instagram" },
    { platform: "Twitter", url: "https://twitter.com/pansariin", icon: "twitter" }
  ],
  faq: {
    title: "Quick Answers",
    questions: [
      { question: "What are your business hours?", answer: "Monday to Saturday, 9:00 AM - 6:00 PM" },
      { question: "How long does delivery take?", answer: "2-3 days for major cities, 3-7 days for other areas" },
      { question: "Do you accept returns?", answer: "Yes, within 7 days of delivery for unopened products" },
      { question: "Is COD available?", answer: "Yes, we offer Cash on Delivery across Pakistan" }
    ]
  }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getIcon = (iconName: string): React.ReactNode => {
    switch (iconName) {
      case 'phone':
        return <FaPhone className="w-6 h-6" />;
      case 'whatsapp':
        return <FaWhatsapp className="w-6 h-6" />;
      case 'email':
        return <FaEnvelope className="w-6 h-6" />;
      case 'location':
        return <FaMapMarkerAlt className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getSocialIcon = (iconName: string): React.ReactNode => {
    switch (iconName) {
      case 'facebook':
        return <FaFacebookF className="w-5 h-5" />;
      case 'instagram':
        return <FaInstagram className="w-5 h-5" />;
      case 'twitter':
        return <FaTwitter className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <PageBanner
        icon={<FaEnvelope className="w-8 h-8" />}
        title={contactData.hero.title}
        subtitle={contactData.hero.subtitle}
        description={contactData.hero.description}
      />

      {/* Contact Cards */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-[4%]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactData.contactInfo.map((info, idx) => (
              <a
                key={idx}
                href={info.link}
                target={info.icon === 'location' || info.icon === 'whatsapp' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition border-2 border-transparent hover:border-green-500"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  {getIcon(info.icon)}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-700 font-medium mb-1">{info.value}</p>
                <p className="text-sm text-gray-500">{info.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-[4%] py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          
          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                Thank you! Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a subject</option>
                  {contactData.departments.map((dept, idx) => (
                    <option key={idx} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-green-700 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Business Hours */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaClock className="w-6 h-6 text-green-700" />
                <h3 className="text-lg font-bold text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p>{contactData.businessHours.weekdays}</p>
                <p>{contactData.businessHours.weekend}</p>
                <p className="text-sm text-gray-500 pt-2">{contactData.businessHours.holidays}</p>
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Email by Department</h3>
              <div className="space-y-3">
                {contactData.departments.map((dept, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="font-medium text-gray-900">{dept.name}</div>
                    <a href={`mailto:${dept.email}`} className="text-green-700 hover:underline">
                      {dept.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {contactData.social.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-700 hover:text-white transition"
                    aria-label={social.platform}
                  >
                    {getSocialIcon(social.icon)}
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Quick Answers */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-[4%]">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {contactData.faq.title}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {contactData.faq.questions.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="/faqs"
              className="inline-block px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition font-semibold"
            >
              View All FAQs
            </a>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-[4%]">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Visit Our Office
          </h2>
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.456!2d67.01!3d24.86!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUxJzM3LjYiTiA2N8KwMDAnMzYuMCJF!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}
