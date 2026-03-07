"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import ProductCard2 from '@components/ProductCard2';
import ForwardArrow from '@components/ForwardArrow';
import BackwardArrow from '@components/BackwardArrow';

export default function ComboDeal() {
  const banner4Img = '/images/Banner4.png';
  const productImg = '/images/product.png';
  const hoverimg = '/images/category.png';

  const comboProducts = [
    { img: productImg, nameEn: 'Hibiscus Tea', nameUr: 'ہیبسکس چائے', description: 'Natural Tea', rating: 4.7, reviews: 406, price: 1149, oldPrice: 1299, sale: '20% OFF', hoverimg },
    { img: productImg, nameEn: 'Green Tea', nameUr: 'گرین ٹی', description: 'Organic Tea', rating: 4.5, reviews: 320, price: 999, oldPrice: 1200, sale: '15% OFF', hoverimg },
    { img: productImg, nameEn: 'Black Tea', nameUr: 'کالی چائے', description: 'Strong Tea', rating: 4.8, reviews: 512, price: 1149, oldPrice: 1399, sale: '18% OFF', hoverimg },
    { img: productImg, nameEn: 'Chamomile Tea', nameUr: 'کملی چائے', description: 'Relaxing Tea', rating: 4.6, reviews: 280, price: 899, oldPrice: 1099, sale: '10% OFF', hoverimg },
    { img: productImg, nameEn: 'Hibiscus Tea', nameUr: 'ہیبسکس چائے', description: 'Natural Tea', rating: 4.7, reviews: 406, price: 1149, oldPrice: 1299, sale: '20% OFF', hoverimg },
    { img: productImg, nameEn: 'Green Tea', nameUr: 'گرین ٹی', description: 'Organic Tea', rating: 4.5, reviews: 320, price: 999, oldPrice: 1200, sale: '15% OFF', hoverimg },
    { img: productImg, nameEn: 'Black Tea', nameUr: 'کالی چائے', description: 'Strong Tea', rating: 4.8, reviews: 512, price: 1149, oldPrice: 1399, sale: '18% OFF', hoverimg },
    { img: productImg, nameEn: 'Hibiscus Tea', nameUr: 'ہیبسکس چائے', description: 'Natural Tea', rating: 4.7, reviews: 406, price: 1149, oldPrice: 1299, sale: '20% OFF', hoverimg },
    { img: productImg, nameEn: 'Green Tea', nameUr: 'گرین ٹی', description: 'Organic Tea', rating: 4.5, reviews: 320, price: 999, oldPrice: 1200, sale: '15% OFF', hoverimg },
    { img: productImg, nameEn: 'Black Tea', nameUr: 'کالی چائے', description: 'Strong Tea', rating: 4.8, reviews: 512, price: 1149, oldPrice: 1399, sale: '18% OFF', hoverimg },
    { img: productImg, nameEn: 'Green Tea', nameUr: 'گرین ٹی', description: 'Organic Tea', rating: 4.5, reviews: 320, price: 999, oldPrice: 1200, sale: '15% OFF', hoverimg },
    { img: productImg, nameEn: 'Black Tea', nameUr: 'کالی چائے', description: 'Strong Tea', rating: 4.8, reviews: 512, price: 1149, oldPrice: 1399, sale: '18% OFF', hoverimg },
    { img: productImg, nameEn: 'Green Tea', nameUr: 'گرین ٹی', description: 'Organic Tea', rating: 4.5, reviews: 320, price: 999, oldPrice: 1200, sale: '15% OFF', hoverimg },
    { img: productImg, nameEn: 'Black Tea', nameUr: 'کالی چائے', description: 'Strong Tea', rating: 4.8, reviews: 512, price: 1149, oldPrice: 1399, sale: '18% OFF', hoverimg },
  ];

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const cardEl = el.querySelector('.card-item') as HTMLElement;
    const cardWidth = cardEl ? cardEl.offsetWidth + 24 : 324;
    el.scrollBy({
      left: direction === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
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
          src={banner4Img}
          alt="Combo Deals Banner"
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
                🎉 Special Offers
              </p>

              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                fontFamily: 'Lexend, sans-serif',
                color: '#005316'
              }}>
                Combo Deals
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
                Save big with our exclusive combos 🛒 | Buy 2 Get 1 Free | Limited time offers | Free shipping
              </p>

              <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                gap: '1rem'
              }}>
                <a
                  href="/combo-deals"
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
                  View Combos <span style={{ marginLeft: '0.5rem', fontSize: '1.125rem' }}>&gt;</span>
                </a>
                <a
                  href="/all-products"
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
                  All Products <span style={{ marginLeft: '0.5rem', fontSize: '1.125rem' }}>&gt;</span>
                </a>
              </div>
            </div>
            <div style={{ width: '50%' }}></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 4%' }}>
        <div style={{ maxWidth: '1920px', margin: '0 auto' }}>
          {/* Section Heading */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '3rem',
            marginBottom: '1rem'
          }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif'
            }}>
              Combo <span style={{ color: '#197B33' }}>Deals</span>
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <BackwardArrow disabled={!canScrollLeft} onClick={() => scroll("left")} />
              <ForwardArrow disabled={!canScrollRight} onClick={() => scroll("right")} />
            </div>
          </div>

          {/* Product Cards - Horizontal Slider */}
          <div
            ref={sliderRef}
            style={{
              display: 'flex',
              gap: '1.5rem',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              paddingBottom: '5rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {comboProducts.map((product, index) => (
              <div
                key={index}
                className="card-item"
                style={{
                  flexShrink: 0,
                  width: 'clamp(260px, calc((min(100vw, 1920px) - 8vw - 72px) / 4), 460px)'
                }}
              >
                <ProductCard2 product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}