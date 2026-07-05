'use client'
import { useEffect, useState } from 'react'

export default function FloatingButtons({ onAdminOpen }: { onAdminOpen: () => void }) {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const btnBase: React.CSSProperties = {
    width: 44, height: 44, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', border: '1px solid var(--border)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    transition: 'opacity 0.2s, transform 0.2s, border-color 0.2s',
    fontSize: '1.1rem', fontWeight: 700,
  }

  return (
    <>
      {/* Admin — left */}
      <button onClick={onAdminOpen} title="Admin Panel"
        style={{ ...btnBase, position:'fixed', bottom:24, left:24, zIndex:300, background:'var(--accent2)', color:'#eef0f4', border:'1px solid var(--border-h)' }}
        onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.05)')}
        onMouseLeave={e=>(e.currentTarget.style.transform='')}>
        +
      </button>

      {/* Back to top — right */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Back to top"
        style={{ ...btnBase, position:'fixed', bottom:24, right:24, zIndex:290, background:'var(--surface)', color:'var(--txt2)',
          opacity: showTop ? 1 : 0, transform: showTop ? 'translateY(0)' : 'translateY(12px)', pointerEvents: showTop ? 'auto' : 'none' }}
        onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-h)'; e.currentTarget.style.color='var(--txt)' }}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--txt2)' }}>
        ↑
      </button>
    </>
  )
}
