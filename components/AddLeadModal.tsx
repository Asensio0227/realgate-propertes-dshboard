import { AddLeadModalProps } from '@/app/(dashboard)/leads/page';
import { useState } from 'react';

export function AddLeadModal({ onClose, onSaved }: AddLeadModalProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    budget: '',
    location: '',
    type: '',
    propertyType: '',
    source: 'website',
    status: 'new',
    priority: 'medium',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit() {
    setSaving(true);
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        budget: form.budget ? Number(form.budget) : undefined,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setErrors(data.errors ?? { _: data.message });
      return;
    }
    onSaved();
  }

  const labelStyle = {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 600 as const,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: '6px',
  };

  const inputBase = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    boxSizing: 'border-box' as const,
    outline: 'none',
  };

  const field = (
    label: string,
    key: string,
    type = 'text',
    placeholder = '',
  ) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={(form as Record<string, string>)[key]}
        placeholder={placeholder}
        onChange={(e) => set(key, e.target.value)}
        style={{
          ...inputBase,
          border: `1px solid ${errors[key] ? 'var(--red)' : 'var(--border)'}`,
        }}
      />
      {errors[key] && (
        <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>
          {errors[key]}
        </p>
      )}
    </div>
  );

  const select = (label: string, key: string, options: string[]) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        value={(form as Record<string, string>)[key]}
        onChange={(e) => set(key, e.target.value)}
        style={{
          ...inputBase,
          border: '1px solid var(--border)',
          cursor: 'pointer',
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(26,74,46,0.35)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '2rem',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(26,74,46,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            Add New Lead
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            {field('Full Name *', 'name', 'text', 'John Doe')}
            {field('Phone *', 'phone', 'text', '+263 77 123 4567')}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            {field('Budget ($)', 'budget', 'number', '50000')}
            {field('Location', 'location', 'text', 'Bulawayo')}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            {select('Interest Type', 'type', ['', 'rent', 'buy'])}
            {field(
              'Property Type',
              'propertyType',
              'text',
              'house, apartment…',
            )}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem',
            }}
          >
            {select('Source', 'source', ['chatbot', 'website', 'ads'])}
            {select('Status', 'status', ['new', 'contacted', 'closed'])}
            {select('Priority', 'priority', ['low', 'medium', 'high'])}
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
              placeholder='Any additional notes…'
              style={{
                ...inputBase,
                border: '1px solid var(--border)',
                resize: 'vertical',
              }}
            />
          </div>
          {errors._ && (
            <p style={{ color: 'var(--red)', fontSize: '13px' }}>{errors._}</p>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '1.5rem',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '9px 20px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg-3)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              padding: '9px 24px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--accent-blue)',
              color: 'white',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Save Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}
