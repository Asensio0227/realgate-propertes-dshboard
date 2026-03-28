'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { usePathname } from 'next/navigation';

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/properties': 'Properties',
  '/leads': 'Leads',
  '/sessions': 'Chatbot Sessions',
};

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const title =
    Object.entries(TITLES).find(([k]) => pathname.startsWith(k))?.[1] ??
    'Dashboard';

  return (
    <header
      style={{
        height: '56px',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Realgate
        </span>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {user?.email}
        </span>
        <span
          style={{
            background:
              user?.role === 'admin'
                ? 'rgba(26,74,46,0.12)'
                : 'var(--green-dim)',
            color:
              user?.role === 'admin' ? 'var(--green-dark)' : 'var(--green)',
            border: '1px solid var(--green-border)',
            padding: '2px 10px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        >
          {user?.role}
        </span>
      </div>
    </header>
  );
}
