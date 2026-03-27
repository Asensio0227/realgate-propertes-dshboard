'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function SignInPage() {
  const router  = useRouter();
  const setUser = useAuthStore(s => s.setUser);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/auth/signin', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Sign in failed');
      setUser(data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const iStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: 'var(--bg-3)', border: '1px solid var(--border-2)',
    borderRadius: '8px', color: 'var(--text)',
    fontSize: '14px', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>

      {/* ── Left brand panel ────────────────────────────────────────────── */}
      <div style={{
        width: '400px', flexShrink: 0,
        background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '48px 40px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* grid texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* glow */}
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 42, height: 42, borderRadius: '10px', background: 'var(--blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '15px',
            marginBottom: '32px',
          }}>RG</div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '26px', fontWeight: 800, lineHeight: 1.2, marginBottom: '10px' }}>
            Realgate<br />Properties
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '13px', lineHeight: 1.8 }}>
            Internal management portal.<br />Agents &amp; admins only.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {[
            { icon: '⊞', label: 'Property listings' },
            { icon: '◎', label: 'Lead management' },
            { icon: '⬡', label: 'Agency oversight' },
            { icon: '◈', label: 'Live analytics' },
          ].map(f => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 0', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ color: 'var(--text-3)', fontSize: '15px' }}>{f.icon}</span>
              <span style={{ color: 'var(--text-2)', fontSize: '13px' }}>{f.label}</span>
            </div>
          ))}
        </div>

        <p style={{ position: 'relative', zIndex: 1, color: 'var(--text-3)', fontSize: '12px' }}>
          © 2025 Realgate Properties, Bulawayo
        </p>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '2rem',
      }}>
        <div className="fu" style={{ width: '100%', maxWidth: '380px' }}>

          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
            Sign in
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '13px', marginBottom: '32px' }}>
            Enter your credentials to continue
          </p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '10px 14px',
              color: '#fca5a5', fontSize: '13px', marginBottom: '20px',
            }}>⚠ {error}</div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>
                Email
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@realgateproperties.co.zw"
                style={iStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--blue)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...iStyle, paddingRight: '40px' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--blue)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-3)',
                }}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                background: 'var(--blue)', color: '#fff', border: 'none',
                padding: '12px', borderRadius: '8px',
                fontWeight: 600, fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1, marginTop: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading && (
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin .7s linear infinite' }} />
              )}
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-3)', fontSize: '13px' }}>
            No account?{' '}
            <Link href="/signup" style={{ color: 'var(--blue-light)', fontWeight: 500 }}>
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
