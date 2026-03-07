"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import ProductCard from "@components/ProductCard";

export default function BeautyCorner() {
  const beautyCornerImg = '/images/beautycorner.png';
  const productimg = '/images/product.png';
  const productHoverImg = '/images/product-hover.png';

  const products = [
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Organic Lavender Essential Oil', nameUr: 'روغن باکان بيد', description: 'Natural DHT Blocker | With Saw...', rating: 4.7, reviews: 406, price: 1149, oldPrice: 1499, sale: '20% OFF' },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Green Tea Extract', nameUr: 'گرین ٹی کا عرق', description: 'Boosts metabolism...', rating: 4.6, reviews: 320, price: 999 },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Chamomile Essential Oil', nameUr: 'کیمومائل تیل', description: 'Relaxing & soothing oil...', rating: 4.8, reviews: 210, price: 1199, sale: '15% OFF' },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Mint Herbal Oil', nameUr: 'پودینے کا تیل', description: 'Refreshing oil...', rating: 4.5, reviews: 180, price: 899 },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Rosehip Oil', nameUr: 'گلاب ہپ تیل', description: 'Anti-aging...', rating: 4.6, reviews: 220, price: 1099 },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Argan Oil', nameUr: 'ارگن کا تیل', description: 'Hair & skin care...', rating: 4.7, reviews: 150, price: 1299 },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Jojoba Oil', nameUr: 'جوجوبا تیل', description: 'Moisturizing...', rating: 4.5, reviews: 180, price: 999 },
    { img: productimg, hoverImg: productHoverImg, nameEn: 'Tea Tree Oil', nameUr: 'ٹی ٹری آئل', description: 'Acne control...', rating: 4.6, reviews: 210, price: 1199 },
  ];

  const [cardsToShow, setCardsToShow] = useState(4);

  const updateCardsToShow = () => {
    const width = window.innerWidth;
    if (width >= 2560) setCardsToShow(8);
    else if (width >= 1920) setCardsToShow(6);
    else if (width >= 1280) setCardsToShow(4);
    else if (width >= 768) setCardsToShow(2);
    else setCardsToShow(1);
  };

  useEffect(() => {
    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  return (
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
          src={beautyCornerImg}
          alt="Beauty Corner Banner"
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
                ✨ Natural Beauty
              </p>

              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                fontFamily: 'Lexend, sans-serif',
                color: '#005316'
              }}>
                Beauty Corner
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
                Discover natural beauty products 🌸 | Organic Skincare | Herbal Cosmetics | Cruelty-free
              </p>

              <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                gap: '1rem'
              }}>
                <a
                  href="/shop"
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
                  Shop Now <span style={{ marginLeft: '0.5rem', fontSize: '1.125rem' }}>&gt;</span>
                </a>
                <a
                  href="/beauty-tips"
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
                  Beauty Tips <span style={{ marginLeft: '0.5rem', fontSize: '1.125rem' }}>&gt;</span>
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
              Beauty <span style={{ color: '#197B33' }}>Corner</span>
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
}