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
  sale: ['rgba(45,122,79,0.12)', 'var(--green)'],
  rent: ['rgba(196,124,26,0.12)', 'var(--amber)'],
};

export default function PropertyCard({
  property: p,
  onEdit,
  onDelete,
  onToggle,
  isAdmin,
}: Props) {
  const [tbg, tc] = TYPE_COLOR[p.type] ?? ['var(--bg-3)', 'var(--text-muted)'];
  const cover = p.images?.[0];

  return (
    <div
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'border-color .15s, box-shadow .15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--green-border)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,122,79,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Cover image */}
      <div
        style={{
          height: '160px',
          background: 'var(--bg-3)',
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
              color: 'var(--border-2)',
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
            fontWeight: 600,
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
              ? 'rgba(45,122,79,0.8)'
              : 'rgba(192,57,43,0.8)',
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
              background: 'rgba(26,74,46,0.65)',
              color: '#fff',
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

      {/* Body */}
      <div style={{ padding: '14px 16px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'var(--text-primary)',
          }}
        >
          {p.title}
        </h3>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '10px',
          }}
        >
          📍 {p.location}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              textTransform: 'capitalize',
              background: 'var(--bg-3)',
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
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--green)',
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
              background: 'rgba(196,124,26,0.08)',
              border: '1px solid rgba(196,124,26,0.2)',
              color: 'var(--amber)',
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
              background: 'var(--green-dim)',
              border: '1px solid var(--green-border)',
              color: 'var(--green)',
              padding: '7px 12px',
              borderRadius: '7px',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: 'inherit',
              fontWeight: 500,
            }}
          >
            Edit
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(p._id)}
              style={{
                background: 'rgba(192,57,43,0.08)',
                border: 'none',
                color: 'var(--red)',
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
