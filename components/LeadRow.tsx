import {
  Lead,
  PRIORITY_COLORS,
  SOURCE_ICONS,
  STATUS_COLORS,
} from '@/app/(dashboard)/leads/page';
import { LeadStatus } from '@/models/Leads';
import { Badge } from './Badge';

export function LeadRow({
  lead,
  onStatusChange,
  onDelete,
}: {
  lead: Lead;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
}) {
  const sc = STATUS_COLORS[lead.status];
  const pc = PRIORITY_COLORS[lead.priority];

  return (
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>{lead.name}</div>
        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: '12px',
            marginTop: '2px',
          }}
        >
          {lead.phone}
        </div>
      </td>
      <td
        style={{
          padding: '14px 16px',
          color: 'var(--text-secondary)',
          fontSize: '13px',
        }}
      >
        {lead.location || '—'}
        {lead.type && (
          <span
            style={{
              marginLeft: '6px',
              color: 'var(--text-muted)',
              fontSize: '11px',
              textTransform: 'capitalize',
            }}
          >
            ({lead.type})
          </span>
        )}
      </td>
      <td
        style={{
          padding: '14px 16px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}
      >
        {lead.budget ? `$${lead.budget.toLocaleString()}` : '—'}
      </td>
      <td style={{ padding: '14px 16px' }}>
        <Badge
          label={lead.source}
          bg={
            SOURCE_ICONS[lead.source] ? 'rgba(100,116,139,0.15)' : 'transparent'
          }
          color='var(--text-secondary)'
        />
        <span style={{ marginLeft: '4px', fontSize: '14px' }}>
          {SOURCE_ICONS[lead.source]}
        </span>
      </td>
      <td style={{ padding: '14px 16px' }}>
        <select
          value={lead.status}
          onChange={(e) =>
            onStatusChange(lead._id, e.target.value as LeadStatus)
          }
          style={{
            background: sc.bg,
            color: sc.color,
            border: 'none',
            borderRadius: '100px',
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          {(['new', 'contacted', 'closed'] as LeadStatus[]).map((s) => (
            <option
              key={s}
              value={s}
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
              }}
            >
              {s}
            </option>
          ))}
        </select>
      </td>
      <td style={{ padding: '14px 16px' }}>
        <Badge label={lead.priority} bg={pc.bg} color={pc.color} />
      </td>
      <td
        style={{
          padding: '14px 16px',
          color: 'var(--text-muted)',
          fontSize: '12px',
        }}
      >
        {new Date(lead.createdAt).toLocaleDateString()}
      </td>
      <td style={{ padding: '14px 16px' }}>
        <button
          onClick={() => onDelete(lead._id)}
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: 'none',
            color: '#f87171',
            borderRadius: '6px',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
