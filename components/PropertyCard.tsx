'use client';

import { type PropertyData, type SavedProperty } from '@/types/property';

interface Props {
  property: SavedProperty;
  onEdit: (p: PropertyData) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, available: boolean) => void;
  isAdmin: boolean;
}

const TYPE_COLOR: Record<string, [string, string]> = {
  sale: ['rgba(16,185,129,.15)', '#34d399'],
  rent: ['rgba(245,158,11,.15)', '#fbbf24'],
};

export default function PropertyCard({
  property: p,
  onEdit,
  onDelete,
  onToggle,
  isAdmin,
}: Props) {
  const [tbg, tc] = TYPE_COLOR[p.type] ?? ['rgba(255,255,255,.06)', '#7b8db8'];
  const cover = p.images?.[0];

  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'border-color .15s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')
      }
    >
      {/* ── Cover image ── */}
      <div
        style={{
          height: '160px',
          background: '#0b0f1a',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {cover ? (
          <img
            src={cover}
            alt={p.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1e2d45',
              fontSize: '3rem',
            }}
          >
            ⊞
          </div>
        )}

        <span
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: tbg,
            color: tc,
            padding: '2px 9px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: 500,
            textTransform: 'capitalize',
            backdropFilter: 'blur(8px)',
          }}
        >
          {p.type}
        </span>

        <span
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: p.available
              ? 'rgba(16,185,129,.75)'
              : 'rgba(239,68,68,.75)',
            color: '#fff',
            padding: '2px 9px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: 500,
            backdropFilter: 'blur(8px)',
          }}
        >
          {p.available ? '● Available' : '● Taken'}
        </span>

        {p.images && p.images.length > 1 && (
          <span
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.65)',
              color: '#e8edf8',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              backdropFilter: 'blur(4px)',
            }}
          >
            🖼 {p.images.length}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '14px 16px' }}>
        <h3
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {p.title}
        </h3>
        <p style={{ fontSize: '12px', color: '#7b8db8', marginBottom: '10px' }}>
          📍 {p.location}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            fontSize: '12px',
            color: '#3d4f73',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              textTransform: 'capitalize',
              background: 'rgba(255,255,255,.04)',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            {p.category}
          </span>
          {p.bedrooms != null && <span>🛏 {p.bedrooms}</span>}
          {p.bathrooms != null && <span>🚿 {p.bathrooms}</span>}
        </div>

        {p.price != null && (
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              color: '#60a5fa',
              marginBottom: '12px',
            }}
          >
            ${p.price.toLocaleString()}
          </div>
        )}

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => onToggle(p._id, !p.available)}
            style={{
              flex: 1,
              background: 'rgba(245,158,11,.08)',
              border: '1px solid rgba(245,158,11,.2)',
              color: '#fbbf24',
              padding: '7px 0',
              borderRadius: '7px',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: 'inherit',
              fontWeight: 500,
            }}
          >
            {p.available ? 'Mark Taken' : 'Mark Available'}
          </button>
          <button
            onClick={() => onEdit(p)}
            style={{
              background: 'rgba(37,99,235,.1)',
              border: 'none',
              color: '#60a5fa',
              padding: '7px 12px',
              borderRadius: '7px',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: 'inherit',
            }}
          >
            Edit
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(p._id)}
              style={{
                background: 'rgba(239,68,68,.1)',
                border: 'none',
                color: '#fca5a5',
                padding: '7px 12px',
                borderRadius: '7px',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: 'inherit',
              }}
            >
              Del
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
