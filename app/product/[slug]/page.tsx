"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductDetails from '@/app/Desktop/components/ProductDetails';
import ProductDetailsSection from '@/app/Desktop/Sections/ProductDetailsSection';
import { allProducts } from '@/app/Desktop/data/products';
import { FaArrowLeft, FaHome, FaStore } from 'react-icons/fa'; 

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find product by slug or ID
    const slug = params.slug as string;
    const productName = slug.replace(/-/g, ' '); // Convert slug back to name
    
    // Find product in your data
    const foundProduct = allProducts.find(p => 
      p.nameEn.toLowerCase().includes(productName.toLowerCase()) ||
      p.id.toString() === slug
    );

    if (foundProduct) {
      // Transform your product data to match ProductDetails props with dynamic features
      const transformedProduct = {
        img: foundProduct.img,
        additionalImages: foundProduct.additionalImages || [
          '/images/category.png',
          '/images/Skincare.png',
          '/images/whisk.png',
        ],
        nameEn: foundProduct.nameEn,
        nameUr: foundProduct.nameUr || foundProduct.nameEn,
        description: foundProduct.description || "Pure ayurvedic product for natural wellness",
        rating: foundProduct.rating || 4.5,
        reviews: foundProduct.reviews || 100,
        price: foundProduct.price,
        oldPrice: foundProduct.oldPrice,
        sale: foundProduct.sale || "20% OFF",
        productId: foundProduct.id,
        // Dynamic features based on product type
        features: getProductFeatures(foundProduct),
        sizes: ["15ml", "30ml", "60ml", "120ml", "150ml"],
        points: Math.floor(foundProduct.price / 100) || 14,
        benefits: getProductBenefits(foundProduct),
        infoLines: [
          "100% Ayurvedic & Herbal Product",
          "Free Delivery On All Orders Above ₹399",
          "GST Included in Price",
          "Certified Organic Ingredients"
        ]
      };
      
      setProduct(transformedProduct);
      
      // Find related products based on category
      const related = allProducts
        .filter(p => 
          p.category === foundProduct.category && 
          p.id !== foundProduct.id
        )
        .slice(0, 4)
        .map(p => ({
          ...p,
          features: getProductFeatures(p).slice(0, 2)
        }));
      
      setRelatedProducts(related);
    } else {
      // Redirect to shop if product not found
      router.push('/shop');
    }
    
    setLoading(false);
  }, [params.slug, router]);

  // Helper function to get product features based on product type
  const getProductFeatures = (product: any) => {
    const baseFeatures = [
      {
        text: "100% Natural & Organic",
        icon: "/icons/natural.svg",
        hasCheck: true
      },
      {
        text: "No Chemical Preservatives",
        icon: "/icons/chemical-free.svg",
        hasCheck: true
      },
      {
        text: "Cruelty Free",
        icon: "/icons/cruelty-free.svg",
        hasCheck: true
      },
      {
        text: "Ayurvedic Formulation",
        icon: "/icons/ayurvedic.svg",
        hasCheck: true
      },
      {
        text: "Gluten Free",
        icon: "/icons/gluten-free.svg",
        hasCheck: true
      },
      {
        text: "Vegan Friendly",
        icon: "/icons/vegan.svg",
        hasCheck: true
      }
    ];

    // Add specific features based on product category
    const categoryFeatures: any[] = [];
    
    if (product.category?.toLowerCase().includes('skin')) {
      categoryFeatures.push(
        {
          text: "Anti-Aging Properties",
          icon: "/icons/anti-aging.svg",
          hasCheck: true
        },
        {
          text: "Moisturizing Effect",
          icon: "/icons/moisturizing.svg",
          hasCheck: true
        },
        {
          text: "Brightens Skin Tone",
          icon: "/icons/brightening.svg",
          hasCheck: true
        }
      );
    }
    
    if (product.category?.toLowerCase().includes('hair')) {
      categoryFeatures.push(
        {
          text: "Promotes Hair Growth",
          icon: "/icons/hair-growth.svg",
          hasCheck: true
        },
        {
          text: "Reduces Hair Fall",
          icon: "/icons/hair-fall.svg",
          hasCheck: true
        },
        {
          text: "Strengthens Hair Roots",
          icon: "/icons/strengthening.svg",
          hasCheck: true
        }
      );
    }
    
    if (product.category?.toLowerCase().includes('oil')) {
      categoryFeatures.push(
        {
          text: "Cold Pressed Extraction",
          icon: "/icons/cold-pressed.svg",
          hasCheck: true
        },
        {
          text: "Pure & Unrefined",
          icon: "/icons/pure.svg",
          hasCheck: true
        },
        {
          text: "Rich in Antioxidants",
          icon: "/icons/antioxidant.svg",
          hasCheck: true
        }
      );
    }

    return [...categoryFeatures, ...baseFeatures].slice(0, 8);
  };

  // Helper function to get product benefits
  const getProductBenefits = (product: any) => {
    const baseBenefits = [
      "Helps in hormonal balance",
      "Improves digestion & metabolism",
      "Enhances hair and skin health"
    ];

    if (product.category?.toLowerCase().includes('skin')) {
      return [
        "Provides deep hydration",
        "Reduces signs of aging",
        "Improves skin elasticity"
      ];
    }
    
    if (product.category?.toLowerCase().includes('hair')) {
      return [
        "Promotes hair growth",
        "Reduces dandruff",
        "Strengthens hair follicles"
      ];
    }
    
    if (product.category?.toLowerCase().includes('oil')) {
      return [
        "Nourishes from within",
        "Improves skin texture",
        "Boosts overall wellness"
      ];
    }

    return baseBenefits;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-green-700 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-green-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-green-700 mt-6 font-medium">Loading product details...</p>
          <p className="text-gray-500 text-sm mt-2">Preparing your ayurvedic experience</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <div className="text-4xl">😕</div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The ayurvedic product you're looking for doesn't exist or may have been moved.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <FaHome className="w-4 h-4" />
              Back to Home
            </button>
            <button 
              onClick={() => router.push('/shop')}
              className="px-6 py-3 border-2 border-green-700 text-green-700 rounded-full hover:bg-green-50 transition flex items-center justify-center gap-2"
            >
              <FaStore className="w-4 h-4" /> {/* Changed FaShop to FaStore */}
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare legacy product format for ProductDetailsSection
  const legacyProduct = {
    ...product,
    features: product.features.map((f: any) => 
      f.hasCheck ? `✓ ${f.text}` : `○ ${f.text}`
    ),
    // Add related products
    relatedProducts: relatedProducts.map(p => ({
      id: p.id,
      img: p.img,
      nameEn: p.nameEn,
      nameUr: p.nameUr || p.nameEn,
      price: p.price,
      oldPrice: p.oldPrice,
      rating: p.rating,
      sale: p.sale,
      category: p.category
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
    
      {/* Product Details Component - Dynamic with icons */}
      <ProductDetails product={product} />

      {/* Product Details Section - Using legacy format with related products */}
      <ProductDetailsSection product={legacyProduct} />

     
    </div>
  );
}