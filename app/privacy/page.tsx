import Link from 'next/link';
import { FaShieldAlt, FaStore, FaCheckCircle, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import PageBanner from '@/components/PageBanner';

const lastUpdated = 'September 1, 2026';

const sections = [
  {
    id: 'intro',
    title: '1. Introduction',
    body: [
      'Pansari Inn ("we", "us", or "our") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website pansariinn.com, create an account, place an order, contact our support team, or otherwise interact with us.',
      'We are committed to complying with applicable privacy and data protection laws in Pakistan, including but not limited to the Prevention of Electronic Crimes Act (PECA) 2016 and any subsidiary regulations. By using our website, you consent to the practices described in this Privacy Policy.',
      'This policy was last updated on the date listed above. We encourage you to review it periodically for any changes. Material changes will be notified through a prominent notice on our website or by email.',
    ],
  },
  {
    id: 'collected',
    title: '2. Information We Collect',
    body: [
      'We collect information you provide to us directly, information collected automatically when you visit our website, and information from third parties, as described below.',
    ],
    subsections: [
      {
        title: 'a. Information you provide directly',
        items: [
          'Name, email address, phone number, and delivery address when you create an account or place an order (including guest checkout).',
          'Billing information and payment details (processed by secure third-party payment gateways; we do NOT store full card numbers, CVV, or PIN on our servers).',
          'Messages, feedback, and order notes you send through the Contact form, WhatsApp, email, or other support channels.',
          'Coupon codes you redeem and any preferences you set on your account.',
          'Account registration details including password (stored using secure, industry-standard hashing algorithms — never in plain text).',
        ],
      },
      {
        title: 'b. Information collected automatically',
        items: [
          'Device and technical information such as IP address, browser type, operating system, device model, screen resolution, and language preferences.',
          'Usage data: pages visited, products viewed, search queries, time spent on the website, referring website URLs, and click-stream behaviour.',
          'Order and cart interactions: items added to cart, abandoned carts, checkout progress, and checkout completion.',
          'This information is collected via cookies, pixel tags, and similar technologies. See Section 9 for details on cookies.',
        ],
      },
      {
        title: 'c. Information from third parties',
        items: [
          'Courier / logistics partners provide delivery status information which we associate with your order.',
          'Payment service providers return transaction status and payment confirmation details.',
          'If you log in via any social or third-party authentication provider in the future, we may receive your basic profile information in accordance with that provider\'s permissions.',
        ],
      },
    ],
  },
  {
    id: 'use',
    title: '3. How We Use Your Information',
    body: [
      'We use your personal information for the following lawful business purposes:',
    ],
    list: [
      'To process, fulfil, and deliver your orders; to handle COD confirmations via phone call or WhatsApp.',
      'To create and manage your user account, authenticate you, and provide self-service features such as order history, wishlist, and profile settings.',
      'To communicate with you about your orders (confirmations, shipping updates, delivery attempts, cancellations, refunds, and returns).',
      'To respond to customer support inquiries, complaints, and feedback via phone, email, WhatsApp, or social media.',
      'To send transactional and service-related emails and SMS (e.g., account verification, password resets, order updates).',
      'To send promotional emails, SMS, or WhatsApp messages about new products, special offers, sales, and events — only if you have explicitly opted in. You may unsubscribe at any time (see Section 6).',
      'To improve our website, products, and services; to conduct internal analytics on user behaviour and product performance.',
      'To detect, prevent, and investigate fraud, abuse, security incidents, and prohibited activities; to enforce our Terms & Conditions.',
      'To comply with legal and regulatory obligations, including tax, accounting, record-keeping, and lawful requests from government or law enforcement authorities.',
      'To perform data analysis, testing, system maintenance, and business planning.',
    ],
  },
  {
    id: 'sharing',
    title: '4. When We Share Your Information',
    body: [
      'We value your trust and will never sell your personal information to any third party for marketing purposes. We only share your data in the limited circumstances described below, and always with appropriate safeguards in place.',
    ],
    subsections: [
      {
        title: 'Service providers we share with',
        items: [
          'Courier and logistics companies (e.g., Leopards Courier, TCS, Pakistan Post) for order delivery — we share your name, phone number, address, and order details.',
          'Payment service providers (JazzCash, EasyPaisa, bank gateways, card processors) — they handle payment processing directly and receive only the data needed to complete a transaction.',
          'Email, SMS, and WhatsApp messaging vendors that deliver transactional and promotional communications on our behalf.',
          'Website hosting, cloud infrastructure, database, and analytics providers who power our platform. All data transferred is encrypted in transit and at rest.',
          'Customer support tools we use to manage tickets and conversations.',
        ],
      },
      {
        title: 'Other permitted disclosures',
        items: [
          'As required by law, court order, subpoena, or a valid request from a competent governmental authority.',
          'To protect the rights, property, safety, or integrity of Pansari Inn, our customers, employees, or the general public.',
          'In connection with a merger, acquisition, corporate reorganization, or sale of all or part of our business — you will be notified via email and/or a prominent website notice of any such change.',
          'With your explicit consent or at your direction.',
        ],
      },
    ],
  },
  {
    id: 'storage',
    title: '5. Data Storage & Security',
    body: [
      'Your personal data is stored on secure servers located within Pakistan or with reputable cloud providers that maintain equivalent levels of protection. We implement a layered set of technical and organizational security measures appropriate to the sensitivity of the data we process, including:',
    ],
    list: [
      'TLS (HTTPS) encryption for all data transmitted between your browser and our website.',
      'Secure hashing (bcrypt / Argon2 family) for stored passwords — we never retain passwords in readable form.',
      'Role-based access control: only authorized Pansari Inn employees can access customer data, and only to the extent necessary to perform their job.',
      'Regular security patching, automated backups (encrypted), and periodic security reviews of our systems.',
      'PCI-DSS compliant payment processing — card data is handled directly by payment gateways, never stored on our servers.',
      'Employee data-protection training and confidentiality agreements.',
    ],
    bodySuffix: [
      'While we implement commercially reasonable safeguards, no method of transmission over the Internet or electronic storage is 100% secure. If you have reason to believe your account security has been compromised, please contact us immediately so we can take appropriate action.',
      'We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected: typically the lifetime of your account plus 7 years for order and tax records, or the minimum retention period required by law. Session-level data such as anonymous analytics is retained for 12–24 months before being aggregated or deleted.',
    ],
  },
  {
    id: 'marketing',
    title: '6. Marketing Communications & Opt-Out',
    body: [
      'With your explicit opt-in consent (e.g., newsletter signup, a checkbox during checkout, or verbal confirmation on a support call), we may send you promotional communications via email, SMS, or WhatsApp about new products, flash sales, discount vouchers, and events.',
      'You can opt out of receiving marketing messages at any time by:',
    ],
    list: [
      'Clicking the "Unsubscribe" link at the bottom of any marketing email.',
      'Replying "UNSUBSCRIBE" or "STOP" to an SMS or WhatsApp message.',
      'Toggling notification preferences in your account settings.',
      'Contacting customer support at chat@pansariinn.com or +92 304 5779900.',
    ],
    bodySuffix: [
      'Please note that even if you opt out of marketing, we will continue to send you essential transactional and service-related communications such as order confirmations, shipping updates, password reset emails, and responses to support tickets.',
    ],
  },
  {
    id: 'rights',
    title: '7. Your Data Rights',
    body: [
      'Subject to applicable law and any lawful exceptions, you have the following rights in relation to your personal data. To exercise any of these rights, contact us using the details in Section 10. We will respond to legitimate requests within 15–30 working days and may require identity verification before acting.',
    ],
    rights: [
      { name: 'Access', detail: 'You may request a copy of the personal data we hold about you and confirmation of how it is being processed.' },
      { name: 'Correction', detail: 'You may request the correction of inaccurate, incomplete, or outdated personal information.' },
      { name: 'Deletion', detail: 'You may request deletion of your personal data where it is no longer necessary for the purposes for which it was collected, subject to legal retention obligations.' },
      { name: 'Restriction', detail: 'You may request restriction of processing of your data in certain circumstances (e.g., while a data accuracy dispute is being resolved).' },
      { name: 'Data Portability', detail: 'Where processing is based on consent or contract, you may request your data in a commonly used, machine-readable format.' },
      { name: 'Objection', detail: 'You may object to processing of your data for direct marketing purposes at any time, free of charge.' },
      { name: 'Withdrawal of Consent', detail: 'Where processing is based on consent, you can withdraw your consent at any time. This does not affect the lawfulness of processing carried out before withdrawal.' },
    ],
    bodySuffix: [
      'If you are not satisfied with our response to a data-rights request, you may lodge a complaint with the relevant data protection authority in Pakistan.',
    ],
  },
  {
    id: 'children',
    title: '8. Children\'s Privacy',
    body: [
      'Our website and services are not directed at children under the age of 16, and we do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us immediately and we will take reasonable steps to delete that information from our systems.',
    ],
  },
  {
    id: 'cookies',
    title: '9. Cookies & Tracking Technologies',
    body: [
      'Cookies are small text files that are placed on your device when you visit a website. We use cookies and similar technologies (localStorage, sessionStorage, pixel tags) to make our website work properly, enhance your user experience, and understand how visitors interact with our site.',
    ],
    cookieCategories: [
      {
        title: 'Strictly Necessary Cookies',
        desc: 'Essential for core website functionality: session management, authentication, shopping cart, CSRF protection, and form security. These cannot be disabled if you wish to use the website.',
      },
      {
        title: 'Functional / Preference Cookies',
        desc: 'Remember your settings and preferences such as language, recently viewed products, and wishlist items between sessions.',
      },
      {
        title: 'Analytics Cookies',
        desc: 'Help us understand website traffic, popular pages, and customer journeys so we can improve our products and user experience. Data is aggregated and anonymized where possible.',
      },
      {
        title: 'Marketing Cookies',
        desc: 'Used to deliver relevant advertisements and measure the effectiveness of marketing campaigns. These are set only with your explicit consent.',
      },
    ],
    bodySuffix: [
      'You can control or disable cookies through your browser settings. Please note that disabling certain cookies may prevent features of the website from working correctly (e.g., adding products to cart, checking out, or staying logged in).',
      'A sessionStorage key named "last-guest-order" is used temporarily to hold your order summary between the checkout and order-confirmation pages. It is not used for tracking and is not shared with third parties.',
    ],
  },
  {
    id: 'thirdparty',
    title: '10. Third-Party Links',
    body: [
      'Our website may contain links to external websites (for example, courier tracking pages, social media platforms, payment gateways, and Google Maps). These third-party sites operate under their own privacy policies and terms of service, which we do not control. We are not responsible for the content, security, or privacy practices of any linked sites. We encourage you to review their policies before providing any personal information.',
    ],
  },
  {
    id: 'international',
    title: '11. International Data Transfers',
    body: [
      'Pansari Inn is based in Pakistan, and most processing of your data occurs within the country. However, some of our cloud infrastructure, hosting, and service providers may be located in jurisdictions outside Pakistan. Where this is the case, we ensure appropriate safeguards (including contractual clauses and equivalent data protection standards) are in place, consistent with Pakistani law, before any transfer takes place.',
    ],
  },
  {
    id: 'contact',
    title: '12. Contact Us / Data Requests',
    body: [
      'If you have questions, concerns, or requests regarding this Privacy Policy, data handling practices, or wish to exercise any of your data rights, please contact our support team through any of the channels below. We will acknowledge and respond to legitimate inquiries promptly.',
    ],
    contact: true,
  },
];

const commitments = [
  'We never sell your personal data',
  'Your passwords are always hashed, never stored plain',
  'Marketing only with your explicit opt-in',
  'HTTPS / TLS encryption everywhere',
  'PCI-DSS payment processing',
  'Full data-rights requests supported',
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner
        icon={<FaShieldAlt className="w-8 h-8" />}
        title="Privacy Policy"
        subtitle="Your data, your rights, our responsibility"
        description={`How Pansari Inn collects, uses, and protects your personal information. Last updated: ${lastUpdated}.`}
      />

      {/* Commitments */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5 text-center">Our Privacy Commitments</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {commitments.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100"
              >
                <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-800 font-medium leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOC */}
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

      {/* Sections */}
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
                {s.body?.map((p, i) => (
                  <p key={`b-${i}`}>{p}</p>
                ))}
                {s.subsections?.map((sub, i) => (
                  <div key={`s-${i}`} className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{sub.title}</h4>
                    <ul className="space-y-2 pl-5 list-disc marker:text-green-700">
                      {sub.items.map((it, j) => (
                        <li key={j}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {s.list?.length ? (
                  <ul className="space-y-2 pl-5 list-disc marker:text-green-700 mt-2">
                    {s.list.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                ) : null}
                {s.bodySuffix?.map((p, i) => (
                  <p key={`bs-${i}`} className="mt-3">
                    {p}
                  </p>
                ))}
                {s.rights?.length ? (
                  <div className="mt-4 space-y-3">
                    {s.rights.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-0.5">{r.name}</p>
                          <p className="text-sm text-gray-600">{r.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {s.cookieCategories?.length ? (
                  <div className="mt-4 space-y-3">
                    {s.cookieCategories.map((c, i) => (
                      <div
                        key={i}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <p className="font-semibold text-gray-900 text-sm mb-1">{c.title}</p>
                        <p className="text-sm text-gray-600">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {s.contact && (
                  <div className="mt-4 p-5 bg-green-50 border border-green-200 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Data Protection & Privacy Contact
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-3">
                        <FaWhatsapp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">WhatsApp / Phone</p>
                          <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 hover:underline"
                          >
                            +92 304 5779900
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaEnvelope className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Email</p>
                          <a
                            href="mailto:chat@pansariinn.com"
                            className="text-green-700 hover:underline"
                          >
                            chat@pansariinn.com
                          </a>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Address</p>
                        <p className="text-gray-700">Saddar, Karachi, Pakistan</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Response hours</p>
                        <p className="text-gray-700">Mon – Sat, 9:00 AM – 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link
              href="/terms"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Read Terms &amp; Conditions
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
