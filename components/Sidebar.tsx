'use client';

import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/properties', label: 'Properties', icon: '⊞' },
  { href: '/leads', label: 'Leads', icon: '◎' },
  // { href: '/sessions', label: 'Sessions', icon: '💬' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    clearUser();
    router.push('/signin');
  }

  return (
    <aside
      style={{
        width: '220px',
        flexShrink: 0,
        height: '100vh',
        background: '#0b0f1a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '13px',
            fontFamily: 'Syne, sans-serif',
          }}
        >
          RG
        </div>
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '15px',
          }}
        >
          Realgate
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV.map((n) => {
          const active =
            pathname === n.href || pathname.startsWith(n.href + '/');
          return (
            <Link
              key={n.href}
              href={n.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                borderLeft: `3px solid ${active ? '#2563eb' : 'transparent'}`,
                background: active ? 'rgba(37,99,235,0.10)' : 'transparent',
                color: active ? '#e8edf8' : '#7b8db8',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                transition: 'all .15s',
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  color: active ? '#60a5fa' : '#3d4f73',
                }}
              >
                {n.icon}
              </span>
              {n.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#3d4f73',
                textTransform: 'capitalize',
              }}
            >
              {user?.role}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            width: '100%',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#fca5a5',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
