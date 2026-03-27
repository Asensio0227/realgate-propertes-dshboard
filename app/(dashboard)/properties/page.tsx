'use client';

import PropertyCard from '@/components/PropertyCard';
import PropertyFormModal from '@/components/PropertyFormModal';
import { useAuthStore } from '@/store/useAuthStore';
import {
  type PropertyData,
  type PropertyForm,
  type SavedProperty,
} from '@/types/property';
import { useEffect, useRef, useState } from 'react';

type FilterType = 'all' | 'sale' | 'rent';
type FilterAvail = 'all' | 'available' | 'taken';

export default function PropertiesPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterAvail, setFilterAvail] = useState<FilterAvail>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PropertyData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [deleteId, setDeleteId] = useState('');
  const [deleting, setDeleting] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterType !== 'all') params.set('type', filterType);
        if (filterAvail === 'available') params.set('available', 'true');
        if (filterAvail === 'taken') params.set('available', 'false');
        if (search.trim()) params.set('search', search.trim());

        const res = await fetch(`/api/properties?${params}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as { properties?: SavedProperty[] };
        setProperties(data.properties ?? []);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError')
          setProperties([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filterType, filterAvail, search]);

  async function handleSave(form: PropertyForm) {
    setSaving(true);
    setSaveError('');
    try {
      const body: Partial<PropertyData> = {
        ...form,
        price: form.price ? Number(form.price) : null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        available: form.available === 'true',
      };

      const url = editing
        ? `/api/properties/${editing._id}`
        : '/api/properties';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        property?: SavedProperty;
        errors?: Record<string, string>;
        message?: string;
      };

      if (!res.ok)
        throw new Error(
          data.errors
            ? Object.values(data.errors).join(', ')
            : (data.message ?? 'Failed to save'),
        );

      const saved = data.property;
      if (!saved) throw new Error('No property returned');

      setProperties((prev) =>
        editing
          ? prev.map((p) => (p._id === editing._id ? saved : p))
          : [saved, ...prev],
      );
      setModalOpen(false);
      setEditing(null);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string, available: boolean) {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available }),
      });
      const data = (await res.json()) as { property?: SavedProperty };
      if (res.ok && data.property)
        setProperties((prev) =>
          prev.map((p) => (p._id === id ? data.property! : p)),
        );
    } catch {
      /* silent */
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/properties/${deleteId}`, { method: 'DELETE' });
      setProperties((prev) => prev.filter((p) => p._id !== deleteId));
      setDeleteId('');
    } catch {
      /* silent */
    } finally {
      setDeleting(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setSaveError('');
    setModalOpen(true);
  }
  function openEdit(p: PropertyData) {
    setEditing(p);
    setSaveError('');
    setModalOpen(true);
  }

  const FilterBtn = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      style={{
        padding: '7px 16px',
        borderRadius: '8px',
        border: 'none',
        background: active ? 'var(--blue)' : 'var(--bg-3)',
        color: active ? '#fff' : 'var(--text-2)',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: active ? 600 : 400,
        fontFamily: 'inherit',
        transition: 'all .15s',
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div
        className='fu'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '22px',
              fontWeight: 800,
              marginBottom: '4px',
            }}
          >
            Properties
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '13px' }}>
            {properties.length} listing{properties.length !== 1 ? 's' : ''}{' '}
            total
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            background: 'var(--blue)',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          + Add Property
        </button>
      </div>

      <div
        className='fu1'
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '22px',
          alignItems: 'center',
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search properties...'
          style={{
            padding: '8px 14px',
            background: 'var(--bg-3)',
            border: '1px solid var(--border-2)',
            borderRadius: '8px',
            color: 'var(--text)',
            fontSize: '13px',
            outline: 'none',
            width: '220px',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--blue)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-2)')}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          <FilterBtn
            label='All Types'
            active={filterType === 'all'}
            onClick={() => setFilterType('all')}
          />
          <FilterBtn
            label='For Sale'
            active={filterType === 'sale'}
            onClick={() => setFilterType('sale')}
          />
          <FilterBtn
            label='For Rent'
            active={filterType === 'rent'}
            onClick={() => setFilterType('rent')}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <FilterBtn
            label='All'
            active={filterAvail === 'all'}
            onClick={() => setFilterAvail('all')}
          />
          <FilterBtn
            label='Available'
            active={filterAvail === 'available'}
            onClick={() => setFilterAvail('available')}
          />
          <FilterBtn
            label='Taken'
            active={filterAvail === 'taken'}
            onClick={() => setFilterAvail('taken')}
          />
        </div>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px',
            color: 'var(--text-3)',
            fontSize: '13px',
          }}
        >
          Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              marginBottom: '12px',
              color: 'var(--text-3)',
            }}
          >
            ⊞
          </div>
          <p
            style={{
              color: 'var(--text-2)',
              marginBottom: '6px',
              fontSize: '14px',
            }}
          >
            No properties found
          </p>
          <p style={{ color: 'var(--text-3)', fontSize: '12px' }}>
            {search
              ? 'Try different search terms or filters'
              : 'Click "+ Add Property" to get started'}
          </p>
        </div>
      ) : (
        <div
          className='fu2'
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {properties.map((p) => (
            <PropertyCard
              key={p._id}
              property={p}
              onEdit={openEdit}
              onDelete={setDeleteId}
              onToggle={handleToggle}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      <PropertyFormModal
        open={modalOpen}
        instanceKey={editing?._id ?? 'new'}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
        saving={saving}
        error={saveError}
      />

      {deleteId && (
        <div
          onClick={(e) => e.target === e.currentTarget && setDeleteId('')}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border-2)',
              borderRadius: '14px',
              padding: '28px',
              maxWidth: '380px',
              width: '100%',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: '16px',
                marginBottom: '10px',
              }}
            >
              Delete Property?
            </h3>
            <p
              style={{
                color: 'var(--text-2)',
                fontSize: '13px',
                marginBottom: '24px',
                lineHeight: 1.6,
              }}
            >
              This action cannot be undone. The property will be permanently
              removed.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setDeleteId('')}
                style={{
                  background: 'var(--bg-4)',
                  border: '1px solid var(--border-2)',
                  color: 'var(--text-2)',
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
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  background: 'rgba(239,68,68,.15)',
                  border: '1px solid rgba(239,68,68,.3)',
                  color: 'var(--red)',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
