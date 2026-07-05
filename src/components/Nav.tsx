'use client'

export default function Nav({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 58, background: 'var(--nav)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2.5rem', transition: 'background 0.35s',
      boxShadow: '0 1px 0 rgba(255,255,255,0.06)',
    }}>
      <div className="syne" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--txt)' }}>
        Sandali <span style={{ color: 'var(--accent)' }}>Ruwanya</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.8rem' }}>
          {['about','projects','skills','insights','contact'].map(s => (
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--txt3)' }}>{dark ? 'Dark' : 'Light'}</span>
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            style={{
              width: 38, height: 20, borderRadius: 999, border: '1px solid var(--border)',
              background: 'var(--surface)', cursor: 'pointer', position: 'relative',
              transition: 'background 0.3s',
            }}
          >
            <span style={{
              position: 'absolute', top: 2, left: dark ? 2 : 20,
              width: 14, height: 14, borderRadius: '50%',
              background: 'var(--accent)', transition: 'left 0.3s',
              display: 'block',
            }} />
          </button>
        </div>
      </div>
    </nav>
  )
}
