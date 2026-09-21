import Link from 'next/link';
import { FaFileContract, FaStore, FaCheckCircle } from 'react-icons/fa';
import PageBanner from '@/components/PageBanner';

const lastUpdated = 'September 1, 2026';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    body: [
      'By accessing and using the Pansari Inn website (pansariinn.com), placing an order, or creating an account, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use this website.',
      'These terms apply to all visitors, users, customers, and account holders. We reserve the right to update or modify these terms at any time without prior notice. Continued use of the website after changes are posted constitutes your acceptance of the revised terms.',
    ],
  },
  {
    id: 'eligibility',
    title: '2. Eligibility to Order',
    body: [
      'You must be at least 18 years of age or the age of majority in your jurisdiction, whichever is higher, to place an order on this website. If you are under 18, you may use the website only with the involvement and consent of a parent or legal guardian.',
      'By placing an order, you represent and warrant that you have the legal right and authority to enter into a binding contract with Pansari Inn and that all information you provide is true, accurate, and complete.',
    ],
  },
  {
    id: 'products',
    title: '3. Products & Descriptions',
    body: [
      'All products listed on Pansari Inn are natural herbal and ayurvedic products intended for general wellness use only. They are not intended to diagnose, treat, cure, or prevent any disease. Statements made on product packaging and descriptions have not been evaluated by DRAP or any equivalent regulatory authority.',
      'We make every effort to display product colours, images, and descriptions as accurately as possible. However, slight variations in packaging, colour, or composition may occur due to product batch changes and do not affect product quality or efficacy.',
      'Product prices are listed in Pakistani Rupees (PKR) and are subject to change without prior notice. Prices displayed at the time of checkout are final.',
    ],
  },
  {
    id: 'ordering',
    title: '4. Ordering & Payment',
    body: [
      'When you place an order, you will receive an order confirmation by email and/or SMS. This confirmation does not constitute acceptance of your order. Acceptance occurs when the order is shipped and payment is confirmed.',
      'We accept the following payment methods: Cash on Delivery (COD), bank transfer, JazzCash, EasyPaisa, and supported debit/credit cards. All online payments are processed through secure, PCI-DSS compliant gateways.',
      'If you choose Cash on Delivery, the full order amount must be paid in cash to the courier at the time of delivery. Payment by cheque or partial payment is not accepted for COD orders.',
      'We reserve the right to cancel any order at our sole discretion, including but not limited to cases of suspected fraud, incorrect pricing, stock unavailability, or violation of these terms. In such cases, any amount paid will be refunded within 7–14 working days.',
    ],
  },
  {
    id: 'delivery',
    title: '5. Delivery & Shipping',
    body: [
      'Standard delivery timelines are 2–3 working days for major cities (Karachi, Lahore, Islamabad/Rawalpindi, Hyderabad, Faisalabad, Multan, Peshawar, Quetta) and 3–7 working days for other areas of Pakistan. These are estimates, not guarantees.',
      'Shipping charges are calculated at checkout based on your selected city and order subtotal. Free shipping applies to orders of PKR 5,000 and above unless otherwise stated during a promotion.',
      'Pansari Inn is not liable for delays caused by courier partners, natural disasters, public holidays, incorrect or incomplete delivery addresses, customs, or circumstances beyond our reasonable control.',
      'It is your responsibility to ensure someone is available at the delivery address to receive and sign for the order. Two delivery attempts are typically made; after that, the order may be returned to us, and additional shipping charges may apply for re-dispatch.',
    ],
  },
  {
    id: 'returns',
    title: '6. Returns, Refunds & Cancellations',
    body: [
      'Unopened and unused products may be returned within 7 days of delivery for a full refund or exchange, provided the original packaging and seals are intact. Opened or used products are non-refundable due to hygiene and safety reasons.',
      'To initiate a return, please contact us via WhatsApp, email (chat@pansariinn.com), or phone with your order number and reason for return. Our team will guide you through the return process.',
      'Return shipping is the responsibility of the customer unless the product was delivered damaged, defective, or incorrect. In such cases, we will arrange a reverse pickup at our cost.',
      'Refunds are processed after we receive and inspect the returned product. Refunds for COD orders are issued via bank transfer or JazzCash/EasyPaisa to the account details you provide. Refunds for online payments are reversed to the original payment method. Please allow 7–14 working days for the amount to reflect.',
      'Before shipment, orders may be cancelled by contacting customer support. Once an order has been handed over to the courier, it cannot be cancelled and the standard return policy applies.',
    ],
  },
  {
    id: 'user-account',
    title: '7. User Accounts',
    body: [
      'When you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.',
      'We may suspend or terminate your account at our discretion if we determine that you have violated these Terms & Conditions, engaged in fraudulent activity, or misused the website.',
      'Guest checkout is available without creating an account. For guest orders, order tracking and history are available via the order confirmation page and order lookup tools.',
    ],
  },
  {
    id: 'prohibited',
    title: '8. Prohibited Conduct',
    body: [
      'You agree not to: (a) use the website for any unlawful purpose; (b) violate any applicable local, provincial, or national laws or regulations; (c) attempt to gain unauthorized access to our systems, user accounts, or data; (d) interfere with the proper operation of the website or introduce viruses, malware, or harmful code; (e) reproduce, distribute, or commercially exploit any content from this website without our explicit written consent.',
    ],
  },
  {
    id: 'disclaimer',
    title: '9. Disclaimer & Limitation of Liability',
    body: [
      'The website and all products are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.',
      'Pansari Inn shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising out of or related to your use of the website or products, even if we have been advised of the possibility of such damages.',
      'Our total aggregate liability for any claim arising from your order or use of the website shall not exceed the total amount paid by you for the specific product or order that is the subject of the claim.',
      'Nothing in these terms shall exclude or limit liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded under applicable law.',
    ],
  },
  {
    id: 'ip',
    title: '10. Intellectual Property',
    body: [
      'All content on this website — including but not limited to text, graphics, logos, product images, videos, descriptions, trademarks, and website design — is the property of Pansari Inn or its licensors and is protected by copyright, trademark, and other intellectual property laws of Pakistan and international treaties.',
      'Unauthorized use, reproduction, modification, distribution, or display of any of this content is strictly prohibited without prior written consent from Pansari Inn.',
    ],
  },
  {
    id: 'governing',
    title: '11. Governing Law & Dispute Resolution',
    body: [
      'These Terms & Conditions are governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. Any dispute arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Karachi, Sindh, Pakistan.',
      'Before initiating formal proceedings, we encourage you to first contact our customer support team to attempt to resolve any dispute amicably.',
    ],
  },
  {
    id: 'contact',
    title: '12. Contact Information',
    body: [
      'If you have any questions, concerns, or requests regarding these Terms & Conditions, please reach out to us at:',
    ],
    contact: true,
  },
];

const quickPoints = [
  'Cash on Delivery available all over Pakistan',
  '7-day return window for unopened products',
  'Free shipping on orders over PKR 5,000',
  'Secure & encrypted checkout',
  'Order cancellation available before shipment',
  'Authentic herbal products sourced responsibly',
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner
        icon={<FaFileContract className="w-8 h-8" />}
        title="Terms &amp; Conditions"
        subtitle="Please read before ordering"
        description={`These terms govern your use of Pansari Inn and all orders placed through our website. Last updated: ${lastUpdated}.`}
      />

      {/* Quick summary banner */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5 text-center">At a Glance</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickPoints.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 text-green-700">
              Table of Contents
            </h3>
            <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-gray-700 hover:text-green-700 hover:underline transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Main clauses */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {sections.map((s) => (
            <article
              key={s.id}
              id={s.id}
              className="bg-white rounded-2xl border border-gray-200 p-8 scroll-mt-24"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">{s.title}</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {s.contact && (
                  <div className="mt-4 p-5 bg-green-50 border border-green-200 rounded-xl grid sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">Phone / WhatsApp</p>
                      <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 hover:underline"
                      >
                        +92 304 5779900
                      </a>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a
                        href="mailto:chat@pansariinn.com"
                        className="text-green-700 hover:underline"
                      >
                        chat@pansariinn.com
                      </a>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-700">Saddar, Karachi, Pakistan</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Hours</p>
                      <p className="text-gray-700">Mon – Sat, 9:00 AM – 6:00 PM</p>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}

          {/* Footer actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Read our Privacy Policy
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-green-700 text-white rounded-xl hover:bg-green-600 active:bg-green-800 transition-colors font-semibold shadow-lg shadow-green-700/20"
            >
              <FaStore className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
