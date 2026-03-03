// Footer.tsx
'use client';

import { useState, useMemo } from 'react';
import ContactInfo from './ContactInfo';
import LinkColumns from './LinkColumns';
import Newsletter from './Newsletter';
import FooterBanner from './FooterBanner';
import FooterIcons from './Footericons';

export default function Footer() {
  const textStyle = useMemo(() => ({
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: 'clamp(12px, 1vw, 16px)',
    lineHeight: '1.5',
    letterSpacing: '0%',
  }), []);

  const buttonColor = '#197B33';
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Footer Banner */}
      <div className="w-full">
        <FooterBanner />
      </div>
      
      {/* Icons Section - Always in one row with horizontal scroll on mobile if needed */}
      <FooterIcons buttonColor={buttonColor} textStyle={textStyle} />
      
      {/* Main Footer */}
      <footer className="bg-white text-gray-900 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 md:py-10 lg:py-12">
        <div className="max-w-[1920px] mx-auto">
          {/* Mobile: Mailing List Section - Visible only on mobile */}
          <div className="block lg:hidden mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: buttonColor, fontFamily: 'Poppins' }}
              >
                Join Our Mailing List
              </h3>
              <p className="text-sm text-gray-600 mb-4" style={textStyle}>
                Subscribe to get updates on new products, exclusive offers, and herbal wellness tips delivered straight to your inbox.
              </p>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#197B33] text-sm mb-3"
                  style={{ fontFamily: 'Poppins' }}
                />
                <button
                  className="w-full py-3 rounded-full text-white font-semibold transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: buttonColor }}
                >
                  Subscribe
                </button>
              </div>
              
              {/* Social Icons for Mobile */}
              <div className="flex justify-center gap-4 mt-4">
                {/* Add your social icons here or reuse from ContactInfo */}
                <ContactInfo 
                  textStyle={textStyle} 
                  buttonColor={buttonColor} 
                  showContactInfo={false} // New prop to hide email/phone
                />
              </div>
            </div>
          </div>

          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8">
            {/* Contact Info - Takes 2 columns on lg+ */}
            <div className="lg:col-span-2">
              <ContactInfo 
                textStyle={textStyle} 
                buttonColor={buttonColor} 
                showSocialMedia={false} // Hide social icons here on mobile since we have them above
              />
            </div>
            
            {/* Link Columns with Dropdown on Mobile - Takes 7 columns on lg+ */}
            <div className="lg:col-span-7">
              <LinkColumns 
                textStyle={textStyle} 
                buttonColor={buttonColor} 
                isMobile={true} // Enable dropdown on mobile
              />
            </div>
            
            {/* Newsletter - Hidden on mobile, visible on lg+ */}
            <div className="hidden lg:block lg:col-span-3">
              <Newsletter textStyle={textStyle} buttonColor={buttonColor} />
            </div>
          </div>
          
          {/* Copyright Section */}
          <div className="mt-8 md:mt-10 lg:mt-12 pt-4 md:pt-6 border-t border-gray-300">
            <p 
              style={textStyle} 
              className="text-center text-xs sm:text-sm md:text-base"
            >
              ©2019-{currentYear} PansariInn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}