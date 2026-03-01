import ContactInfo from './ContactInfo';
import LinkColumns from './LinkColumns';
import Newsletter from './Newsletter';
import FooterBanner from './FooterBanner';
import FooterIcons from './FooterIcons';

export default function Footer() {
  const textStyle = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: 'clamp(12px, 1vw, 16px)', // Responsive font size
    lineHeight: '1.5',
    letterSpacing: '0%',
  };

  const buttonColor = '#197B33';
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Footer Banner */}
      <div className="w-full">
        <FooterBanner />
      </div>
      
      {/* Icons Section - Fully Responsive */}
      <FooterIcons buttonColor={buttonColor} textStyle={textStyle} />
      
      {/* Main Footer */}
      <footer className="bg-white text-gray-900 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 md:py-10 lg:py-12">
        <div className="max-w-[1920px] mx-auto">
          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8">
            {/* Contact Info - Takes 2 columns on lg+ */}
            <div className="lg:col-span-2">
              <ContactInfo textStyle={textStyle} buttonColor={buttonColor} />
            </div>
            
            {/* Link Columns - Takes 7 columns on lg+ */}
            <div className="lg:col-span-7">
              <LinkColumns textStyle={textStyle} buttonColor={buttonColor} />
            </div>
            
            {/* Newsletter - Takes 3 columns on lg+ */}
            <div className="lg:col-span-3">
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