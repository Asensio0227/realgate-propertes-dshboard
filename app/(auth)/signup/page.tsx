'use client';

import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    agency: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const pwStrength =
    form.password.length === 0
      ? 0
      : form.password.length < 6
        ? 1
        : form.password.length < 10
          ? 2
          : 3;

  const strengthMeta = [
    { label: '', color: 'var(--border-2)' },
    { label: 'Weak', color: 'var(--red)' },
    { label: 'Fair', color: 'var(--amber)' },
    { label: 'Strong', color: 'var(--green)' },
  ][pwStrength];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.agency.trim()) {
      setError('Please enter your agency name to continue.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'agent' }),
      });
      const data = (await res.json()) as {
        user?: object;
        errors?: Record<string, string>;
        message?: string;
      };
      if (!res.ok) {
        const msg = data.errors
          ? Object.values(data.errors).join(', ')
          : (data.message ?? 'Sign up failed');
        throw new Error(msg);
      }
      setUser(data.user as Parameters<typeof setUser>[0]);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  // ── Styles ─────────────────────────────────────────────────────────────────

  const iStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'var(--bg-3)',
    border: '1px solid var(--border-2)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
  };
  const lStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-2)',
    textTransform: 'uppercase',
    letterSpacing: '.06em',
    marginBottom: '5px',
  };
  const focus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = 'var(--blue)');
  const blur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = 'var(--border-2)');

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}
    >
      {/* ── Left panel ── */}
      <div
        style={{
          width: '400px',
          flexShrink: 0,
          background: 'var(--bg-2)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link
            href='/signin'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-3)',
              fontSize: '12px',
              marginBottom: '40px',
              textDecoration: 'none',
            }}
          >
            ← Back to sign in
          </Link>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '10px',
              background: 'var(--blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-head)',
              fontWeight: 800,
              fontSize: '15px',
              marginBottom: '24px',
            }}
          >
            RG
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '24px',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '10px',
            }}
          >
            Create your
            <br />
            account
          </h1>
          <p
            style={{
              color: 'var(--text-2)',
              fontSize: '13px',
              lineHeight: 1.8,
            }}
          >
            Manage properties, leads &amp; agencies from one place.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {[
            { icon: '⊞', label: 'Browse property listings' },
            { icon: '◎', label: 'Submit enquiries & leads' },
            { icon: '⬡', label: 'Connect with agencies' },
            { icon: '◈', label: 'Track your requests' },
          ].map((f) => (
            <div
              key={f.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ color: 'var(--text-3)', fontSize: '15px' }}>
                {f.icon}
              </span>
              <span style={{ color: 'var(--text-2)', fontSize: '13px' }}>
                {f.label}
              </span>
            </div>
          ))}
        </div>

        <p
          style={{
            position: 'relative',
            zIndex: 1,
            color: 'var(--text-3)',
            fontSize: '12px',
          }}
        >
          © 2025 Realgate Properties, Bulawayo
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div className='fu' style={{ width: '100%', maxWidth: '420px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '6px',
            }}
          >
            Create account
          </h2>
          <p
            style={{
              color: 'var(--text-2)',
              fontSize: '13px',
              marginBottom: '32px',
            }}
          >
            Fill in your details to get started
          </p>

          {error && (
            <div
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fca5a5',
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
            {/* Name */}
            <div>
              <label style={lStyle}>Full Name</label>
              <input
                type='text'
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder='John Moyo'
                style={iStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>

            {/* Email */}
            <div>
              <label style={lStyle}>Email Address</label>
              <input
                type='email'
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder='you@example.com'
                style={iStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>

            {/* Agency — plain text input */}
            <div>
              <label style={lStyle}>Agency *</label>
              <input
                type='text'
                required
                value={form.agency}
                onChange={(e) => set('agency', e.target.value)}
                placeholder='e.g. Realgate Properties'
                style={iStyle}
                onFocus={focus}
                onBlur={blur}
              />
              <p
                style={{
                  fontSize: '11px',
                  color: 'var(--text-3)',
                  marginTop: '5px',
                }}
              >
                Enter the name of the agency you work for.
              </p>
            </div>

            {/* Password */}
            <div>
              <label style={lStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder='Min. 6 characters'
                  style={{ ...iStyle, paddingRight: '40px' }}
                  onFocus={focus}
                  onBlur={blur}
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
              {form.password.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <div
                    style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}
                  >
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: '3px',
                          borderRadius: '2px',
                          background:
                            i <= pwStrength
                              ? strengthMeta.color
                              : 'var(--border-2)',
                          transition: 'background .3s',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: strengthMeta.color }}>
                    {strengthMeta.label}
                  </span>
                </div>
              )}
            </div>

            <button
              type='submit'
              disabled={loading}
              style={{
                background: 'var(--blue)',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
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
              {loading ? 'Creating…' : 'Create Account →'}
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
            Already have an account?{' '}
            <Link
              href='/signin'
              style={{ color: 'var(--blue-light)', fontWeight: 500 }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
