"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from '@components/ProductCard';

export default function PansariInn() {
  const banner2Img = '/images/Banner2.png';
  const banner3Img = '/images/Banner3.png';
  const productImg = '/images/product.png';
  const productHoverImg = '/images/product-hover.png';

  const productsRow = [
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Cold Pressed Almond Oil', nameUr: 'بادام کا تیل', description: 'Pure & Organic Almond Oil', rating: 4.8, reviews: 320, price: 899, oldPrice: 1099, sale: '15% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Organic Coconut Oil', nameUr: 'ناریل کا تیل', description: 'Virgin Coconut Oil for Skin & Hair', rating: 4.7, reviews: 412, price: 749, oldPrice: 999, sale: '25% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Black Seed Oil', nameUr: 'کلونجی کا تیل', description: 'Cold Pressed Black Seed Oil', rating: 4.9, reviews: 220, price: 1299, oldPrice: 1599, sale: '20% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Argan Oil', nameUr: 'ارگن آئل', description: 'Moroccan Argan Oil', rating: 4.6, reviews: 305, price: 1399, oldPrice: 1699, sale: '18% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Sesame Oil', nameUr: 'تل کا تیل', description: 'Cold Pressed Sesame Oil', rating: 4.5, reviews: 180, price: 699, oldPrice: 899, sale: '20% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Mustard Oil', nameUr: 'سرسوں کا تیل', description: 'Organic Mustard Oil', rating: 4.7, reviews: 250, price: 799, oldPrice: 999, sale: '15% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Argan Oil', nameUr: 'ارگن آئل', description: 'Moroccan Argan Oil', rating: 4.6, reviews: 305, price: 1399, oldPrice: 1699, sale: '18% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Sesame Oil', nameUr: 'تل کا تیل', description: 'Cold Pressed Sesame Oil', rating: 4.5, reviews: 180, price: 699, oldPrice: 899, sale: '20% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Argan Oil', nameUr: 'ارگن آئل', description: 'Moroccan Argan Oil', rating: 4.6, reviews: 305, price: 1399, oldPrice: 1699, sale: '18% OFF' },
    { img: productImg, hoverImg: productHoverImg, nameEn: 'Sesame Oil', nameUr: 'تل کا تیل', description: 'Cold Pressed Sesame Oil', rating: 4.5, reviews: 180, price: 699, oldPrice: 899, sale: '20% OFF' },
  ];

  const [cardsToShow, setCardsToShow] = useState(4);

  const updateLayout = () => {
    const width = window.innerWidth;
    if (width >= 1920) setCardsToShow(6);
    else if (width >= 1536) setCardsToShow(5);
    else if (width >= 1280) setCardsToShow(4);
    else if (width >= 1024) setCardsToShow(3);
    else if (width >= 768) setCardsToShow(2);
    else setCardsToShow(1);
  };

  useEffect(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const renderSection = (bannerTitle: string, bannerImg: string, title: string, products: any[]) => (
    <div style={{ marginTop: '3rem' }}>
      {/* Banner with exact structure from sample */}
      <div 
        className="banner"
        style={{
          height: '90vh',
          minHeight: '50rem',
          maxHeight: '90rem',
          width: '100%',
          position: 'relative'
        }}
      >
        <Image
          src={bannerImg}
          alt={`${bannerTitle} Banner`}
          width={1920}
          height={1080}
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover'
          }}
          priority
        />
        
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1
        }}></div>

        {/* Content Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          padding: '0 4%'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '1920px',
            margin: '0 auto',
            display: 'flex'
          }}>
            <div style={{
              width: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 1rem',
              gap: '1rem'
            }}>
              <p style={{
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: 'Lexend, sans-serif',
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#6C3F3F'
              }}>
                🌿 Pure & Natural
              </p>

              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                fontFamily: 'Lexend, sans-serif',
                color: '#005316'
              }}>
                {title}
              </h1>

              <p style={{
                fontSize: '18px',
                fontWeight: 500,
                fontFamily: 'Poppins, sans-serif',
                lineHeight: '140%',
                letterSpacing: '0%',
                color: '#000000',
                maxWidth: '32rem'
              }}>
                Cold pressed oils for health & beauty | 100% Organic | Chemical-free | Family tradition since 1980
              </p>

              <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                gap: '1rem'
              }}>
                <a
                  href="/shop/oils"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    backgroundColor: '#FAA944',
                    color: '#000000',
                    padding: '16px 24px',
                    borderRadius: '45px',
                    fontFamily: 'Poppins, sans-serif',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s'
                  }}
                >
                  Shop Oils <span style={{ marginLeft: '0.5rem', fontSize: '1.125rem' }}>&gt;</span>
                </a>
                <a
                  href="/oil-guide"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    backgroundColor: '#197B33',
                    color: '#ffffff',
                    padding: '16px 24px',
                    borderRadius: '45px',
                    fontFamily: 'Poppins, sans-serif',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s'
                  }}
                >
                  Oil Guide <span style={{ marginLeft: '0.5rem', fontSize: '1.125rem' }}>&gt;</span>
                </a>
              </div>
            </div>
            <div style={{ width: '50%' }}></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: '0 4%' }}>
        <div style={{ maxWidth: '1920px', margin: '0 auto' }}>
          {/* Heading and View All */}
          <div style={{
            marginTop: '4rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif'
            }}>
              PureInn <span style={{ color: '#197B33' }}>Oils</span>
            </h2>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer'
            }}>
              <span style={{
                color: '#000',
                fontWeight: 600,
                transition: 'color 0.2s'
              }}>View All</span>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: '#1A1A1A1A',
                color: '#000',
                transition: 'all 0.2s'
              }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>&gt;</span>
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            paddingBottom: '5rem',
            gridTemplateColumns: `repeat(${cardsToShow}, 1fr)`
          }}>
            {products.slice(0, cardsToShow).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderSection('Pansari Inn Oils', banner2Img, 'Pansari Inn Oils', productsRow.slice(0, 6))}
      {renderSection('Pansari Inn Premium', banner3Img, 'Premium Collection', productsRow.slice(0, 6))}
    </>
  );
}