'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { SOCIAL_LINKS } from '@/lib/social-links';
import { submitContact } from '@/lib/contact';
import PageBanner from '@/components/PageBanner';

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
      value: "+92 304 5779900",
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
    { platform: "X", url: SOCIAL_LINKS.twitter, icon: "x" }
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
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
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
      case 'phone': return <FaPhone className="w-5 h-5" />;
      case 'whatsapp': return <FaWhatsapp className="w-5 h-5" />;
      case 'email': return <FaEnvelope className="w-5 h-5" />;
      case 'location': return <FaMapMarkerAlt className="w-5 h-5" />;
      default: return null;
    }
  };

  const getSocialIcon = (iconName: string): React.ReactNode => {
    switch (iconName) {
      case 'facebook': return <FaFacebookF className="w-5 h-5" />;
      case 'instagram': return <FaInstagram className="w-5 h-5" />;
      case 'x': return <FaXTwitter className="w-5 h-5" />;
      default: return null;
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
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactData.contactInfo.map((info, idx) => (
              <a
                key={idx}
                href={info.link}
                target={info.icon === 'location' || info.icon === 'whatsapp' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group bg-gray-50 rounded-2xl p-6 text-center hover:bg-white hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 border border-gray-100 hover:border-green-200"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {getIcon(info.icon)}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                <p className="text-gray-800 font-medium mb-1">{info.value}</p>
                <p className="text-sm text-gray-500">{info.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content: Form + Sidebar */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-500 mb-8">Fill out the form below and we'll get back to you shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors ${fieldErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    placeholder="Enter your full name"
                  />
                  {fieldErrors.name && <p className="mt-1.5 text-sm text-red-500">{fieldErrors.name}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors ${fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      placeholder="your@email.com"
                    />
                    {fieldErrors.email && <p className="mt-1.5 text-sm text-red-500">{fieldErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors ${fieldErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      placeholder="+92 304 5779900"
                    />
                    {fieldErrors.phone && <p className="mt-1.5 text-sm text-red-500">{fieldErrors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors ${fieldErrors.subject ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  >
                    <option value="">Select a subject</option>
                    {contactData.departments.map((dept, idx) => (
                      <option key={idx} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                  {fieldErrors.subject && <p className="mt-1.5 text-sm text-red-500">{fieldErrors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors resize-none ${fieldErrors.message ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    placeholder="How can we help you?"
                  />
                  {fieldErrors.message && <p className="mt-1.5 text-sm text-red-500">{fieldErrors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-3.5 bg-green-700 text-white rounded-xl hover:bg-green-600 active:bg-green-800 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-700/20 hover:shadow-green-700/30"
                >
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
            <div className="space-y-6 lg:sticky lg:top-8">

              {/* Business Hours */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                    <FaClock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Business Hours</h3>
                </div>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                    <p>{contactData.businessHours.weekdays}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                    <p>{contactData.businessHours.weekend}</p>
                  </div>
                  <p className="text-sm text-gray-500 pt-2 border-t border-gray-100 mt-3">{contactData.businessHours.holidays}</p>
                </div>
              </div>

              {/* Departments */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Email by Department</h3>
                <div className="space-y-4">
                  {contactData.departments.map((dept, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                      <a href={`mailto:${dept.email}`} className="text-sm text-green-700 hover:text-green-800 hover:underline font-medium">
                        {dept.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Follow Us</h3>
                <div className="flex gap-3">
                  {contactData.social.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-700 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
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
      </section>

      {/* Quick Answers */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{contactData.faq.title}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Find quick answers to common questions. Need more help? Reach out to us directly.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactData.faq.questions.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center mb-4">
                  <span className="text-sm font-bold">Q{idx + 1}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 leading-snug">{item.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/faqs"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-700 text-white rounded-xl hover:bg-green-600 active:bg-green-800 transition-all duration-200 font-semibold shadow-lg shadow-green-700/20 hover:shadow-green-700/30"
            >
              View All FAQs
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}