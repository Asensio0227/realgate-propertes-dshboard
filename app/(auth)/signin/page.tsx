'use client';

import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Sign in failed');
      setUser(data.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const iStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'var(--bg-2)',
    border: '1px solid var(--border-2)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color .2s',
  };

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}
    >
      {/* ── Left brand panel ─────────────────────────────────────────── */}
      <div
        style={{
          width: '400px',
          flexShrink: 0,
          background: 'var(--green-dark)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle diagonal texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)',
          }}
        />
        {/* Green glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(93,184,126,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '36px' }}>
            <img
              src='/assets/logo-transparent.png'
              alt='Realgate Properties'
              style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '28px',
              fontWeight: 700,
              lineHeight: 1.25,
              marginBottom: '12px',
              color: '#ffffff',
            }}
          >
            Realgate
            <br />
            Properties
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '13px',
              lineHeight: 1.8,
            }}
          >
            Internal management portal.
            <br />
            Agents &amp; admins only.
          </p>

          {/* Green divider */}
          <div
            style={{
              width: '40px',
              height: '2px',
              background: 'var(--green-light)',
              borderRadius: '2px',
              marginTop: '28px',
            }}
          />
        </div>

        {/* Feature list */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {[
            { icon: '⊞', label: 'Property listings' },
            { icon: '◎', label: 'Lead management' },
            { icon: '⬡', label: 'Agency oversight' },
            { icon: '◈', label: 'Live analytics' },
          ].map((f) => (
            <div
              key={f.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 0',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span style={{ color: 'var(--green-light)', fontSize: '14px' }}>
                {f.icon}
              </span>
              <span
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>

        <p
          style={{
            position: 'relative',
            zIndex: 1,
            color: 'rgba(255,255,255,0.25)',
            fontSize: '12px',
          }}
        >
          © 2025 Realgate Properties, Bulawayo
        </p>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'var(--bg)',
        }}
      >
        <div className='fu' style={{ width: '100%', maxWidth: '380px' }}>
          {/* Top accent line */}
          <div
            style={{
              width: '40px',
              height: '3px',
              background: 'var(--green)',
              borderRadius: '2px',
              marginBottom: '24px',
            }}
          />

          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '26px',
              fontWeight: 700,
              marginBottom: '6px',
              color: 'var(--green-dark)',
            }}
          >
            Sign in
          </h2>
          <p
            style={{
              color: 'var(--text-2)',
              fontSize: '13px',
              marginBottom: '32px',
            }}
          >
            Enter your credentials to continue
          </p>

          {error && (
            <div
              style={{
                background: 'rgba(192,57,43,0.08)',
                border: '1px solid rgba(192,57,43,0.25)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'var(--red)',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              ⚠ {error}
            </div>
          )}

          <form
            onSubmit={submit}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-2)',
                  textTransform: 'uppercase',
                  letterSpacing: '.07em',
                  marginBottom: '5px',
                }}
              >
                Email
              </label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@realgateproperties.co.zw'
                style={iStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--green)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-2)')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-2)',
                  textTransform: 'uppercase',
                  letterSpacing: '.07em',
                  marginBottom: '5px',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  style={{ ...iStyle, paddingRight: '40px' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--green)')}
                  onBlur={(e) =>
                    (e.target.style.borderColor = 'var(--border-2)')
                  }
                />
                <button
                  type='button'
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-3)',
                  }}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              style={{
                background: 'var(--green-dark)',
                color: '#fff',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background .2s',
                letterSpacing: '0.03em',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = 'var(--green)';
              }}
              onMouseLeave={(e) => {
                if (!loading)
                  e.currentTarget.style.background = 'var(--green-dark)';
              }}
            >
              {loading && (
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,.3)',
                    borderTopColor: '#fff',
                    animation: 'spin .7s linear infinite',
                  }}
                />
              )}
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p
            style={{
              textAlign: 'center',
              marginTop: '24px',
              color: 'var(--text-3)',
              fontSize: '13px',
            }}
          >
            No account?{' '}
            <Link
              href='/signup'
              style={{ color: 'var(--green)', fontWeight: 600 }}
            >
              Request access
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
