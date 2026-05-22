import dynamic from 'next/dynamic';

// Lazy load all sections using next/dynamic (works in Server Components)
const Banner          = dynamic(() => import("./Sections/Banner"));
const SolutionBar     = dynamic(() => import("./Sections/SolutionBar"));
const FeaturedProducts = dynamic(() => import("./Sections/FeaturedProducts"));
const Category        = dynamic(() => import("./Sections/Category"));
const NewArrivals     = dynamic(() => import("./Sections/NewArrivals"));
const BeautyCorner    = dynamic(() => import("./Sections/BeautyCorner"));
const PansariInn      = dynamic(() => import("./Sections/Pureinnoils"));
const ComboDeal       = dynamic(() => import("./Sections/ComboDeal"));
const VideoProducts   = dynamic(() => import("./Sections/VideoProducts"));
const Review          = dynamic(() => import("./Sections/Review"));
const Blog            = dynamic(() => import("./Sections/Blog"));

export default function DesktopHome() {
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
