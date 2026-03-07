"use client";
import Image from "next/image";

export default function Banner() {
  const bannerImg = '/images/Banner.png';

  return (
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
        alt="Pansari Inn Banner"
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
              ✨ 100% Natural & Authentic
            </p>

            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              fontFamily: 'Lexend, sans-serif',
              color: '#005316'
            }}>
              Pansari Inn
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
              Nature heals 🌿 Handmade | Herbal Haircare | Plant Based Skincare | Women owned family business
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
                href="/remedies"
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
                Explore Remedies <span style={{ marginLeft: '0.5rem', fontSize: '1.125rem' }}>&gt;</span>
              </a>
            </div>
          </div>
          <div style={{ width: '50%' }}></div>
        </div>
      </div>
    </div>
  );
}