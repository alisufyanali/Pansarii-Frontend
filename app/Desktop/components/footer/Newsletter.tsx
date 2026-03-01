"use client";

import { FormEvent, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface NewsletterProps {
  textStyle: React.CSSProperties;
  buttonColor: string;
}

export default function Newsletter({ textStyle, buttonColor }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Newsletter Subscription:', { email, timestamp: new Date().toISOString() });
      setSubscribed(true);
      setEmail('');
      setIsSubmitting(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubscribed(false), 5000);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full">
      <h4 
        className="font-bold mb-3 text-sm sm:text-base lg:text-lg"
        style={{ 
          fontFamily: 'Poppins',
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
          color: buttonColor
        }}
      >
        Newsletter
      </h4>
      
      <p 
        style={{ 
          ...textStyle, 
          fontSize: 'clamp(11px, 2vw, 13px)',
          lineHeight: '1.5'
        }} 
        className="mb-4"
      >
        Subscribe to get updates on new products and exclusive offers!
      </p>
      
      {subscribed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
          <FaCheckCircle className="text-green-500 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-700 font-medium text-sm sm:text-base">
              Successfully subscribed!
            </p>
            <p className="text-green-600 text-xs sm:text-sm mt-1">
              Thank you for joining our newsletter.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-900 text-sm
                ${error ? 'border-red-500 border-2' : 'border border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-[#197B33] focus:border-transparent
                transition-all duration-200`}
              style={{ 
                backgroundColor: '#F5F5F5',
                fontFamily: 'Poppins',
                fontSize: 'clamp(12px, 2vw, 14px)'
              }}
              disabled={isSubmitting}
            />
            {error && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg
                     hover:opacity-90 transition-all duration-300 transform hover:scale-105
                     disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                     text-sm sm:text-base"
            style={{
              backgroundColor: buttonColor,
              fontFamily: 'Poppins',
              fontSize: 'clamp(12px, 2vw, 14px)',
              letterSpacing: '0.3px'
            }}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
}