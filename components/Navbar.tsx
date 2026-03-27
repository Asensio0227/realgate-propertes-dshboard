'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { usePathname } from 'next/navigation';

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/properties': 'Properties',
  '/leads': 'Leads',
  // '/sessions': 'Chatbot Sessions',
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
        background: '#0b0f1a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
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
        <span style={{ color: '#3d4f73', fontSize: '13px' }}>Realgate</span>
        <span style={{ color: '#3d4f73' }}>/</span>
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px', color: '#7b8db8' }}>
          {user?.email}
        </span>
        <span
          style={{
            background:
              user?.role === 'admin'
                ? 'rgba(124,58,237,.15)'
                : 'rgba(37,99,235,.15)',
            color: user?.role === 'admin' ? '#a78bfa' : '#60a5fa',
            padding: '2px 10px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: 500,
            textTransform: 'capitalize',
          }}
        >
          {user?.role}
        </span>
      </div>
    </header>
  );
}
