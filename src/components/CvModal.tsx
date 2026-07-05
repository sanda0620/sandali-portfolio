'use client'
import { useEffect } from 'react'

export default function CvModal({
  cvUrl = '/cv.pdf',
  onClose,
}: {
  cvUrl?: string
  onClose: () => void
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h) }
  }, [onClose])

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
      }}
    >
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 16, width: 'min(820px,94vw)', height: '88vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.4rem', borderBottom: '1px solid var(--border)', flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'Syne,sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--txt)' }}>
            Sandali Ruwanya — Curriculum Vitae
          </span>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            {cvUrl && (
              <button
                onClick={() => window.open(cvUrl, '_blank')}
                style={{
                  padding: '0.38rem 0.9rem', background: 'var(--accent)', color: 'var(--bg)',
                  border: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'DM Sans,sans-serif',
                }}
              >
                Open in new tab
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)',
                background: 'var(--surface)', color: 'var(--txt2)', fontSize: '1rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {cvUrl ? (
            <iframe
              src={cvUrl}
              title="Sandali Ruwanya CV"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '100%', flexDirection: 'column', gap: '1rem', color: 'var(--txt2)',
            }}>
              <div style={{ fontSize: '2rem' }}>📄</div>
              <div style={{ fontSize: '0.85rem' }}>No CV uploaded yet.</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--txt3)' }}>
                Go to Admin Panel → Update CV to upload your CV.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}