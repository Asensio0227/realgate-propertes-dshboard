'use client';

import { AddLeadModal } from '@/components/AddLeadModal';
import { LeadRow } from '@/components/LeadRow';
import { useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'new' | 'contacted' | 'closed';
export type LeadPriority = 'low' | 'medium' | 'high';
export type LeadSource = 'chatbot' | 'website' | 'ads';

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  budget?: number;
  location?: string;
  type?: 'rent' | 'buy';
  propertyType?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  notes?: string;
  createdAt: string;
}

export const STATUS_COLORS: Record<LeadStatus, { bg: string; color: string }> =
  {
    new: { bg: 'rgba(37,99,235,0.15)', color: '#60a5fa' },
    contacted: { bg: 'rgba(234,179,8,0.15)', color: '#facc15' },
    closed: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  };

export const PRIORITY_COLORS: Record<
  LeadPriority,
  { bg: string; color: string }
> = {
  low: { bg: 'rgba(100,116,139,0.2)', color: '#94a3b8' },
  medium: { bg: 'rgba(234,179,8,0.15)', color: '#facc15' },
  high: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
};

export const SOURCE_ICONS: Record<LeadSource, string> = {
  chatbot: '🤖',
  website: '🌐',
  ads: '📣',
};

export interface AddLeadModalProps {
  onClose: () => void;
  onSaved: () => void;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  // Filters
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');

  // Bump this to force a re-fetch without changing any filter value
  const [tick, setTick] = useState(0);

  // Track the active AbortController so each new effect run cancels the previous fetch
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function load() {
      setLoading(true);

      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (source) params.set('source', source);
      if (priority) params.set('priority', priority);
      if (search) params.set('search', search);

      try {
        const res = await fetch(`/api/leads?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (data.success) {
          setLeads(data.leads);
          setTotal(data.total);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('[LeadsPage] fetch error', err);
        }
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [status, source, priority, search, tick]);

  function refreshLeads() {
    setTick((t) => t + 1);
  }

  async function handleStatusChange(id: string, newStatus: LeadStatus) {
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setLeads((prev) =>
      prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l)),
    );
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    setLeads((prev) => prev.filter((l) => l._id !== id));
    setTotal((t) => t - 1);
  }

  const counts = {
    total,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    closed: leads.filter((l) => l.status === 'closed').length,
  };

  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    cursor: 'pointer',
  };

  return (
    <div
      style={{
        padding: '2rem',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
      }}
    >
      {/* ── Header ── */}
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
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '4px',
            }}
          >
            Leads
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Manage and track your agency's leads
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: 'var(--accent-blue)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          + Add Lead
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {[
          { label: 'Total Leads', value: counts.total, color: '#60a5fa' },
          { label: 'New', value: counts.new, color: '#60a5fa' },
          { label: 'Contacted', value: counts.contacted, color: '#facc15' },
          { label: 'Closed', value: counts.closed, color: '#4ade80' },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1.25rem',
            }}
          >
            <p
              style={{
                color: 'var(--text-muted)',
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
                fontFamily: 'var(--font-display)',
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

      {/* ── Filters ── */}
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
          placeholder='Search by name…'
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
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={selectStyle}
        >
          <option value=''>All Statuses</option>
          <option value='new'>New</option>
          <option value='contacted'>Contacted</option>
          <option value='closed'>Closed</option>
        </select>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={selectStyle}
        >
          <option value=''>All Sources</option>
          <option value='chatbot'>Chatbot</option>
          <option value='website'>Website</option>
          <option value='ads'>Ads</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={selectStyle}
        >
          <option value=''>All Priorities</option>
          <option value='high'>High</option>
          <option value='medium'>Medium</option>
          <option value='low'>Low</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div
            style={{
              padding: '4rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Loading leads…
          </div>
        ) : leads.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              No leads found. Add your first lead to get started.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                  }}
                >
                  {[
                    'Name',
                    'Location',
                    'Budget',
                    'Source',
                    'Status',
                    'Priority',
                    'Date',
                    '',
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        letterSpacing: '0.06em',
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
                {leads.map((lead) => (
                  <LeadRow
                    key={lead._id}
                    lead={lead}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add Modal ── */}
      {showAdd && (
        <AddLeadModal
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            refreshLeads();
          }}
        />
      )}
    </div>
  );
}
