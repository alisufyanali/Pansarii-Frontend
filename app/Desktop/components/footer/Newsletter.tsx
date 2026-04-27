"use client";

import { FormEvent, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function Newsletter() {
  const [email,       setEmail]       = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [subscribed,  setSubscribed]  = useState(false);
  const [error,       setError]       = useState('');

  const validate = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim())    return setError('Email is required');
    if (!validate(email)) return setError('Please enter a valid email');
    setSubmitting(true);
    setTimeout(() => {
      setSubscribed(true);
      setEmail('');
      setSubmitting(false);
      setTimeout(() => setSubscribed(false), 5000);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-3 font-poppins">

      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-green-700 mb-1">
          Join Our Mailing List
        </h4>
        <p className="text-[13px] text-gray-500 leading-relaxed">
          Find out all about our latest offers, new products, and the science of Ayurveda in our newsletters!
        </p>
      </div>

      {subscribed ? (
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-start gap-2">
          <FaCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-700 font-medium text-sm">Successfully subscribed!</p>
            <p className="text-green-600 text-xs mt-0.5">Thank you for joining.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            disabled={isSubmitting}
            className={`w-full px-4 py-2.5 rounded-lg text-[13px] text-gray-900 bg-gray-50 font-poppins
              ${error ? 'border-2 border-red-400' : 'border border-gray-200'}
              focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-600 transition`}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-green-700 text-white text-[13px] font-semibold rounded-lg
                       hover:bg-green-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}

    </div>
  );
}
