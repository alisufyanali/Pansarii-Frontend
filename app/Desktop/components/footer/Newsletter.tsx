"use client";

import { FormEvent, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function Newsletter() {
  const [email,        setEmail]       = useState('');
  const [isSubmitting, setSubmitting]  = useState(false);
  const [subscribed,   setSubscribed]  = useState(false);
  const [error,        setError]       = useState('');

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
    <div className="flex flex-col gap-3">

      {/* Heading — bold black, matches design */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-1.5">
          Join Our Mailing List
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
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
          {/* Input — light gray bg, matches design */}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            disabled={isSubmitting}
            className={`w-full px-4 py-2.5 rounded-lg text-sm text-gray-900 bg-gray-100
              ${error ? 'border border-red-400' : 'border border-transparent'}
              focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-600
              placeholder-gray-400 transition`}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}

          {/* Subscribe button — full width, green, rounded, matches design */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-green-700 text-white text-sm font-semibold rounded-lg
                       hover:bg-green-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}

    </div>
  );
}
