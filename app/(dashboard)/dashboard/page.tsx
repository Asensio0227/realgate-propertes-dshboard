'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

interface Property {
  _id:       string;
  title:     string;
  type:      string;
  category:  string;
  location:  string;
  price?:    number;
  available: boolean;
  createdAt: string;
}

interface Stats {
  total:     number;
  forSale:   number;
  forRent:   number;
  available: number;
}

function StatCard({ label, value, icon, color, sub }: { label: string; value: number | string; icon: string; color: string; sub?: string }) {
  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px 22px',
      transition: 'border-color .15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-2)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <span style={{ fontSize: '20px', color }}>{icon}</span>
        <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: '30px', fontWeight: 800, marginBottom: '4px' }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const { user, setUser } = useAuthStore();
  const [stats,  setStats]  = useState<Stats>({ total: 0, forSale: 0, forRent: 0, available: 0 });
  const [recent, setRecent] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate user from server if store is empty (e.g. after hard reload)
    if (!user) {
      fetch('/api/auth/me')
        .then(r => r.json())
        .then(d => { if (d.user) setUser(d.user); })
        .catch(() => {});
    }

    fetch('/api/properties?limit=50')
      .then(r => r.json())
      .then(data => {
        const props: Property[] = data.properties ?? [];
        setStats({
          total:     props.length,
          forSale:   props.filter(p => p.type === 'sale').length,
          forRent:   props.filter(p => p.type === 'rent').length,
          available: props.filter(p => p.available).length,
        });
        setRecent(props.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const BADGE: Record<string, [string, string]> = {
    sale:  ['rgba(16,185,129,.15)', '#34d399'],
    rent:  ['rgba(245,158,11,.15)', '#fbbf24'],
    house: ['rgba(37,99,235,.15)',  '#60a5fa'],
    apartment: ['rgba(99,102,241,.15)', '#a5b4fc'],
    commercial: ['rgba(245,158,11,.15)', '#fbbf24'],
    land:  ['rgba(239,68,68,.15)',  '#fca5a5'],
  };

  function Badge({ v }: { v: string }) {
    const [bg, color] = BADGE[v] ?? ['rgba(255,255,255,.06)', '#7b8db8'];
    return (
      <span style={{ background: bg, color, padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 500, textTransform: 'capitalize' }}>{v}</span>
    );
  }

  return (
    <div>
      {/* Greeting */}
      <div className="fu" style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>
          Good day, {user?.name?.split(' ')[0] ?? 'Agent'} 👋
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '13px' }}>
          Here's a snapshot of the Realgate portfolio.
        </p>
      </div>

      {/* Stat cards */}
      <div className="fu1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '32px' }}>
        <StatCard label="Total Properties" value={stats.total}     icon="⊞" color="#2563eb" sub="all listings" />
        <StatCard label="Available"        value={stats.available} icon="◉" color="#10b981" sub="ready to view" />
        <StatCard label="For Sale"         value={stats.forSale}   icon="◈" color="#f59e0b" sub="sale listings" />
        <StatCard label="For Rent"         value={stats.forRent}   icon="◎" color="#7c3aed" sub="rental listings" />
      </div>

      {/* Recent properties */}
      <div className="fu2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '16px', fontWeight: 700 }}>Recent Properties</h2>
          <Link href="/properties" style={{ color: 'var(--blue-light)', fontSize: '12px', fontWeight: 500 }}>
            View all →
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)', fontSize: '13px' }}>
            Loading...
          </div>
        ) : recent.length === 0 ? (
          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '40px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--text-3)' }}>⊞</div>
            <p style={{ color: 'var(--text-2)', fontSize: '13px', marginBottom: '4px' }}>No properties yet</p>
            <Link href="/properties" style={{ color: 'var(--blue-light)', fontSize: '13px' }}>
              Add your first property →
            </Link>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: '12px', overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-3)', borderBottom: '1px solid var(--border)' }}>
                  {['Title', 'Type', 'Category', 'Location', 'Price', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((p, i) => (
                  <tr key={p._id}
                    style={{ borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background .1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-3)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                    <td style={{ padding: '11px 16px' }}><Badge v={p.type} /></td>
                    <td style={{ padding: '11px 16px' }}><Badge v={p.category} /></td>
                    <td style={{ padding: '11px 16px', fontSize: '13px', color: 'var(--text-2)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.location}</td>
                    <td style={{ padding: '11px 16px', fontSize: '13px', fontFamily: 'var(--font-head)', fontWeight: 600, color: 'var(--blue-light)' }}>
                      {p.price ? `$${p.price.toLocaleString()}` : '—'}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        background: p.available ? 'rgba(16,185,129,.12)' : 'rgba(239,68,68,.12)',
                        color: p.available ? '#34d399' : '#fca5a5',
                        padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 500,
                      }}>
                        {p.available ? '● Available' : '● Taken'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
