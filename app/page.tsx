'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const stats = [
  { value: '250+', label: 'Properties Listed' },
  { value: '180+', label: 'Happy Clients' },
  { value: '12+', label: 'Years Experience' },
  { value: '98%', label: 'Client Satisfaction' },
];

const featuredProperties = [
  {
    id: 1,
    title: 'Luxury Double Storey — Suburbs',
    type: 'For Sale',
    category: 'Residential',
    price: '$250,000',
    beds: 5,
    baths: 3,
    size: '2,776 SQM',
    location: 'Suburbs, Bulawayo',
  },
  {
    id: 2,
    title: 'Residential House — Cowdray Park',
    type: 'For Sale',
    category: 'House',
    price: '$30,000',
    beds: 3,
    baths: 1,
    size: '438 SQM',
    location: 'Cowdray Park, Bulawayo',
  },
  {
    id: 3,
    title: 'Prime Commercial Stand',
    type: 'For Sale',
    category: 'Commercial',
    price: '$15,000',
    beds: null,
    baths: null,
    size: '50 SQM',
    location: 'Nkulumane 12, Bulawayo',
  },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        background: 'var(--bg-primary)',
        minHeight: '100vh',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 2rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(7,11,20,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src='/assets/logo-transparent.png'
            alt='Realgate Properties'
            style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Home', 'For Sale', 'To Rent', 'About', 'Contact'].map((link) => (
            <a
              key={link}
              href='#'
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--text-primary)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--text-secondary)')
              }
            >
              {link}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link
            href='/signin'
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Sign In
          </Link>
          <Link
            href='/signup'
            style={{
              background: 'var(--accent-blue)',
              color: 'white',
              textDecoration: 'none',
              padding: '8px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
            linear-gradient(rgba(37,99,235,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.03) 1px, transparent 1px)
          `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            gap: '4rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Left */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(37,99,235,0.1)',
                border: '1px solid var(--border-blue)',
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '13px',
                color: 'var(--accent-blue-light)',
                marginBottom: '2rem',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--accent-blue-light)',
                  display: 'inline-block',
                }}
              />
              Bulawayo's Trusted Property Experts
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em',
              }}
            >
              Secure Your
              <br />
              <span style={{ color: 'var(--accent-blue-light)' }}>Future.</span>
            </h1>

            <p
              style={{
                fontSize: '17px',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                maxWidth: '480px',
                marginBottom: '2.5rem',
              }}
            >
              Find your perfect property in Zimbabwe. Whether buying, selling,
              or renting — our dedicated team guides you every step of the way.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                href='#properties'
                style={{
                  background: 'var(--accent-blue)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '15px',
                }}
              >
                Explore Properties
              </Link>
              <Link
                href='/signin'
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  fontWeight: 500,
                  fontSize: '15px',
                }}
              >
                Agent Portal →
              </Link>
            </div>
          </div>

          {/* Right — Stats card */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '440px',
              }}
            >
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                }}
              >
                Our Track Record
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5rem',
                }}
              >
                {stats.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: 'var(--accent-blue-light)',
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        marginTop: '4px',
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(37,99,235,0.08)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-blue)',
                }}
              >
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  📍 No.50A Josiah Tongogara Street, Bulawayo
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginTop: '4px',
                  }}
                >
                  📞 +263 292 260870 / +263 781 481152
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter + Properties ── */}
      <section
        id='properties'
        style={{ padding: '5rem 4rem', background: 'var(--bg-secondary)' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
            }}
          >
            <div>
              <p
                style={{
                  color: 'var(--accent-blue-light)',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Properties
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.2rem',
                  fontWeight: 700,
                }}
              >
                Featured Listings
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'For Sale', 'To Rent'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    background:
                      filterType === f
                        ? 'var(--accent-blue)'
                        : 'var(--bg-card)',
                    color: filterType === f ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
            }}
          >
            {featuredProperties.map((p) => (
              <div
                key={p.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, border-color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    'var(--border-blue)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    'var(--border)';
                }}
              >
                {/* Image placeholder */}
                <div
                  style={{
                    height: '200px',
                    background:
                      'linear-gradient(135deg, #0d1526 0%, #1a2540 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>🏠</span>
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'var(--accent-blue)',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {p.type}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'var(--text-secondary)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  >
                    {p.category}
                  </span>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '13px',
                      marginBottom: '1rem',
                    }}
                  >
                    📍 {p.location}
                  </p>

                  {p.beds && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '1rem',
                      }}
                    >
                      {[
                        `🛏 ${p.beds} Beds`,
                        `🚿 ${p.baths} Baths`,
                        `📐 ${p.size}`,
                      ].map((d) => (
                        <span
                          key={d}
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        color: 'var(--accent-blue-light)',
                      }}
                    >
                      {p.price}
                    </span>
                    <button
                      style={{
                        background: 'rgba(37,99,235,0.1)',
                        border: '1px solid var(--border-blue)',
                        color: 'var(--accent-blue-light)',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}
                    >
                      View →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ padding: '5rem 4rem' }}>
        <div
          style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}
        >
          <p
            style={{
              color: 'var(--accent-blue-light)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Why Realgate
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.2rem',
              fontWeight: 700,
              marginBottom: '3rem',
            }}
          >
            Built on Trust & Expertise
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
            }}
          >
            {[
              {
                icon: '🎯',
                title: 'Expert Market Knowledge',
                desc: 'In-depth understanding of the Zimbabwean real estate market ensures accurate, up-to-date advice.',
              },
              {
                icon: '🤝',
                title: 'Personalised Service',
                desc: 'We tailor every experience to your unique needs, from property search to final negotiation.',
              },
              {
                icon: '🛡️',
                title: 'Trusted & Reliable',
                desc: 'A strong reputation for integrity and transparency built over 12+ years in the industry.',
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '2rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '4rem', background: 'var(--bg-secondary)' }}>
        <div
          style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.2rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            Ready to Find Your Perfect Property?
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              fontSize: '16px',
            }}
          >
            Join hundreds of satisfied clients who found their dream home with
            Realgate Properties.
          </p>
          <Link
            href='/signup'
            style={{
              background: 'var(--accent-blue)',
              color: 'white',
              textDecoration: 'none',
              padding: '14px 40px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '16px',
              display: 'inline-block',
            }}
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{ padding: '2rem 4rem', borderTop: '1px solid var(--border)' }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <img
            src='/assets/logo.ico'
            alt='Realgate Properties'
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            © 2025 Realgate Properties, Bulawayo Zimbabwe
          </span>
        </div>
      </footer>
    </div>
  );
}
