'use client';

import ImageUploader from '@/components/ImageUploader';
import { type PropertyData, type PropertyForm } from '@/types/property';
import { useState } from 'react';

// Re-export so any file that used to import from here still works
export type { PropertyData, PropertyForm };

interface Props {
  onClose: () => void;
  onSave: (data: PropertyForm) => Promise<void>;
  initial?: PropertyData | null;
  saving: boolean;
  error: string;
}

interface WrapperProps extends Props {
  open: boolean;
  instanceKey: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BLANK: PropertyForm = {
  title: '',
  type: 'sale',
  category: 'house',
  location: '',
  price: '',
  bedrooms: '',
  bathrooms: '',
  description: '',
  available: 'true',
  images: [],
};

function toForm(src: PropertyData): PropertyForm {
  return {
    title: src.title ?? '',
    type: src.type ?? 'sale',
    category: src.category ?? 'house',
    location: src.location ?? '',
    price: src.price != null ? String(src.price) : '',
    bedrooms: src.bedrooms != null ? String(src.bedrooms) : '',
    bathrooms: src.bathrooms != null ? String(src.bathrooms) : '',
    description: src.description ?? '',
    available: String(src.available ?? true),
    images: Array.isArray(src.images) ? src.images : [],
  };
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const iStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#e8edf8',
  fontSize: '13px',
  outline: 'none',
  fontFamily: 'inherit',
};

const lStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#7b8db8',
  textTransform: 'uppercase',
  letterSpacing: '.06em',
  display: 'block',
  marginBottom: '5px',
};

// ─── Inner form ───────────────────────────────────────────────────────────────

function PropertyFormInner({ onClose, onSave, initial, saving, error }: Props) {
  const [form, setForm] = useState<PropertyForm>(() =>
    initial ? toForm(initial) : BLANK,
  );

  const set = (k: keyof PropertyForm, v: string | string[]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = '#2563eb');
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'rgba(255,255,255,0.1)');

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#0b0f1a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '580px',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            background: '#0b0f1a',
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
            }}
          >
            {initial ? 'Edit Property' : 'Add Property'}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#7b8db8',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {error && (
            <div
              style={{
                background: 'rgba(239,68,68,.1)',
                border: '1px solid rgba(239,68,68,.25)',
                borderRadius: '8px',
                padding: '9px 13px',
                color: '#fca5a5',
                fontSize: '13px',
              }}
            >
              ⚠ {error}
            </div>
          )}

          <div>
            <label style={lStyle}>Title *</label>
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder='e.g. 3-Bed House in Suburbs'
              style={iStyle}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <div>
              <label style={lStyle}>Type *</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
                style={{ ...iStyle, cursor: 'pointer' }}
              >
                <option value='sale'>Sale</option>
                <option value='rent'>Rent</option>
              </select>
            </div>
            <div>
              <label style={lStyle}>Category *</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                style={{ ...iStyle, cursor: 'pointer' }}
              >
                <option value='house'>House</option>
                <option value='apartment'>Apartment</option>
                <option value='commercial'>Commercial</option>
                <option value='stands'>Stands</option>
              </select>
            </div>
          </div>

          <div>
            <label style={lStyle}>Location *</label>
            <input
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder='e.g. Suburbs, Bulawayo'
              style={iStyle}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
            }}
          >
            <div>
              <label style={lStyle}>Price (USD)</label>
              <input
                type='number'
                min='0'
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder='0'
                style={iStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
            <div>
              <label style={lStyle}>Bedrooms</label>
              <input
                type='number'
                min='0'
                value={form.bedrooms}
                onChange={(e) => set('bedrooms', e.target.value)}
                placeholder='—'
                style={iStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
            <div>
              <label style={lStyle}>Bathrooms</label>
              <input
                type='number'
                min='0'
                value={form.bathrooms}
                onChange={(e) => set('bathrooms', e.target.value)}
                placeholder='—'
                style={iStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
          </div>

          <div>
            <label style={lStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder='Property details...'
              style={{ ...iStyle, resize: 'vertical' }}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          <div>
            <label style={lStyle}>Availability</label>
            <select
              value={form.available}
              onChange={(e) => set('available', e.target.value)}
              style={{ ...iStyle, cursor: 'pointer' }}
            >
              <option value='true'>Available</option>
              <option value='false'>Not Available</option>
            </select>
          </div>

          <div>
            <label style={lStyle}>Images</label>
            <ImageUploader
              value={form.images}
              onChange={(urls) => set('images', urls)}
              max={10}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end',
              paddingTop: '4px',
            }}
          >
            <button
              onClick={onClose}
              style={{
                background: '#1a2235',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#7b8db8',
                padding: '9px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              disabled={saving}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                padding: '9px 20px',
                borderRadius: '8px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                fontFamily: 'inherit',
                opacity: saving ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {saving && (
                <div
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,.3)',
                    borderTopColor: '#fff',
                    animation: 'spin .7s linear infinite',
                  }}
                />
              )}
              {initial ? 'Save Changes' : 'Create Property'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Public wrapper ───────────────────────────────────────────────────────────

export default function PropertyFormModal({
  open,
  instanceKey,
  ...rest
}: WrapperProps) {
  if (!open) return null;
  return <PropertyFormInner key={instanceKey} {...rest} />;
}
