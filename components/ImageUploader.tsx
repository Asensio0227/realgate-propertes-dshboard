'use client';

import { useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  value: string[]; // current image URLs
  onChange: (urls: string[]) => void;
  max?: number; // default 10
}

interface Preview {
  id: string;
  src: string; // object URL while uploading, then Cloudinary URL
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2);
}

function getDoneUrls(previews: Preview[]): string[] {
  return previews.filter((p) => p.status === 'done').map((p) => p.src);
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImageUploader({ value, onChange, max = 10 }: Props) {
  const [previews, setPreviews] = useState<Preview[]>(() =>
    value.map((url) => ({ id: uid(), src: url, status: 'done' as const })),
  );
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Upload one batch of files ──────────────────────────────────────────────
  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files);

    // Validate
    const valid = arr.filter((f) => {
      if (!ACCEPTED.includes(f.type)) return false;
      if (f.size > MAX_SIZE) return false;
      return true;
    });

    if (!valid.length) return;

    // Respect max — read current previews length synchronously before setState
    const remaining = max - previews.filter((p) => p.status !== 'error').length;
    const toUpload = valid.slice(0, remaining);
    if (!toUpload.length) return;

    // Create pending previews with object URLs
    const newPreviews: Preview[] = toUpload.map((f) => ({
      id: uid(),
      src: URL.createObjectURL(f),
      status: 'uploading' as const,
    }));

    // Add new previews — do NOT call onChange here (still uploading)
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Build FormData
    const fd = new FormData();
    toUpload.forEach((f) => fd.append('files', f));

    try {
      const res = await fetch('/api/properties/upload', {
        method: 'POST',
        body: fd,
      });
      const data = (await res.json()) as {
        success: boolean;
        urls?: string[];
        message?: string;
      };

      if (!res.ok || !data.success)
        throw new Error(data.message ?? 'Upload failed');

      const uploadedUrls: string[] = data.urls ?? [];

      // Build updated previews list outside setState so we can call onChange after
      let updatedPreviews: Preview[] = [];

      setPreviews((prev) => {
        const idMap = new Map(
          newPreviews.map((p, i) => [p.id, uploadedUrls[i]]),
        );
        updatedPreviews = prev.map((p) => {
          if (idMap.has(p.id)) {
            URL.revokeObjectURL(p.src);
            return { ...p, src: idMap.get(p.id)!, status: 'done' as const };
          }
          return p;
        });
        return updatedPreviews;
      });

      // Call onChange outside the updater, after the next microtask so state is committed
      // We derive the URLs from updatedPreviews which was captured above
      setTimeout(() => {
        onChange(getDoneUrls(updatedPreviews));
      }, 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';

      let erroredPreviews: Preview[] = [];

      setPreviews((prev) => {
        erroredPreviews = prev.map((p) =>
          newPreviews.some((n) => n.id === p.id)
            ? { ...p, status: 'error' as const, error: msg }
            : p,
        );
        return erroredPreviews;
      });

      // onChange is not called on error — URLs haven't changed
    }
  }

  function remove(id: string) {
    setPreviews((prev) => {
      const p = prev.find((x) => x.id === id);
      if (p?.src.startsWith('blob:')) URL.revokeObjectURL(p.src);
      const next = prev.filter((x) => x.id !== id);
      // Schedule onChange outside the updater
      setTimeout(() => {
        onChange(getDoneUrls(next));
      }, 0);
      return next;
    });
  }

  function reorder(from: number, to: number) {
    setPreviews((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      // Schedule onChange outside the updater
      setTimeout(() => {
        onChange(getDoneUrls(next));
      }, 0);
      return next;
    });
  }

  // ── Drag-over-dropzone ─────────────────────────────────────────────────────
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) void uploadFiles(e.dataTransfer.files);
  }

  const canAdd = previews.filter((p) => p.status !== 'error').length < max;

  // ── Drag-to-reorder state ──────────────────────────────────────────────────
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  return (
    <div>
      {/* ── Drop zone ── */}
      {canAdd && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          style={{
            border: `2px dashed ${dragging ? '#2563eb' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '12px',
            padding: '28px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging
              ? 'rgba(37,99,235,0.06)'
              : 'rgba(255,255,255,0.02)',
            transition: 'all .2s',
            marginBottom: previews.length ? '14px' : '0',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.5 }}>
            🖼
          </div>
          <p
            style={{ fontSize: '13px', color: '#7b8db8', marginBottom: '4px' }}
          >
            Drag &amp; drop images here, or{' '}
            <span style={{ color: '#60a5fa', fontWeight: 600 }}>browse</span>
          </p>
          <p style={{ fontSize: '11px', color: '#3d4f73' }}>
            JPG, PNG, WEBP, GIF · max 10 MB each · up to {max} images
          </p>
          <input
            ref={inputRef}
            type='file'
            multiple
            accept={ACCEPTED.join(',')}
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files) void uploadFiles(e.target.files);
            }}
          />
        </div>
      )}

      {/* ── Preview grid ── */}
      {previews.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
            gap: '10px',
          }}
        >
          {previews.map((p, i) => (
            <div
              key={p.id}
              draggable={p.status === 'done'}
              onDragStart={() => {
                dragItem.current = i;
              }}
              onDragEnter={() => {
                dragOver.current = i;
              }}
              onDragEnd={() => {
                if (
                  dragItem.current !== null &&
                  dragOver.current !== null &&
                  dragItem.current !== dragOver.current
                ) {
                  reorder(dragItem.current, dragOver.current);
                }
                dragItem.current = null;
                dragOver.current = null;
              }}
              onDragOver={(e) => e.preventDefault()}
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                aspectRatio: '1',
                border:
                  p.status === 'error'
                    ? '1px solid rgba(239,68,68,0.4)'
                    : '1px solid rgba(255,255,255,0.08)',
                cursor: p.status === 'done' ? 'grab' : 'default',
                background: '#0b0f1a',
              }}
            >
              {/* Image */}
              <img
                src={p.src}
                alt=''
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity:
                    p.status === 'uploading'
                      ? 0.4
                      : p.status === 'error'
                        ? 0.2
                        : 1,
                  transition: 'opacity .2s',
                }}
              />

              {/* Uploading spinner */}
              {p.status === 'uploading' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,.2)',
                      borderTopColor: '#60a5fa',
                      animation: 'spin .7s linear infinite',
                    }}
                  />
                </div>
              )}

              {/* Error overlay */}
              {p.status === 'error' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>⚠️</span>
                  <span
                    style={{
                      fontSize: '9px',
                      color: '#fca5a5',
                      textAlign: 'center',
                      marginTop: '2px',
                    }}
                  >
                    {p.error ?? 'Failed'}
                  </span>
                </div>
              )}

              {/* First-image badge */}
              {i === 0 && p.status === 'done' && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    background: '#2563eb',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    letterSpacing: '.04em',
                  }}
                >
                  COVER
                </span>
              )}

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(p.id);
                }}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {previews.length > 1 && (
        <p style={{ fontSize: '11px', color: '#3d4f73', marginTop: '8px' }}>
          ↔ Drag thumbnails to reorder · first image is the cover
        </p>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
