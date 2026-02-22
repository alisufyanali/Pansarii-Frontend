"use client";
import Image from "next/image";

export default function Banner() {
  // Define the banner image path
  const bannerImg = '/images/Banner.png'; // Make sure this image exists in your public/images folder

  return (
    <section className="relative w-full h-[90vh] flex">
      {/* Background Image - Use object-position to control what part of image is visible */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={bannerImg}
          alt="Pansari Inn Banner"
          fill
          className="object-cover object-top" // Changed to object-top to show top of image
          priority
        />
      </div>

      {/* Dark overlay for better text readability (optional) */}
      <div className="absolute inset-0 z-[1]"></div>

      {/* Content Overlay */}
      <div className="relative z-10 flex w-full mt-auto mb-auto" style={{ marginLeft: '4%', marginRight: '4%' }}>
        {/* Left Column - Content */}
        <div className="w-1/2 flex flex-col justify-center px-12 gap-4">
          {/* First line - Lexend, Bold */}
          <p
            className="text-[18px] font-bold"
            style={{
              fontFamily: "Lexend, sans-serif",
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#6C3F3F",
            }}
          >
            ✨ 100% Natural & Authentic
          </p>

          {/* Second line - Pansari Inn */}
          <h1
            className="text-5xl md:text-6xl font-bold"
            style={{ color: "#005316", fontFamily: "Lexend, sans-serif" }}
          >
            Pansari Inn
          </h1>

          {/* Third line - Poppins, Medium */}
          <p
            className="text-[18px] font-medium max-w-lg"
            style={{
              fontFamily: "Poppins, sans-serif",
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#000000",
            }}
          >
            Nature heals 🌿 Handmade | Herbal Haircare | Plant Based Skincare | Women owned family business
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <a
              href="/shop"
              className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "#FAA944",
                color: "#000000",
                padding: "16px 24px",
                borderRadius: "45px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Shop Now <span className="ml-2 text-lg">&gt;</span>
            </a>
            <a
              href="/remedies"
              className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "#197B33",
                color: "#ffffff",
                padding: "16px 24px",
                borderRadius: "45px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Explore Remedies <span className="ml-2 text-lg">&gt;</span>
            </a>
          </div>
        </div>

        {/* Right Column - Empty (but shows banner background) */}
        <div className="w-1/2"></div>
      </div>
    </section>
  );
}