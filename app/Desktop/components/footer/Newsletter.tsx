"use client";

import { FormEvent, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function Newsletter() {
  const [email, setEmail]             = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed]   = useState(false);
  const [error, setError]             = useState('');

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
    <div className="flex flex-col w-full font-poppins">
      <h4 className="font-semibold mb-2 uppercase tracking-wider text-[11px] text-green-700">
        Newsletter
      </h4>

      <p className="mb-3 text-gray-500 text-[11px] leading-relaxed">
        Subscribe to get updates on new products and exclusive offers!
      </p>

      {subscribed ? (
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-start gap-2">
          <FaCheckCircle className="text-green-500 w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-700 font-medium text-xs">Successfully subscribed!</p>
            <p className="text-green-600 text-[11px] mt-0.5">Thank you for joining.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded-lg text-gray-900 text-[11px] bg-gray-50 font-poppins
                ${error ? 'border-2 border-red-400' : 'border border-gray-200'}
                focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-600 transition`}
            />
            {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-[11px]
                       hover:bg-green-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-poppins"
          >
            {isSubmitting ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
}
