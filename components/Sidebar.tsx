'use client';

import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/properties', label: 'Properties', icon: '⊞' },
  { href: '/leads', label: 'Leads', icon: '◎' },
  { href: '/sessions', label: 'Sessions', icon: '💬' },
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
        background: 'var(--bg-2)',
        borderRight: '1px solid var(--border)',
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
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <img
          src='/assets/logo-transparent.png'
          alt='Realgate Properties'
          style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
        />
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
                borderLeft: `3px solid ${active ? 'var(--green)' : 'transparent'}`,
                background: active ? 'var(--green-dim)' : 'transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                transition: 'all .15s',
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  color: active ? 'var(--green)' : 'var(--text-muted)',
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
        style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}
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
              background:
                'linear-gradient(135deg, var(--green), var(--green-mid))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              flexShrink: 0,
              color: '#fff',
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
                color: 'var(--text-primary)',
              }}
            >
              {user?.name}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
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
            background: 'rgba(192,57,43,0.07)',
            border: '1px solid rgba(192,57,43,0.2)',
            color: 'var(--red)',
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
