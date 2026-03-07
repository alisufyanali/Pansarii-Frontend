"use client";
import Image from "next/image";

export default function Banner() {
  const bannerImg = '/images/Banner.png';

  return (
    <section className="relative w-full flex" style={{ height: '90vh', minHeight: '33rem', maxHeight: '90rem' }}>
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={bannerImg}
          alt="Pansari Inn Banner"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1]"></div>

      {/* Content Overlay — contained within max-width container */}
      <div className="relative z-10 flex w-full mt-auto mb-auto px-[4%]">
        <div className="w-full max-w-[1920px] mx-auto flex">
          {/* Left Column */}
          <div className="w-1/2 flex flex-col justify-center px-4 xl:px-12 gap-4">
            <p
              className="text-[18px] 2xl:text-[22px] 4xl:text-[28px] font-bold"
              style={{
                fontFamily: "Lexend, sans-serif",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#6C3F3F",
              }}
            >
              ✨ 100% Natural & Authentic
            </p>

            <h1
              className="text-5xl md:text-6xl 2xl:text-7xl 4xl:text-8xl font-bold"
              style={{ color: "#005316", fontFamily: "Lexend, sans-serif" }}
            >
              Pansari Inn
            </h1>

            <p
              className="text-[18px] 2xl:text-[22px] 4xl:text-[26px] font-medium max-w-lg 2xl:max-w-2xl"
              style={{
                fontFamily: "Poppins, sans-serif",
                lineHeight: "140%",
                letterSpacing: "0%",
                color: "#000000",
              }}
            >
              Nature heals 🌿 Handmade | Herbal Haircare | Plant Based Skincare | Women owned family business
            </p>

            <div className="mt-6 flex gap-4">
              <a
                href="/shop"
                className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity text-sm 2xl:text-base 4xl:text-lg"
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
                className="flex items-center justify-center font-semibold hover:opacity-90 transition-opacity text-sm 2xl:text-base 4xl:text-lg"
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

          {/* Right Column */}
          <div className="w-1/2"></div>
        </div>
      </div>
    </section>
  );
}