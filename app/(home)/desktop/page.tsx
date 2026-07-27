import dynamic from 'next/dynamic';

// Lazy load all sections using next/dynamic (works in Server Components)
const Banner          = dynamic(() => import("../../../components/Desktop/Sections/Banner"));
const SolutionBar     = dynamic(() => import("../../../components/Desktop/Sections/SolutionBar"));
const FeaturedProducts = dynamic(() => import("../../../components/Desktop/Sections/FeaturedProducts"));
const Category        = dynamic(() => import("../../../components/Desktop/Sections/Category"));
const NewArrivals     = dynamic(() =>
  import("../../../components/Desktop/Sections/NewArrivals").then(m => ({ default: m.NewArrivalsLoader }))
);
const BeautyCorner    = dynamic(() => import("../../../components/Desktop/Sections/BeautyCorner"));
const PansariInn      = dynamic(() => import("../../../components/Desktop/Sections/Pureinnoils"));
const ComboDeal       = dynamic(() => import("../../../components/Desktop/Sections/ComboDeal"));
const VideoProducts   = dynamic(() => import("../../../components/Desktop/Sections/VideoProducts"));
const Review          = dynamic(() => import("../../../components/Desktop/Sections/Review"));
const Blog            = dynamic(() => import("../../../components/Desktop/Sections/Blog"));



// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Banner />
      <SolutionBar />
      <FeaturedProducts />
      <Category />
      <NewArrivals />
      <BeautyCorner />
      <PansariInn />
      <ComboDeal />
      <VideoProducts />
      <Review />
      <Blog />
    </>
  );
}
