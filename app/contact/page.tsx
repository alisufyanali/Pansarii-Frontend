// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { SOCIAL_LINKS } from '@/lib/social-links';
import { submitContact } from '@/lib/contact';
import PageBanner from '@/components/PageBanner';

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
      value: "++92 304 5779900",
      link: `tel:+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`,
      description: "Mon-Sat: 9:00 AM - 6:00 PM"
    },
    {
      icon: "whatsapp",
      title: "WhatsApp",
      value: "+92 304 5779900",
      link: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`,
      description: "Chat with us instantly"
    },
    {
      icon: "email",
      title: "Email",
      value: "chat@pansariinn.pk",
      link: "mailto:chat@pansariinn.pk",
      description: "We'll reply within 24 hours"
    },
    {
      icon: "location",
      title: "Address",
      value: "Saddar, Karachi",
      link: "https://maps.app.goo.gl/MMQREQQ2XZKzS3gA9",
      description: "Visit our office"
    }
  ],
  departments: [
    { name: "General Inquiry", email: "info@pansariinn.pk" },
    { name: "Customer Support", email: "chat@pansariinn.pk" },
    { name: "Sales & Orders", email: "sales@pansariinn.pk" },
  ],
  businessHours: {
    weekdays: "Monday - Saturday: 9:00 AM - 6:00 PM",
    weekend: "Sunday: Closed",
    holidays: "We're closed on public holidays"
  },
  social: [
    { platform: "Facebook", url: SOCIAL_LINKS.facebook, icon: "facebook" },
    { platform: "Instagram", url: SOCIAL_LINKS.instagram, icon: "instagram" },
    { platform: "Twitter", url: SOCIAL_LINKS.twitter, icon: "twitter" }
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
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    try {
      await submitContact({
        name:    formData.name,
        email:   formData.email,
        phone:   formData.phone || undefined,
        subject: formData.subject || undefined,
        message: formData.message,
      });
      toast.success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      const e422 = err as { response?: { status?: number; data?: { errors?: Record<string, string[]> } } };
      if (e422?.response?.status === 422 && e422.response.data?.errors) {
        const mapped: Record<string, string> = {};
        Object.entries(e422.response.data.errors).forEach(([k, msgs]) => {
          mapped[k] = Array.isArray(msgs) ? msgs[0] : String(msgs);
        });
        setFieldErrors(mapped);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${fieldErrors.name ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="Enter your name" />
                {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${fieldErrors.email ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="your@email.com" />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${fieldErrors.phone ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="+92 304 5779900" />
                  {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select name="subject" required value={formData.subject} onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${fieldErrors.subject ? 'border-red-400' : 'border-gray-300'}`}>
                  <option value="">Select a subject</option>
                  {contactData.departments.map((dept, idx) => (
                    <option key={idx} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
                {fieldErrors.subject && <p className="mt-1 text-xs text-red-500">{fieldErrors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea name="message" required value={formData.message} onChange={handleChange} rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${fieldErrors.message ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="How can we help you?" />
                {fieldErrors.message && <p className="mt-1 text-xs text-red-500">{fieldErrors.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full px-8 py-4 bg-green-700 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending…
                  </>
                ) : 'Send Message'}
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
            <Link
              href="/faqs"
              className="inline-block px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition font-semibold"
            >
              View All FAQs
            </Link>
          </div>
        </div>
      </section>

  
    </div>
  );
}
