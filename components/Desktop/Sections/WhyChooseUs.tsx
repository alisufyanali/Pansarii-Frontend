"use client";

import Image from "next/image";

const reasons = [
  {
    icon: "🏺",
    title: "100+ Years of Ayurvedic Legacy",
    desc: "Trusted since 1920, pansariInn blends time-tested Ayurvedic wisdom with modern formulations.",
    position: "top-left",
  },
  {
    icon: "🌿",
    title: "100% Herbal",
    desc: "Trusted since 1920, pansariInn blends time-tested Ayurvedic wisdom with modern formulations.",
    position: "top-right",
  },
  {
    icon: "📜",
    title: "Certifications",
    desc: "Trusted since 1920, pansariInn blends time-tested Ayurvedic wisdom with modern formulations.",
    position: "mid-left",
  },
  {
    icon: "🔬",
    title: "Clinically Proven",
    desc: "Trusted since 1920, pansariInn blends time-tested Ayurvedic wisdom with modern formulations.",
    position: "mid-right",
  },
  {
    icon: "🧪",
    title: "Chemical Free",
    desc: "Trusted since 1920, pansariInn blends time-tested Ayurvedic wisdom with modern formulations.",
    position: "bot-left",
  },
  {
    icon: "🌍",
    title: "Global Presence & Trust",
    desc: "Trusted since 1920, pansariInn blends time-tested Ayurvedic wisdom with modern formulations.",
    position: "bot-right",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-white py-14 px-4">
      {/* Heading */}
      <h2 className="text-center text-3xl font-bold text-gray-900 mb-12 tracking-tight">
        WHY CHOOSE{" "}
        <span className="text-amber-500">PansariInn</span>{" "}
        PRODUCTS
      </h2>

      {/* Grid: 3 columns — left cards | center image | right cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-x-8 gap-y-10">

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-10">
          {reasons.filter(r => r.position.endsWith("left")).map((r) => (
            <ReasonCard key={r.title} {...r} align="right" />
          ))}
        </div>

        {/* ── CENTER IMAGE ── */}
        <div className="relative flex items-center justify-center">
          {/* Decorative amber blurred circle */}
          <div className="absolute w-64 h-64 rounded-full bg-amber-100 opacity-60 blur-2xl" />
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 drop-shadow-xl">
            <Image
              src="/images/product.png"
              alt="Pansari Inn Herbal Product"
              fill
              className="object-contain"
              sizes="256px"
              priority={false}
            />
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-10">
          {reasons.filter(r => r.position.endsWith("right")).map((r) => (
            <ReasonCard key={r.title} {...r} align="left" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Individual card ──────────────────────────────────────────────────────────
function ReasonCard({
  icon,
  title,
  desc,
  align,
}: {
  icon: string;
  title: string;
  desc: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex items-start gap-3 max-w-xs ${
        align === "right" ? "ml-auto text-right flex-row-reverse" : "text-left"
      }`}
    >
      {/* Icon bubble */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-900 leading-snug">{title}</p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
