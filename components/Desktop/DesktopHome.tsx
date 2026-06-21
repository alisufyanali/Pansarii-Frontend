import dynamic from 'next/dynamic';
import Banner from "./Sections/Banner";

// Lazy load below-the-fold sections only
const SolutionBar     = dynamic(() => import("./Sections/SolutionBar"), { ssr: false });
const CategoryProductsSection = dynamic(() => import("./Sections/CategoryProductsSection"), { ssr: false });
const Category        = dynamic(() => import("./Sections/Category"), { ssr: false });
const NewArrivals     = dynamic(() => import("./Sections/NewArrivals"), { ssr: false });
const BeautyCorner    = dynamic(() => import("./Sections/BeautyCorner"), { ssr: false });
const PansariInn      = dynamic(() => import("./Sections/Pureinnoils"), { ssr: false });
const ComboDeal       = dynamic(() => import("./Sections/ComboDeal"), { ssr: false });
const VideoProducts   = dynamic(() => import("./Sections/VideoProducts"), { ssr: false });
const Review          = dynamic(() => import("./Sections/Review"), { ssr: false });
const Blog            = dynamic(() => import("./Sections/Blog"), { ssr: false });

export default function DesktopHome() {
  return (
    <>
      <Banner />
      <SolutionBar />
      <CategoryProductsSection />
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
