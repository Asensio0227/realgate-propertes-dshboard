'use client';

import { useRef, useState } from 'react';

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

interface Preview {
  id: string;
  src: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

function uid() {
  return Math.random().toString(36).slice(2);
}
function getDoneUrls(previews: Preview[]) {
  return previews.filter((p) => p.status === 'done').map((p) => p.src);
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageUploader({ value, onChange, max = 10 }: Props) {
  const [previews, setPreviews] = useState<Preview[]>(() =>
    value.map((url) => ({ id: uid(), src: url, status: 'done' as const })),
  );
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  async function uploadFiles(files: FileList | File[]) {
    const valid = Array.from(files).filter(
      (f) => ACCEPTED.includes(f.type) && f.size <= MAX_SIZE,
    );
    if (!valid.length) return;
    const remaining = max - previews.filter((p) => p.status !== 'error').length;
    const toUpload = valid.slice(0, remaining);
    if (!toUpload.length) return;

    const newPreviews: Preview[] = toUpload.map((f) => ({
      id: uid(),
      src: URL.createObjectURL(f),
      status: 'uploading' as const,
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);

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

      const uploadedUrls = data.urls ?? [];
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
      setTimeout(() => {
        onChange(getDoneUrls(updatedPreviews));
      }, 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setPreviews((prev) =>
        prev.map((p) =>
          newPreviews.some((n) => n.id === p.id)
            ? { ...p, status: 'error' as const, error: msg }
            : p,
        ),
      );
    }
  }

  function remove(id: string) {
    setPreviews((prev) => {
      const p = prev.find((x) => x.id === id);
      if (p?.src.startsWith('blob:')) URL.revokeObjectURL(p.src);
      const next = prev.filter((x) => x.id !== id);
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
      setTimeout(() => {
        onChange(getDoneUrls(next));
      }, 0);
      return next;
    });
  }

  const canAdd = previews.filter((p) => p.status !== 'error').length < max;

  return (
    <div>
      {canAdd && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files.length)
              void uploadFiles(e.dataTransfer.files);
          }}
          style={{
            border: `2px dashed ${dragging ? 'var(--green)' : 'var(--border-2)'}`,
            borderRadius: '12px',
            padding: '28px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'var(--green-dim)' : 'var(--bg-3)',
            transition: 'all .2s',
            marginBottom: previews.length ? '14px' : '0',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.5 }}>
            🖼
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: '4px',
            }}
          >
            Drag &amp; drop images here, or{' '}
            <span style={{ color: 'var(--green)', fontWeight: 600 }}>
              browse
            </span>
          </p>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              opacity: 0.7,
            }}
          >
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
                )
                  reorder(dragItem.current, dragOver.current);
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
                    ? '1px solid rgba(192,57,43,0.35)'
                    : '1px solid var(--border)',
                cursor: p.status === 'done' ? 'grab' : 'default',
                background: 'var(--bg-3)',
              }}
            >
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
                      border: '2px solid var(--green-border)',
                      borderTopColor: 'var(--green)',
                      animation: 'spin .7s linear infinite',
                    }}
                  />
                </div>
              )}

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
                      color: 'var(--red)',
                      textAlign: 'center',
                      marginTop: '2px',
                    }}
                  >
                    {p.error ?? 'Failed'}
                  </span>
                </div>
              )}

              {i === 0 && p.status === 'done' && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    background: 'var(--green)',
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
                  background: 'rgba(26,74,46,0.65)',
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
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginTop: '8px',
          }}
        >
          ↔ Drag thumbnails to reorder · first image is the cover
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
