'use client'
import { useState } from 'react'

export default function Nav({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const links = ['about', 'projects', 'skills', 'insights', 'contact']

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 58, background: 'var(--nav)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1.25rem', transition: 'background 0.35s',
      boxShadow: '0 1px 0 rgba(255,255,255,0.06)',
    }}>
      <div className="syne nav-logo" style={{ fontWeight: 800, color: 'var(--txt)', whiteSpace: 'nowrap' }}>
        Sandali <span style={{ color: 'var(--accent)' }}>Ruwanya</span>
      </div>

      {/* Desktop links */}
      <div className="nav-links" style={{ alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.8rem' }}>
          {links.map(s => (
            <a key={s} href={`#${s}`} style={{
              textDecoration: 'none', color: 'var(--txt2)',
              fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--txt)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt2)')}
            >{s}</a>
          ))}
        </div>
        <ThemeToggle dark={dark} setDark={setDark} />
      </div>

      {/* Mobile: toggle + hamburger button */}
      <div className="nav-mobile-controls" style={{ alignItems: 'center', gap: '0.75rem' }}>
        <ThemeToggle dark={dark} setDark={setDark} />
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen(v => !v)}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 4, display: 'flex', flexDirection: 'column', gap: 4,
          }}
        >
          <span style={{ width: 22, height: 2, background: 'var(--txt)', display: 'block', transition: 'transform 0.25s', transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }} />
          <span style={{ width: 22, height: 2, background: 'var(--txt)', display: 'block', opacity: open ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ width: 22, height: 2, background: 'var(--txt)', display: 'block', transition: 'transform 0.25s', transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div style={{
          position: 'fixed', top: 58, left: 0, right: 0, zIndex: 199,
          background: 'var(--nav)', backdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', padding: '1rem 1.25rem', gap: '0.25rem',
        }}>
          {links.map(s => (
            <a key={s} href={`#${s}`} onClick={() => setOpen(false)} style={{
              textDecoration: 'none', color: 'var(--txt2)',
              fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase',
              padding: '0.75rem 0', borderBottom: '1px solid var(--border)',
            }}>{s}</a>
          ))}
        </div>
      )}

      <style jsx>{`
        .nav-logo {
          font-size: clamp(0.85rem, 3vw, 1.05rem);
        }
        .nav-links {
          display: flex;
        }
        .nav-mobile-controls {
          display: none;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .nav-mobile-controls {
            display: flex;
          }
        }
      `}</style>
    </nav>
  )
}

function ThemeToggle({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span className="theme-label" style={{ fontSize: '0.7rem', color: 'var(--txt3)' }}>{dark ? 'Dark' : 'Light'}</span>
      <button
        onClick={() => setDark(!dark)}
        aria-label="Toggle theme"
        style={{
          width: 38, height: 20, borderRadius: 999, border: '1px solid var(--border)',
          background: 'var(--surface)', cursor: 'pointer', position: 'relative',
          transition: 'background 0.3s', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 2, left: dark ? 2 : 20,
          width: 14, height: 14, borderRadius: '50%',
          background: 'var(--accent)', transition: 'left 0.3s',
          display: 'block',
        }} />
      </button>
      <style jsx>{`
        @media (max-width: 480px) {
          .theme-label {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}