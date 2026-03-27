'use client';

import { useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionPlatform = 'whatsapp' | 'messenger';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Session {
  _id: string;
  senderId: string;
  platform: SessionPlatform;
  history: ChatMessage[];
  leadSaved: boolean;
  lastActivity: string;
  createdAt: string;
}

// ─── Badge styles ─────────────────────────────────────────────────────────────

const PLATFORM_STYLE: Record<
  SessionPlatform,
  { bg: string; color: string; icon: string }
> = {
  whatsapp: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', icon: '💬' },
  messenger: { bg: 'rgba(37,99,235,0.12)', color: '#60a5fa', icon: '📘' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

// ─── History drawer ───────────────────────────────────────────────────────────

function HistoryDrawer({
  session,
  onClose,
}: {
  session: Session;
  onClose: () => void;
}) {
  const ps = PLATFORM_STYLE[session.platform];
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          width: '480px',
          height: '100%',
          background: '#0b0f1a',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
              }}
            >
              <span style={{ fontSize: '16px' }}>{ps.icon}</span>
              <span
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                {session.senderId}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span
                style={{
                  background: ps.bg,
                  color: ps.color,
                  padding: '2px 8px',
                  borderRadius: '100px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {session.platform}
              </span>
              <span style={{ color: '#3d4f73', fontSize: '11px' }}>
                {session.history.length} messages
              </span>
              {session.leadSaved && (
                <span
                  style={{
                    background: 'rgba(34,197,94,0.12)',
                    color: '#4ade80',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  ✓ Lead saved
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#7b8db8',
              cursor: 'pointer',
              fontSize: '20px',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {session.history.length === 0 ? (
            <p
              style={{
                color: '#3d4f73',
                fontSize: '13px',
                textAlign: 'center',
                marginTop: '2rem',
              }}
            >
              No messages recorded
            </p>
          ) : (
            session.history
              .filter((m) => m.role !== 'system')
              .map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent:
                      m.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '9px 13px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      background: m.role === 'user' ? '#2563eb' : '#111827',
                      color: m.role === 'user' ? '#fff' : '#c8d4e8',
                      borderBottomRightRadius:
                        m.role === 'user' ? '4px' : '12px',
                      borderBottomLeftRadius:
                        m.role === 'user' ? '12px' : '4px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            color: '#3d4f73',
            fontSize: '11px',
          }}
        >
          Last active: {new Date(session.lastActivity).toLocaleString()} ·
          Created: {new Date(session.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState('');
  const [leadSaved, setLeadSaved] = useState('');
  const [search, setSearch] = useState('');
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<Session | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (platform) params.set('platform', platform);
      if (leadSaved) params.set('leadSaved', leadSaved);
      if (search) params.set('search', search);

      try {
        const res = await fetch(`/api/sessions?${params}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as {
          sessions?: Session[];
          total?: number;
        };
        if (data.sessions) {
          setSessions(data.sessions);
          setTotal(data.total ?? 0);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError')
          console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [platform, leadSaved, search, tick]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this session?')) return;
    await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
    setSessions((prev) => prev.filter((s) => s._id !== id));
    setTotal((t) => t - 1);
  }

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: '#111827',
    color: '#7b8db8',
    fontSize: '13px',
    cursor: 'pointer',
  };

  const counts = {
    total: total,
    whatsapp: sessions.filter((s) => s.platform === 'whatsapp').length,
    messenger: sessions.filter((s) => s.platform === 'messenger').length,
    withLeads: sessions.filter((s) => s.leadSaved).length,
  };

  return (
    <div
      style={{
        padding: '2rem',
        minHeight: '100vh',
        background: 'var(--bg-primary, #070b14)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '4px',
            }}
          >
            Chatbot Sessions
          </h1>
          <p style={{ color: '#7b8db8', fontSize: '14px' }}>
            WhatsApp &amp; Messenger conversations via Riya
          </p>
        </div>
        <button
          onClick={() => setTick((t) => t + 1)}
          style={{
            background: 'rgba(37,99,235,0.1)',
            border: '1px solid rgba(37,99,235,0.3)',
            color: '#60a5fa',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {[
          { label: 'Total Sessions', value: counts.total, color: '#60a5fa' },
          { label: 'WhatsApp', value: counts.whatsapp, color: '#4ade80' },
          { label: 'Messenger', value: counts.messenger, color: '#60a5fa' },
          {
            label: 'Leads Captured',
            value: counts.withLeads,
            color: '#facc15',
          },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '1.25rem',
            }}
          >
            <p
              style={{
                color: '#7b8db8',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              {c.label}
            </p>
            <p
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '2rem',
                fontWeight: 700,
                color: c.color,
              }}
            >
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <input
          type='text'
          placeholder='Search by sender ID…'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...selectStyle,
            flex: 1,
            minWidth: '200px',
            padding: '8px 14px',
          }}
        />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={selectStyle}
        >
          <option value=''>All Platforms</option>
          <option value='whatsapp'>WhatsApp</option>
          <option value='messenger'>Messenger</option>
        </select>
        <select
          value={leadSaved}
          onChange={(e) => setLeadSaved(e.target.value)}
          style={selectStyle}
        >
          <option value=''>All Sessions</option>
          <option value='true'>Lead Saved</option>
          <option value='false'>No Lead</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div
            style={{ padding: '4rem', textAlign: 'center', color: '#7b8db8' }}
          >
            Loading sessions…
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</p>
            <p style={{ color: '#7b8db8', fontSize: '14px' }}>
              No sessions found. Chatbot conversations will appear here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: '#0b0f1a',
                  }}
                >
                  {[
                    'Sender',
                    'Platform',
                    'Messages',
                    'Lead',
                    'Last Active',
                    '',
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#7b8db8',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => {
                  const ps = PLATFORM_STYLE[s.platform];
                  return (
                    <tr
                      key={s._id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '13px',
                            fontFamily: 'Syne, sans-serif',
                          }}
                        >
                          {s.senderId}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: ps.bg,
                            color: ps.color,
                            padding: '3px 10px',
                            borderRadius: '100px',
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}
                        >
                          {ps.icon} {s.platform}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          color: '#7b8db8',
                          fontSize: '13px',
                        }}
                      >
                        {s.history.filter((m) => m.role !== 'system').length}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: s.leadSaved
                              ? 'rgba(34,197,94,0.12)'
                              : 'rgba(255,255,255,0.04)',
                            color: s.leadSaved ? '#4ade80' : '#3d4f73',
                            padding: '3px 10px',
                            borderRadius: '100px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {s.leadSaved ? '✓ Saved' : '—'}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          color: '#7b8db8',
                          fontSize: '12px',
                        }}
                      >
                        {timeAgo(s.lastActivity)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => setSelected(s)}
                            style={{
                              background: 'rgba(37,99,235,0.1)',
                              border: 'none',
                              color: '#60a5fa',
                              padding: '5px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            style={{
                              background: 'rgba(239,68,68,0.1)',
                              border: 'none',
                              color: '#fca5a5',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* History drawer */}
      {selected && (
        <HistoryDrawer session={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
