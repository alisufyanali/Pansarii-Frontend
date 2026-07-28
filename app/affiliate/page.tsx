// app/affiliate/page.tsx
"use client";

import { FaWhatsapp, FaHandshake, FaClock } from "react-icons/fa";

export default function AffiliatePage() {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923045779900";
    const message = "Hi! I'm interested in the Affiliate Program at Pansari Inn. Can you tell me more?";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
            <div className="max-w-lg w-full text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaHandshake className="w-10 h-10 sm:w-12 sm:h-12 text-green-700" />
                </div>

                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
                    <FaClock className="w-3 h-3" />
                    Coming Soon
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    Affiliate Program
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
                    We're putting the finishing touches on our Affiliate Program. Soon
                    you'll be able to earn commissions by promoting Pansari Inn products.
                    Want to be notified when we launch — or have questions in the
                    meantime? Reach out to us on WhatsApp.
                </p>

                <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                    <FaWhatsapp className="w-5 h-5" />
                    Contact Us on WhatsApp
                </a>

                <p className="text-xs text-gray-400 mt-8">
                    Check back soon for updates.
                </p>
            </div>
        </div >
    );
}