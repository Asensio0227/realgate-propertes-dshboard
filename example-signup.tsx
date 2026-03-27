'use client';

import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
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
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.errors
          ? Object.values(data.errors).join(', ')
          : data.message || 'Sign up failed';
        throw new Error(msg);
      }
      setUser(data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}
    >
      {/* ── Left panel ───────────────────────────────────────────────────── */}
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

        {/* Role picker */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              letterSpacing: '.08em',
              marginBottom: '12px',
            }}
          >
            Select Role
          </p>
          {[
            { role: 'agent', icon: '👤', desc: 'Manage listings & leads' },
            { role: 'admin', icon: '⚡', desc: 'Full system access' },
          ].map((r) => (
            <div
              key={r.role}
              onClick={() => set('role', r.role)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginBottom: '8px',
                background:
                  form.role === r.role ? 'var(--blue-dim)' : 'transparent',
                border: `1px solid ${form.role === r.role ? 'var(--blue-border)' : 'var(--border)'}`,
                transition: 'all .15s',
              }}
            >
              <span style={{ fontSize: '18px' }}>{r.icon}</span>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '13px',
                    textTransform: 'capitalize',
                    color:
                      form.role === r.role
                        ? 'var(--blue-light)'
                        : 'var(--text)',
                  }}
                >
                  {r.role}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                  {r.desc}
                </div>
              </div>
              {form.role === r.role && (
                <span
                  style={{
                    marginLeft: 'auto',
                    color: 'var(--blue-light)',
                    fontSize: '12px',
                  }}
                >
                  ✓
                </span>
              )}
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

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div className='fu' style={{ width: '100%', maxWidth: '400px' }}>
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
            <div>
              <label style={lStyle}>Full Name</label>
              <input
                type='text'
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder='John Moyo'
                style={iStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--blue)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-2)')}
              />
            </div>

            <div>
              <label style={lStyle}>Email Address</label>
              <input
                type='email'
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder='you@example.com'
                style={iStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--blue)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-2)')}
              />
            </div>

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
                  onFocus={(e) => (e.target.style.borderColor = 'var(--blue)')}
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

            {/* Role display (synced with left panel) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-3)',
                border: '1px solid var(--border-2)',
                borderRadius: '8px',
                padding: '10px 14px',
              }}
            >
              <span style={{ color: 'var(--text-2)', fontSize: '13px' }}>
                Selected role:
              </span>
              <span
                style={{
                  background: 'var(--blue-dim)',
                  color: 'var(--blue-light)',
                  padding: '2px 10px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {form.role}
              </span>
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
              {loading ? 'Creating...' : 'Create Account →'}
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
    </div>
  );
}
