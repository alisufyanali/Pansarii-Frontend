'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api, getApiErrorMessage } from '@/lib/axios';
import {
  FaStar, FaGift, FaFire, FaTrophy, FaLeaf, FaCrown,
  FaShoppingBag, FaShare, FaUserFriends, FaCheckCircle,
  FaLock, FaChevronRight, FaPercent, FaTruck, FaTag,
  FaBolt, FaHistory
} from 'react-icons/fa';

// ─── API Types ─────────────────────────────────────────────────────────────────

interface RewardsTransaction {
  id: number;
  label: string;
  points: number;
  created_at: string;
}

interface RewardsData {
  balance: number;
  lifetime_points?: number;
  orders_count?: number;
  tier?: string;
  transactions: RewardsTransaction[];
}

interface RewardsApiResponse {
  success: boolean;
  data: RewardsData;
}

// ─── Static tier / earn / redeem config ───────────────────────────────────────

const tiers = [
  { id: 'seedling', name: 'Seedling', nameUr: 'پودا', minPoints: 0, color: 'text-gray-600',
    gradient: 'from-gray-400 to-gray-500', bgLight: 'bg-gray-50', borderColor: 'border-gray-200',
    icon: <FaLeaf className="w-5 h-5" />,
    perks: ['1 point per PKR 10 spent', 'Birthday bonus points', 'Early sale access'] },
  { id: 'bloom', name: 'Bloom', nameUr: 'کھلنا', minPoints: 500, color: 'text-emerald-600',
    gradient: 'from-emerald-400 to-teal-500', bgLight: 'bg-emerald-50', borderColor: 'border-emerald-200',
    icon: <FaStar className="w-5 h-5" />,
    perks: ['1.5× points multiplier', 'Free shipping on all orders', 'Exclusive member discounts'] },
  { id: 'herb', name: 'Herb Master', nameUr: 'ہربل ماسٹر', minPoints: 1500, color: 'text-amber-600',
    gradient: 'from-amber-400 to-orange-500', bgLight: 'bg-amber-50', borderColor: 'border-amber-200',
    icon: <FaFire className="w-5 h-5" />,
    perks: ['2× points multiplier', 'Free gift on every order', 'Priority customer support', 'Quarterly mystery box'] },
  { id: 'royal', name: 'Royal Healer', nameUr: 'شاہی شفا', minPoints: 5000, color: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-500', bgLight: 'bg-purple-50', borderColor: 'border-purple-200',
    icon: <FaCrown className="w-5 h-5" />,
    perks: ['3× points multiplier', 'Dedicated account manager', 'Free same-day delivery', 'Exclusive product launches', 'Annual luxury hamper'] },
];

const earnWays = [
  { id: 'purchase', title: 'Make a Purchase', titleUr: 'خریداری کریں', pointsLabel: '+1 pt / PKR 10',
    desc: 'Earn 1 point for every PKR 10 you spend on any order.', icon: <FaShoppingBag className="w-5 h-5" />, color: 'text-green-600', bg: 'bg-green-50', cta: 'Shop Now', ctaLink: '/shop' },
  { id: 'review', title: 'Write a Review', titleUr: 'جائزہ لکھیں', pointsLabel: '+50 pts',
    desc: 'Share your experience with a verified product review.', icon: <FaStar className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50', cta: 'Browse Products', ctaLink: '/shop' },
  { id: 'refer', title: 'Refer a Friend', titleUr: 'دوست کو بتائیں', pointsLabel: '+200 pts',
    desc: 'When your friend places their first order using your referral code.', icon: <FaUserFriends className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'share', title: 'Share on Social', titleUr: 'سوشل میڈیا پر شیئر', pointsLabel: '+25 pts',
    desc: 'Share a product or your order on Instagram or Facebook.', icon: <FaShare className="w-5 h-5" />, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'birthday', title: 'Birthday Bonus', titleUr: 'سالگرہ بونس', pointsLabel: '+100 pts/year',
    desc: 'Receive bonus points on your birthday every year automatically.', icon: <FaGift className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'streak', title: 'Monthly Streak', titleUr: 'ماہانہ آرڈر', pointsLabel: '+150 pts',
    desc: 'Place an order every month and earn streak bonus points.', icon: <FaBolt className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-50' },
];

// ─── Redemption note ──────────────────────────────────────────────────────────
// Point redemption API is not yet available. All options are marked
// available: false so they show "Coming Soon" and cannot be clicked.
// When the backend redemption endpoint ships, set available: true and
// wire the button to POST /rewards/redeem with { reward_id: opt.id }.
const redeemOptions = [
  { id: 'r1', title: '5% Discount', titleUr: '5% رعایت', cost: 100, value: '~PKR 150 off', desc: 'Apply as a discount on your next order.', icon: <FaPercent className="w-5 h-5" />, gradient: 'from-green-400 to-emerald-500', available: false },
  { id: 'r2', title: 'Free Shipping', titleUr: 'مفت ترسیل', cost: 150, value: 'Save PKR 200+', desc: 'Free delivery on your next order, any size.', icon: <FaTruck className="w-5 h-5" />, gradient: 'from-blue-400 to-cyan-500', available: false },
  { id: 'r3', title: '10% Discount', titleUr: '10% رعایت', cost: 200, value: '~PKR 300 off', desc: 'Bigger savings on orders over PKR 2,000.', icon: <FaTag className="w-5 h-5" />, gradient: 'from-amber-400 to-orange-500', available: false },
  { id: 'r4', title: 'Free Product Sample', titleUr: 'مفت سیمپل', cost: 350, value: 'Worth PKR 500', desc: 'Choose a free sample added to your next order.', icon: <FaGift className="w-5 h-5" />, gradient: 'from-purple-400 to-pink-500', available: false },
  { id: 'r5', title: '20% Discount', titleUr: '20% رعایت', cost: 500, value: '~PKR 600 off', desc: 'Premium discount on any order over PKR 3,000.', icon: <FaPercent className="w-5 h-5" />, gradient: 'from-rose-400 to-red-500', available: false },
  { id: 'r6', title: 'Luxury Hamper', titleUr: 'لگژری ہیمپر', cost: 5000, value: 'Worth PKR 8,000+', desc: 'Exclusive curated gift set — our premium collections.', icon: <FaTrophy className="w-5 h-5" />, gradient: 'from-yellow-400 to-amber-500', available: false },
];

// ─── Helper: resolve tier from points ─────────────────────────────────────────

function resolveTier(points: number) {
  return [...tiers].reverse().find((t) => t.minPoints <= points) || tiers[0];
}

// ─── PointsBar ─────────────────────────────────────────────────────────────────
function PointsBar({ current }: { current: number }) {
  const currentTier = resolveTier(current);
  const nextTier = tiers.find((t) => t.minPoints > current);
  const pct = nextTier
    ? Math.min(100, ((current - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100)
    : 100;
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-white/60 mb-1.5">
        <span>{currentTier.name} ({current.toLocaleString()} pts)</span>
        <span>{nextTier ? `${nextTier.name} (${nextTier.minPoints.toLocaleString()} pts)` : '🎉 Max tier!'}</span>
      </div>
      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${currentTier.gradient} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      {nextTier && <p className="text-xs text-white/50 mt-1">{(nextTier.minPoints - current).toLocaleString()} more points to {nextTier.name}</p>}
    </div>
  );
}

// ─── TierCard ──────────────────────────────────────────────────────────────────
function TierCard({ tier, isCurrent, userPoints }: { tier: typeof tiers[0]; isCurrent: boolean; userPoints: number }) {
  const isUnlocked = userPoints >= tier.minPoints;
  return (
    <div className={`relative rounded-2xl border-2 p-5 transition-all ${
      isCurrent ? `${tier.bgLight} border-transparent ring-2 ring-offset-2 ring-emerald-400 shadow-lg` :
      isUnlocked ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'
    }`}>
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap shadow">
          Your Tier ✓
        </div>
      )}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center text-white mb-3`}>{tier.icon}</div>
      <h3 className="font-black text-gray-900 text-base">{tier.name}</h3>
      <p className="text-xs text-gray-400 mb-1">{tier.nameUr}</p>
      <p className="text-xs font-medium text-gray-500 mb-3">From {tier.minPoints.toLocaleString()} pts</p>
      <ul className="space-y-1.5">
        {tier.perks.map((perk, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
            <FaCheckCircle className={`w-3 h-3 flex-shrink-0 mt-0.5 ${isUnlocked ? 'text-emerald-500' : 'text-gray-300'}`} />
            {perk}
          </li>
        ))}
      </ul>
      {!isUnlocked && (
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
          <FaLock className="w-3 h-3" /> Need {(tier.minPoints - userPoints).toLocaleString()} more pts
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RewardsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'earn' | 'redeem' | 'tiers'>('overview');
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    api.get<RewardsApiResponse>('/rewards')
      .then((res) => setRewardsData(res.data))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-64 bg-gradient-to-br from-[#197B33] to-emerald-600" />
        <div className="max-w-[1920px] mx-auto px-[4%] py-8 space-y-6">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🌿</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view your rewards</h2>
          <p className="text-gray-500 text-sm mb-6">Earn points on every purchase and unlock exclusive benefits.</p>
          <a href="/login?returnTo=/rewards" className="inline-block px-8 py-3 bg-[#197B33] text-white font-semibold rounded-full hover:bg-[#156529] transition text-sm">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-[#197B33] text-white text-sm font-semibold rounded-2xl">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const points = rewardsData?.balance ?? 0;
  const lifetimePoints = rewardsData?.lifetime_points ?? 0;
  const ordersCount = rewardsData?.orders_count ?? 0;
  const transactions = rewardsData?.transactions ?? [];
  const currentTier = resolveTier(points);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#197B33] via-emerald-700 to-teal-700 text-white">
        <div className="max-w-[1920px] mx-auto px-[4%] py-10 sm:py-14">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                <FaStar className="w-3 h-3 text-yellow-300" /> Pansari Inn Rewards Program
              </div>
              <h1 className="text-3xl sm:text-4xl 2xl:text-5xl font-black mb-2">
                Welcome back, {firstName}! 👋
              </h1>
              <p className="text-white/70 text-sm sm:text-base mb-1">
                You&apos;re a <span className="font-bold text-white">{currentTier.name}</span> member.
              </p>
              <PointsBar current={points} />
            </div>
            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto lg:flex-shrink-0">
              {[
                { label: 'Available Points', value: points.toLocaleString(), sub: 'Redeemable', accent: 'text-yellow-300' },
                { label: 'Lifetime Points', value: lifetimePoints.toLocaleString(), sub: 'Total earned', accent: 'text-emerald-300' },
                { label: 'Orders', value: String(ordersCount), sub: 'Completed', accent: 'text-blue-300' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className={`text-2xl sm:text-3xl font-black ${stat.accent}`}>{stat.value}</div>
                  <div className="text-xs font-semibold text-white/80 mt-1">{stat.label}</div>
                  <div className="text-xs text-white/40">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="flex overflow-x-auto gap-1">
            {([
              { id: 'overview', label: 'Overview' },
              { id: 'earn', label: 'Earn Points' },
              { id: 'redeem', label: 'Redeem' },
              { id: 'tiers', label: 'Tiers' },
            ] as const).map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-5 py-3.5 text-sm font-semibold transition border-b-2 ${
                  activeTab === tab.id ? 'border-[#197B33] text-[#197B33]' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-[4%] py-8 sm:py-12">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <FaShoppingBag className="w-5 h-5" />, label: 'Shop & Earn', sub: 'Earn points now', color: 'bg-green-600', href: '/shop' },
                { icon: <FaGift className="w-5 h-5" />, label: 'Redeem Points', sub: `${points.toLocaleString()} pts available`, color: 'bg-purple-600', onClick: () => setActiveTab('redeem') },
                { icon: <FaUserFriends className="w-5 h-5" />, label: 'Refer & Earn', sub: '+200 pts per referral', color: 'bg-blue-600' },
                { icon: <FaTrophy className="w-5 h-5" />, label: 'View Tiers', sub: `You're ${currentTier.name}`, color: 'bg-amber-600', onClick: () => setActiveTab('tiers') },
              ].map((action, i) => (
                <button key={i} onClick={action.onClick}
                  className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition group">
                  <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition`}>{action.icon}</div>
                  <div className="font-bold text-gray-900 text-sm">{action.label}</div>
                  <div className="text-xs text-gray-400">{action.sub}</div>
                </button>
              ))}
            </div>

            <div className={`rounded-2xl ${currentTier.bgLight} border border-gray-100 p-6 sm:p-8`}>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentTier.gradient} flex items-center justify-center text-white`}>{currentTier.icon}</div>
                  <div>
                    <div className="font-black text-gray-900 text-lg">{currentTier.name} Benefits</div>
                    <div className="text-sm text-gray-500">{currentTier.nameUr}</div>
                  </div>
                </div>
                <button onClick={() => setActiveTab('tiers')} className="text-sm font-semibold text-[#197B33] hover:underline flex items-center gap-1">
                  All tiers <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentTier.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 shadow-sm text-sm text-gray-700">
                    <FaCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {perk}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity — from API */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaHistory className="w-4 h-4 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {transactions.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm text-gray-400">No activity yet. Start shopping to earn points!</div>
                ) : (
                  transactions.slice(0, 10).map((item, i) => (
                    <div key={item.id} className={`flex items-center justify-between px-5 py-4 text-sm ${i < transactions.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div>
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(item.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div className={`font-bold text-base ${item.points >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {item.points >= 0 ? `+${item.points}` : item.points} pts
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── EARN ── */}
        {activeTab === 'earn' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Ways to Earn Points</h2>
              <p className="text-gray-500">Every action brings you closer to better rewards.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {earnWays.map((way) => (
                <div key={way.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                  <div className={`w-12 h-12 ${way.bg} rounded-xl flex items-center justify-center ${way.color} mb-4`}>{way.icon}</div>
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-bold text-gray-900">{way.title}</h3>
                    <div className={`font-black text-lg ${way.color} flex-shrink-0`}>{way.pointsLabel}</div>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{way.titleUr}</p>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">{way.desc}</p>
                  {way.cta && (
                    <Link href={way.ctaLink || '#'} className="w-full py-2.5 text-center rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition">
                      {way.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start">
              <FaFire className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900 mb-1">Points Multiplier Active!</div>
                <p className="text-sm text-gray-600">As a <strong>{currentTier.name}</strong> member, you earn bonus points on every purchase. Upgrade your tier for higher multipliers.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── REDEEM ── */}
        {activeTab === 'redeem' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Redeem Your Points</h2>
                <p className="text-gray-500">You have <strong className="text-[#197B33]">{points.toLocaleString()} points</strong> available to redeem.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {redeemOptions.map((opt) => {
                const canAfford = points >= opt.cost;
                return (
                  <div key={opt.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col ${!opt.available ? 'opacity-60' : ''}`}>
                    <div className={`h-1.5 bg-gradient-to-r ${opt.gradient}`} />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${opt.gradient} rounded-xl flex items-center justify-center text-white`}>{opt.icon}</div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-gray-900">{opt.cost}</div>
                          <div className="text-xs text-gray-400">points</div>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900">{opt.title}</h3>
                      <p className="text-xs text-gray-400 mb-1">{opt.titleUr}</p>
                      <p className="text-sm text-gray-600 flex-1 mb-1 leading-relaxed">{opt.desc}</p>
                      <p className="text-xs font-semibold text-emerald-600 mb-4">{opt.value}</p>
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed">
                        Coming Soon
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TIERS ── */}
        {activeTab === 'tiers' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Membership Tiers</h2>
              <p className="text-gray-500">Earn points and unlock better perks at each level.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tiers.map((tier) => (
                <TierCard key={tier.id} tier={tier} isCurrent={tier.id === currentTier.id} userPoints={points} />
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 overflow-x-auto">
              <h3 className="font-bold text-gray-900 mb-5">Tier Comparison</h3>
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 text-gray-500 font-medium">Perk</th>
                    {tiers.map((t) => (
                      <th key={t.id} className={`text-center py-2 px-3 font-bold ${t.id === currentTier.id ? 'text-emerald-600' : 'text-gray-700'}`}>{t.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Points Multiplier', '1×', '1.5×', '2×', '3×'],
                    ['Free Shipping', '—', '✅', '✅', '✅'],
                    ['Priority Support', '—', '—', '✅', '✅'],
                    ['Gift with Order', '—', '—', '✅', '✅'],
                    ['Personal Manager', '—', '—', '—', '✅'],
                    ['Luxury Hamper', '—', '—', '—', '✅'],
                  ].map(([label, ...vals], i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-3 pr-4 text-gray-600">{label}</td>
                      {vals.map((v, j) => (
                        <td key={j} className={`text-center py-3 px-3 font-medium ${j === tiers.findIndex((t) => t.id === currentTier.id) ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gradient-to-br from-[#197B33] to-emerald-600 rounded-2xl p-6 sm:p-8 text-white text-center">
              <h3 className="text-xl font-black mb-2">Ready to Level Up?</h3>
              <p className="text-white/75 text-sm mb-5">Place more orders, write reviews, and refer friends to earn points faster.</p>
              <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-[#197B33] hover:bg-gray-100 transition px-6 py-3 rounded-xl font-bold text-sm">
                Start Earning Now <FaChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
