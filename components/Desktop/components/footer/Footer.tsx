import ContactInfo from './ContactInfo';
import LinkColumns from './LinkColumns';
import Newsletter from './Newsletter';
import FooterIcons from './Footericons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <FooterIcons />

      <footer className="bg-white text-gray-900 font-poppins border-t border-gray-100">
        <div className="px-[4%] py-10 max-w-[1920px] mx-auto">

          {/*
            4-column layout matching design:
            [Logo+Contact] [Quick Links + Shop + Customer Service] [Newsletter]
            On md: 3 cols — contact | links | newsletter
            On lg: auto-sized contact, flexible links, fixed newsletter
          */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_260px] gap-8 lg:gap-16 items-start">

            {/* LEFT — Logo + contact + socials */}
            <ContactInfo />

            {/* CENTER — 3 link columns */}
            <LinkColumns />

            {/* RIGHT — Newsletter */}
            <Newsletter />

          </div>

          {/* Divider + Copyright */}
          <div className="mt-8 pt-5 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Pansari Inn {currentYear}. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}
