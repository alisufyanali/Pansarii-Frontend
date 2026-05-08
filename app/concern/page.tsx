'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { newArrivalProducts } from '../Desktop/data/newproducts';
import ProductCard from '../Desktop/components/ProductCard';
import { FaLeaf, FaHeart, FaMoon, FaBolt, FaEye, FaShieldAlt, FaSmile, FaWind, FaBrain, FaFire, FaArrowRight, FaCheckCircle, FaSearch } from 'react-icons/fa';

interface Concern {
  id: string; 
  title: string; 
  titleUr: string; 
  description: string;
  icon: React.ReactNode; // Changed from JSX.Element to React.ReactNode
  gradient: string; 
  bgLight: string; 
  borderColor: string;
  tags: string[]; 
  tips: string[];
}
const concerns: Concern[] = [
  { id: 'hair', title: 'Hair Care', titleUr: 'بالوں کی دیکھ بھال',
    description: 'Fight hair fall, promote growth, and restore your natural shine with herbal oils and treatments.',
    icon: <FaLeaf className="w-6 h-6" />, gradient: 'from-emerald-500 to-teal-500', bgLight: 'bg-emerald-50', borderColor: 'border-emerald-200',
    tags: ['hair', 'Hair Care', 'oil'], tips: ['Apply warm oil 2x a week', 'Avoid sulfate shampoos', 'Massage scalp daily for 5 mins'] },
  { id: 'skin', title: 'Skin Care', titleUr: 'جلد کی دیکھ بھال',
    description: 'Achieve radiant, healthy skin with plant-based serums, oils, and herbal extracts.',
    icon: <FaSmile className="w-6 h-6" />, gradient: 'from-pink-500 to-rose-500', bgLight: 'bg-pink-50', borderColor: 'border-pink-200',
    tags: ['skin', 'Skin Care', 'moisturizer', 'serum'], tips: ['Cleanse twice daily', 'Always use SPF outdoors', 'Hydrate with herbal toner'] },
  { id: 'sleep', title: 'Better Sleep', titleUr: 'بہتر نیند',
    description: 'Calm your mind and body with natural herbs known to promote restful, deep sleep.',
    icon: <FaMoon className="w-6 h-6" />, gradient: 'from-indigo-500 to-violet-500', bgLight: 'bg-indigo-50', borderColor: 'border-indigo-200',
    tags: ['sleep', 'chamomile', 'lavender', 'tea'], tips: ['Drink chamomile tea before bed', 'Diffuse lavender oil', 'Avoid screens 1hr before sleep'] },
  { id: 'energy', title: 'Energy & Vitality', titleUr: 'توانائی اور قوت',
    description: 'Restore energy levels and fight fatigue with adaptogenic herbs and natural supplements.',
    icon: <FaBolt className="w-6 h-6" />, gradient: 'from-amber-500 to-orange-500', bgLight: 'bg-amber-50', borderColor: 'border-amber-200',
    tags: ['energy', 'ginger', 'honey', 'green tea'], tips: ['Start day with herbal tea', 'Take adaptogens consistently', 'Pair with light exercise'] },
  { id: 'immunity', title: 'Immunity Boost', titleUr: 'قوت مدافعت',
    description: 'Strengthen your immune system with powerful antioxidant-rich herbs and superfoods.',
    icon: <FaShieldAlt className="w-6 h-6" />, gradient: 'from-green-500 to-emerald-500', bgLight: 'bg-green-50', borderColor: 'border-green-200',
    tags: ['immunity', 'honey', 'black seed', 'ginger'], tips: ['Add black seed to daily diet', 'Take raw honey every morning', 'Use turmeric in cooking'] },
  { id: 'digestion', title: 'Digestion', titleUr: 'ہاضمہ',
    description: 'Support healthy gut function and relieve digestive discomfort with herbal remedies.',
    icon: <FaHeart className="w-6 h-6" />, gradient: 'from-orange-500 to-red-500', bgLight: 'bg-orange-50', borderColor: 'border-orange-200',
    tags: ['digestion', 'fennel', 'ginger', 'peppermint'], tips: ['Sip peppermint tea after meals', 'Chew fennel seeds', 'Stay hydrated throughout the day'] },
  { id: 'stress', title: 'Stress Relief', titleUr: 'ذہنی سکون',
    description: 'Natural herbs and aromatherapy solutions to calm anxiety and melt away daily stress.',
    icon: <FaBrain className="w-6 h-6" />, gradient: 'from-purple-500 to-indigo-500', bgLight: 'bg-purple-50', borderColor: 'border-purple-200',
    tags: ['stress', 'lavender', 'ashwagandha'], tips: ['Practice deep breathing', 'Use lavender in your bath', 'Try ashwagandha supplements'] },
  { id: 'joints', title: 'Joint & Muscle Pain', titleUr: 'جوڑوں کا درد',
    description: 'Natural anti-inflammatory herbs and warming oils to soothe aches and restore mobility.',
    icon: <FaWind className="w-6 h-6" />, gradient: 'from-cyan-500 to-blue-500', bgLight: 'bg-cyan-50', borderColor: 'border-cyan-200',
    tags: ['pain', 'turmeric', 'oil'], tips: ['Massage with warm oil nightly', 'Add turmeric to your diet', 'Apply hot compress before bed'] },
  { id: 'hydration', title: 'Hydration & Detox', titleUr: 'ہائیڈریشن',
    description: 'Cleanse your body from within and boost hydration with herbal infusions and tonics.',
    icon: <FaWind className="w-6 h-6" />,gradient: 'from-sky-500 to-cyan-500', bgLight: 'bg-sky-50', borderColor: 'border-sky-200',
    tags: ['detox', 'green tea', 'hibiscus'], tips: ['Drink hibiscus water daily', 'Try a 3-day green tea cleanse', 'Replace sodas with herbal teas'] },
  { id: 'weight', title: 'Weight Management', titleUr: 'وزن کا انتظام',
    description: 'Support healthy metabolism and manage weight naturally with herbal solutions.',
    icon: <FaFire className="w-6 h-6" />, gradient: 'from-red-500 to-rose-500', bgLight: 'bg-red-50', borderColor: 'border-red-200',
    tags: ['weight', 'green tea', 'metabolism'], tips: ['Green tea 3x daily', 'Add cinnamon to your drinks', 'Walk 30 min after meals'] },
  { id: 'eye', title: 'Eye Care', titleUr: 'آنکھوں کی دیکھ بھال',
    description: 'Protect and nourish your eyes with vitamin-rich herbs and natural eye care solutions.',
    icon: <FaEye className="w-6 h-6" />, gradient: 'from-lime-500 to-green-500', bgLight: 'bg-lime-50', borderColor: 'border-lime-200',
    tags: ['eye', 'vision', 'kasni'], tips: ['Cold compress for tired eyes', 'Rose water eyedrops', 'Reduce screen time gradually'] },
  { id: 'respiratory', title: 'Respiratory Health', titleUr: 'سانس کی صحت',
    description: 'Open airways and breathe freely with herbal steam blends and respiratory tonics.',
    icon: <FaWind className="w-6 h-6" />, gradient: 'from-teal-500 to-cyan-500', bgLight: 'bg-teal-50', borderColor: 'border-teal-200',
    tags: ['respiratory', 'eucalyptus', 'mint'], tips: ['Steam with eucalyptus oil', 'Honey & ginger for cough', 'Avoid cold drinks when ill'] },
];

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-t-lg" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ByConcernPage() {
  const [selected, setSelected] = useState<Concern | null>(null);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [matchedProducts, setMatchedProducts] = useState(newArrivalProducts.slice(0, 10));
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (concern: Concern) => {
    if (selected?.id === concern.id) {
      setSelected(null);
      setMatchedProducts(newArrivalProducts.slice(0, 10));
      return;
    }
    setSelected(concern);
    setIsProductsLoading(true);
    setTimeout(() => {
      const matches = newArrivalProducts.filter((p) =>
        concern.tags.some((tag) =>
          p.nameEn.toLowerCase().includes(tag.toLowerCase()) ||
          p.category.toLowerCase().includes(tag.toLowerCase()) ||
          (p.description || '').toLowerCase().includes(tag.toLowerCase())
        )
      );
      setMatchedProducts(matches.length > 0 ? matches : newArrivalProducts.slice(0, 10));
      setIsProductsLoading(false);
    }, 400);
  };

  const filteredConcerns = searchQuery
    ? concerns.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : concerns;

  return (
    <div className="min-h-screen bg-gray-50 ">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1920px] mx-auto px-[4%] py-10 sm:py-14">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                <FaLeaf className="w-3 h-3" /> Natural Wellness Solutions
              </div>
              <h1 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-gray-900 leading-tight mb-3">
                Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Health Concern</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-500 mb-2">
                Tell us what you're looking for — we'll recommend the right herbal solutions for your needs.
              </p>
              <p className="text-sm text-gray-400" dir="rtl">اپنی صحت کے مسئلے کے مطابق قدرتی مصنوعات دریافت کریں</p>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 lg:w-72 flex-shrink-0">
              {[
                { n: `${concerns.length}`, label: 'Health Concerns', color: 'text-green-700', bg: 'bg-green-50' },
                { n: `${newArrivalProducts.length}+`, label: 'Products', color: 'text-blue-700', bg: 'bg-blue-50' },
                { n: '100%', label: 'Natural', color: 'text-amber-700', bg: 'bg-amber-50' },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                  <div className={`font-black text-xl ${s.color}`}>{s.n}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-[4%] py-8 sm:py-12 space-y-12">

        {/* Concern selector */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Choose Your Concern</h2>
              <p className="text-sm text-gray-500">Click any concern to browse matching products</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Search concerns */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input type="text" placeholder="Search concern..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-48" />
              </div>
              {selected && (
                <button onClick={() => { setSelected(null); setMatchedProducts(newArrivalProducts.slice(0, 10)); }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline whitespace-nowrap">Clear</button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredConcerns.map((concern) => {
              const isSelected = selected?.id === concern.id;
              return (
                <button key={concern.id} onClick={() => handleSelect(concern)}
                  className={`w-full text-left rounded-2xl border-2 p-4 sm:p-5 transition-all duration-300 ${
                    isSelected ? `${concern.bgLight} ${concern.borderColor} shadow-md scale-[1.02]` : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${concern.gradient} flex items-center justify-center text-white mb-3`}>
                    {concern.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">{concern.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{concern.titleUr}</p>
                  {isSelected && <div className="text-xs font-semibold text-green-600">Viewing →</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected concern detail */}
        {selected && (
          <div className={`rounded-2xl ${selected.bgLight} border ${selected.borderColor} p-6 sm:p-8 transition-all`}>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selected.gradient} flex items-center justify-center text-white mb-4`}>
                  {selected.icon}
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">{selected.title}</h2>
                <p className="text-sm text-gray-400 mb-3" dir="rtl">{selected.titleUr}</p>
                <p className="text-gray-700 leading-relaxed text-base">{selected.description}</p>
              </div>
              <div className="lg:w-80 flex-shrink-0">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-600" /> Wellness Tips
                </h3>
                <ul className="space-y-3 mb-5">
                  {selected.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${selected.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>{i + 1}</div>
                      {tip}
                    </li>
                  ))}
                </ul>
                <Link href="/shop" className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${selected.gradient} hover:opacity-90 transition`}>
                  Browse All Products <FaArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Matched Products — same 5-col grid as shop */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {selected ? `Recommended for ${selected.title}` : 'Explore All Products'}
              </h2>
              <p className="text-sm text-gray-500">{matchedProducts.length} products found</p>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-[#197B33] hover:underline flex items-center gap-1">
              View All <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isProductsLoading ? <GridSkeleton /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 2xl:gap-8">
              {matchedProducts.map((product) => (
                <div key={product.id} className="w-full"><ProductCard product={product} /></div>
              ))}
            </div>
          )}
        </div>

        {/* Why herbal CTA */}
        <div className="bg-green-700 rounded-2xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <FaLeaf className="w-8 h-8 mx-auto mb-3 text-white/70" />
            <h2 className="text-xl font-bold mb-2">Why Choose Herbal Solutions?</h2>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Pansari Inn sources only the purest natural ingredients — no synthetic additives, no harmful chemicals.
              Rooted in centuries of traditional wisdom, crafted to work with your body naturally.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { Icon: FaLeaf,        label: '100% Natural'  },
                { Icon: FaCheckCircle, label: 'Lab Tested'    },
                { Icon: FaShieldAlt,   label: 'Handcrafted'   },
                { Icon: FaCheckCircle, label: 'Certified Pure'},
              ].map(({ Icon, label }) => (
                <div key={label} className="bg-white/10 rounded-xl py-3 px-2 text-center">
                  <Icon className="w-4 h-4 mx-auto mb-1 text-white/80" />
                  <div className="text-xs font-semibold text-white/90">{label}</div>
                </div>
              ))}
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-gray-100 transition px-5 py-2.5 rounded-xl font-bold text-sm">
              Shop All Products <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}